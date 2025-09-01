/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException } from '@nestjs/common';
import OpenAI from 'openai';

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
   * Simple text chat (kept for your /ai/chat controller).
   * Returns plain text from a normal chat completion.
   */
  async chat(prompt: string, modelFromReq?: string) {
    const model = modelFromReq || process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    try {
      const completion = await this.client.chat.completions.create({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      });

      const text = completion.choices[0]?.message?.content ?? '';
      return {
        id: completion.id,
        model: completion.model,
        text,
        usage: (completion as any).usage ?? null,
      };
    } catch (err: any) {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        err?.response?.status ||
        500;

      const details = err?.response?.data ??
        err?.error ?? { message: err?.message || 'OpenAI request failed' };

      throw new HttpException(
        {
          message: 'Failed to get response from OpenAI',
          details,
        },
        status,
      );
    }
  }

  /**
   * JSON-enforced chat. Forces the model to return a single JSON object.
   * Safely parses and falls back to extracting the first {...} block if needed.
   */
  async chatJson(
    prompt: string,
    modelFromReq?: string,
  ): Promise<{
    id: string;
    model: string;
    object: any;
    raw: string;
  }> {
    const model = modelFromReq || process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    try {
      const completion = await this.client.chat.completions.create({
        model,
        temperature: 1,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You return ONLY valid JSON — no prose, no markdown.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      let object: any = {};
      try {
        object = JSON.parse(raw);
      } catch {
        object = this.tryExtractJson(raw);
      }

      return {
        id: completion.id,
        model: completion.model,
        object,
        raw,
      };
    } catch (err: any) {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        err?.response?.status ||
        500;

      const details = err?.response?.data ??
        err?.error ?? { message: err?.message || 'OpenAI request failed' };

      throw new HttpException(
        {
          message: 'Failed to get response from OpenAI (json)',
          details,
        },
        status,
      );
    }
  }

  /** Very conservative JSON extractor when the model sneaks extra text */
  private tryExtractJson(s: string): any {
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(s.slice(start, end + 1));
      } catch {
        return {};
      }
    }
    return {};
  }

  async getPropertyInfo(
    prompt: string,
    modelFromReq?: string,
  ): Promise<{
    id: string;
    model: string;
    object: {
      property_address: string | null;
      purchase_price: number | null;
      rental_price_per_month: number | null;
      number_of_bedrooms: number | null;
      number_of_bathrooms: number | null;
      square_footage: number | null;
      property_type: string | null;
      property_description: string | null;
    };
    raw: string;
  }> {
    const model = modelFromReq || process.env.OPENAI_MODEL_FAST || 'gpt-5-nano';

    const findFirstUrl = (s: string) =>
      (s.match(/https?:\/\/[^\s)]+/i) || [null])[0];
    const cleanHtmlToText = (html: string) =>
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&amp;|&quot;|&#39;|&lt;|&gt;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const toNum = (v: any): number | null => {
      if (v == null) return null;
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string') {
        const m = v.replace(/[, ]+/g, '').match(/-?\d+(\.\d+)?/);
        if (m) {
          const n = Number(m[0]);
          return Number.isFinite(n) ? n : null;
        }
      }
      return null;
    };

    const sourceUrl = findFirstUrl(prompt);
    let text: string;
    if (sourceUrl) {
      const res = await fetch(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const html = await res.text();
      // Trim hard for speed; increase to 10–15k if recall suffers.
      text = cleanHtmlToText(html).slice(0, 8000);
    } else {
      // If no URL, treat prompt as the listing text/details
      text = prompt.slice(0, 8000);
    }

    const completion = await this.client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Return ONLY valid JSON with these keys: property_address, purchase_price, rental_price_per_month, number_of_bedrooms, number_of_bathrooms, square_footage, property_type, property_description. Use null when unknown. Numbers must be numeric.',
        },
        {
          role: 'user',
          content: (sourceUrl ? `URL: ${sourceUrl}\n` : '') + 'TEXT:\n' + text,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let obj: any;
    try {
      obj = JSON.parse(raw);
    } catch {
      obj = {};
    }

    const cleaned = {
      property_address: obj.property_address ?? null,
      purchase_price: toNum(obj.purchase_price),
      rental_price_per_month: toNum(obj.rental_price_per_month),
      number_of_bedrooms: toNum(obj.number_of_bedrooms),
      number_of_bathrooms: toNum(obj.number_of_bathrooms),
      square_footage: toNum(obj.square_footage),
      property_type: obj.property_type ?? null,
      property_description: obj.property_description ?? null,
    };

    // (Optional) log exact token usage:
    // console.log("usage:", completion.usage); // { prompt_tokens, completion_tokens, total_tokens }

    return {
      id: completion.id,
      model: completion.model,
      object: cleaned,
      raw,
    };
  }
}
