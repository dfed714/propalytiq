import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { z } from 'zod';

//
// 1. Strategy-specific schemas
//
const BRRStrategySchema = z.object({
  type: z.literal("brr"),
  price: z.number(),
  name: z.string(),
  roi: z.number(),
  cons: z.array(z.string()),
  pros: z.array(z.string()),
  cashflow: z.number(),
  potentialValue: z.number(),
  recommendations: z.array(z.string()),
  refinanceAmount: z.number(),
});

const HMOStrategySchema = z.object({
  type: z.literal("hmo"),
  price: z.number(),
  name: z.string(),
  roi: z.number(),
  cons: z.array(z.string()),
  pros: z.array(z.string()),
  cashflow: z.number(),
  rooms: z.number(),
  totalIncome: z.number(),
  recommendations: z.array(z.string()),
});

const ServicedAccommodationStrategySchema = z.object({
  type: z.literal("servicedAccommodation"),
  price: z.number(),
  name: z.string(),
  roi: z.number(),
  cons: z.array(z.string()),
  pros: z.array(z.string()),
  cashflow: z.number(),
  occupancyRate: z.number(),
  recommendations: z.array(z.string()),
  averageDailyRate: z.number(),
});

const BuyToLetStrategySchema = z.object({
  type: z.literal("buyToLet"),
  price: z.number(),
  name: z.string(),
  roi: z.number(),
  cons: z.array(z.string()),
  pros: z.array(z.string()),
  cashflow: z.number(),
  rentalYield: z.number(),
  monthlyIncome: z.number(),
  recommendations: z.array(z.string()),
});


//
// 2. Discriminated union for all strategies
//
const StrategySchema = z.discriminatedUnion("type", [
  BRRStrategySchema,
  HMOStrategySchema,
  BuyToLetStrategySchema,
  ServicedAccommodationStrategySchema,
]);

//
// 3. Analysis schema — a single chosen strategy
//
const ReportSchema = z.object({
  analysis: StrategySchema,
});

type Report = z.infer<typeof ReportSchema>;

//
// 4. Dashboard service
//
@Injectable()
export class DashboardService {
  constructor(private readonly userService: UserService) {}

  async getDashboardData(clerkId: string) {
    const user = await this.userService.getUserByClerkId(clerkId);
    if (!user) throw new NotFoundException('User not found');

    // Recent reports
    const recentReports = user.reports.slice(0, 3);

    // Calculate average ROI (only valid strategies)
    const roiValues: number[] = [];
    for (const report of user.reports) {
      try {
        // Parse only the strategy part of the report
        const parsed: Report = ReportSchema.parse(report);
        roiValues.push(parsed.analysis.roi);
      } catch (err) {
        console.warn(`Invalid analysis data for report ${report.id}`, err);
      }
    }

    const totalRoi = roiValues.reduce((sum, roi) => sum + roi, 0);
    const averageRoi = roiValues.length > 0 ? totalRoi / roiValues.length : 0;

    // Account age in months
    const created = new Date(user.createdAt);
    const now = new Date();
    const currentMonth =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth()) +
      1;

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      subscription: user.subscription,
      reports: user.reports,
      recentReports,
      averageRoi,
      currentMonth,
      createdAt: user.createdAt,
    };
  }
}
