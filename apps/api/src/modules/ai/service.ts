/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import { PropertyInfoDto } from './dtos/property-info.dto';
import { AnalysisRequestDto, AnalysisResponse } from './dtos/analysis.dto';
import { coerceNum, safeParseJson } from '@utils/property-scrape.util';

@Injectable()
export class AiService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Uses OpenAI Responses API with the hosted `web_search` tool.
   * The model will open ONLY the provided URL and extract fields per schema.
   * Requires: project with web search enabled; supported models (e.g., gpt-4o / gpt-4o-mini).
   */
  async getPropertyInfo(url: string): Promise<{
    id: string;
    model: string;
    object: PropertyInfoDto;
    raw: string;
  }> {
    const model = process.env.OPENAI_MODEL_FAST || 'gpt-4o-mini-2024-08-06';

    // --- minimal validation
    let target: URL;
    try {
      target = new URL(url);
      if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        throw new Error('bad protocol');
      }
    } catch {
      const empty = new PropertyInfoDto();
      return {
        id: 'invalid-url',
        model,
        object: empty,
        raw: '{}',
      };
    }

    // Clear, schema-like instruction (no response_format here)
    const instruction = `You are a scraper. Visit ONLY this listing URL and extract details strictly from that page (no other sources):
URL: ${target.toString()}

Return ONLY a JSON object with EXACTLY these keys:
- property_address (string or null)
- purchase_price (number or null, no currency symbols)
- rental_price_per_month (number or null, no currency symbols)
- number_of_bedrooms (number or null)
- number_of_bathrooms (number or null)
- property_type (string or null)
- property_description (string or null; write a short, neutral summary)

Rules:
- If a field is missing on the page, set it to null.
- Numbers MUST be numeric (e.g., 450000, 1800, 3). No text.
- Do not add extra keys or prose. Output ONLY JSON.`;

    // Use Responses API + web_search tool so the model can browse
    const resp = await this.client.responses.create({
      model,
      input: instruction,
      tools: [{ type: 'web_search' }],
    });

    const raw = (resp as any).output_text ?? JSON.stringify(resp.output);
    const parsed = safeParseJson(raw) ?? {};

    // Coerce + sanitize into your DTO shape
    const cleaned: PropertyInfoDto = Object.assign(new PropertyInfoDto(), {
      property_address: parsed.property_address ?? null,
      purchase_price: coerceNum(parsed.purchase_price),
      rental_price_per_month: coerceNum(parsed.rental_price_per_month),
      number_of_bedrooms: coerceNum(parsed.number_of_bedrooms),
      number_of_bathrooms: coerceNum(parsed.number_of_bathrooms),
      property_type: parsed.property_type ?? null,
      property_description: parsed.property_description ?? null,
    });

    return {
      id: resp.id,
      model: resp.model,
      object: cleaned,
      raw,
    };
  }

  // ---------------------------------------------------------------------------

  async analysis(body: AnalysisRequestDto): Promise<AnalysisResponse> {
    console.log('AI Service received body:', body);
    if (!body?.investment_strategy) {
      throw new BadRequestException('strategy is required');
    }
    if (
      body.investment_strategy === 'Rent-To-Rent' &&
      body.rental_price_per_month !== null
    ) {
      throw new BadRequestException(
        'Rent-To-Rent is locked if rental price was selected.',
      );
    }

    // Normalize investment_strategy to match enum values (case-insensitive)
    let strategy = body.investment_strategy.trim();
    if (strategy.toLowerCase() === 'buy-to-let') strategy = 'Buy-To-Let';
    if (strategy.toLowerCase() === 'buy-refurbish-refinance')
      strategy = 'Buy-Refurbish-Refinance';
    // Add similar normalizations for other strategies if needed
    body.investment_strategy = strategy;

    const norm = body.investment_strategy.toLowerCase();
    const spec =
      norm.includes('buy-to-let') ||
      norm.includes('buy to let') ||
      norm.includes('btl')
        ? {
            label: 'Buy-to-Let',
            topStats: [
              'ROI (%)',
              'Rental Yield (%)',
              'Monthly Income (£)',
              'Monthly Cashflow (£)',
            ],
            projection: {
              x_label: 'Years (1–25)',
              y_label: 'Net Cashflow (£)',
              x_kind: 'years_1_25',
            },
          }
        : norm.includes('serviced accommodation') ||
            norm.includes('holiday let') ||
            norm === 'sa'
          ? {
              label: 'Serviced Accommodation / Holiday Let',
              topStats: [
                'Average Nightly Rate (£)',
                'Occupancy Rate (%)',
                'Monthly Gross Income (£)',
                'Monthly Net Cashflow (£)',
              ],
              projection: {
                x_label: 'Months (1–12)',
                y_label: 'Monthly Net Cashflow (£)',
                x_kind: 'months_1_12',
              },
            }
          : norm.includes('brrr') ||
              norm.includes('buy-refurbish-refinance') ||
              norm.includes('buy refurbish refinance')
            ? {
                label: 'Buy-Refurbish-Refinance (BRRR)',
                topStats: [
                  'Initial Investment (£) (Deposit + Refurbishment)',
                  'Refinance Value (£)',
                  'Cash Pulled Out (%)',
                  'Post-Refi ROI (%)',
                ],
                projection: {
                  x_label: 'Stages (Purchase → Renovation → Refinance → Rent)',
                  y_label: 'Net Cash Invested (£)',
                  x_kind: 'stages_brrr',
                },
              }
            : norm.includes('flip') ||
                norm.includes('buy-to-sell') ||
                norm.includes('buy to sell')
              ? {
                  label: 'Flip (Buy-to-Sell)',
                  topStats: [
                    'Purchase Price (£)',
                    'Renovation Cost (£)',
                    'Projected Sale Price (£)',
                    'Profit Margin (%)',
                  ],
                  projection: {
                    x_label: 'Timeline (Month 0 → Sale Month)',
                    y_label: 'Costs vs Expected Sale Price (£)',
                    x_kind: 'timeline_flip',
                  },
                }
              : norm.includes('hmo')
                ? {
                    label: 'HMO (House in Multiple Occupation)',
                    topStats: [
                      'Total Monthly Income (£)',
                      'Net Monthly Cashflow (£)',
                      'Occupancy Rate (%)',
                      'ROI (%)',
                    ],
                    projection: {
                      x_label: 'Months (1–12)',
                      y_label: 'Monthly Net Cashflow (£)',
                      x_kind: 'months_1_12',
                    },
                  }
                : norm.includes('rent-to-rent') ||
                    norm.includes('rent to rent') ||
                    norm.includes('airbnb') ||
                    norm.includes('commercial lease')
                  ? {
                      label: 'Rent-to-Rent (Airbnb / Commercial Lease Model)',
                      topStats: [
                        'Lease Cost (£ / month)',
                        'Average Monthly Income (£)',
                        'Occupancy Rate (%)',
                        'Monthly Profit (£)',
                      ],
                      projection: {
                        x_label: 'Months (1–12)',
                        y_label: 'Monthly Net Profit (£)',
                        x_kind: 'months_1_12',
                      },
                    }
                  : null;

    if (!spec) {
      throw new BadRequestException('unsupported investment strategy');
    }

    const model = process.env.OPENAI_MODEL_FAST || 'gpt-5-nano';

    const instruction = `
You are a property investment analyst.

INPUT_JSON:
${JSON.stringify(body)}

STRATEGY_SPEC:
${JSON.stringify(spec)}

TASK:
- Using the numbers in INPUT_JSON, calculate the outputs required by STRATEGY_SPEC.
- If a number is missing and blocks a calculation, assume reasonable default values based on typical property investment scenarios in the relevant context to ensure all fields have real numeric values. Do not set any field to null.
- Produce a strict JSON object matching the "AnalysisResponse" shape below.
- "top_stats" MUST include exactly the keys listed in STRATEGY_SPEC.topStats with number values (no nulls).
- "projection":
  - Use x_label and y_label from STRATEGY_SPEC.
  - points MUST be plottable with correct x values suitable for a Next.js graphing library like Recharts or Chart.js:
    * Ensure "x" is always a number or string as specified, and "y" is always a number (no nulls or undefined).
    * For "years_1_25": x = 1..25 (integers), y = the cumulative net cashflow accumulated up to that year (sum of annual net cashflows from year 1 to the current x, reflecting ongoing cashflow trends with reasonable growth or decline based on input data or defaults).
    * For "months_1_12": x = 1..12 (integers), y = the cumulative net cashflow/profit accumulated up to that month (sum of monthly net cashflows from month 1 to the current x, accounting for seasonal variations if applicable).
    * For "stages_brrr": x in ["Purchase","Renovation","Refinance","Rent"] (strings), y = the cumulative net cash invested or returned at each stage (reflecting the running total of cash flow from the start through each phase).
    * For "timeline_flip": x = integers from 0 to sale_month (inclusive), each point MUST include "costs" (cumulative total costs up to that month) and "expected_sale_price" (constant ARV); "y" is the cumulative net profit/loss up to that month if provided, calculated as expected_sale_price minus cumulative costs.
  - If you need to assume values to compute points, do so reasonably based on UK property market averages (e.g., 3% annual rent growth, 2% expense inflation, 75% LTV mortgage) to avoid an empty "points" array. Always provide at least the minimum points required for the x_kind.
- "strengths", "weaknesses", and "recommendations" MUST each contain 3–4 short, strategy-specific strings based on the calculated data and assumptions.

STRICT OUTPUT:
Return ONLY JSON with this exact TypeScript shape (no extra keys, no prose):
{
  "investment_strategy": string,
  "top_stats": Record<string, number>,
  "projection": {
    "x_label": string,
    "y_label": string,
    "points": Array<{
      "x": number | string,
      "y"?: number,
      "costs"?: number,
      "expected_sale_price"?: number
    }>
  },
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[]
}
`.trim();

    const resp = await this.client.responses.create({
      model,
      input: instruction,
    });

    const raw =
      (resp as any).output_text ??
      (Array.isArray((resp as any).output)
        ? JSON.stringify((resp as any).output)
        : '');
    const parsed = safeParseJson(raw);
    if (!parsed) {
      throw new BadRequestException('failed to parse analysis JSON');
    }
    return parsed as AnalysisResponse;
  }
}
