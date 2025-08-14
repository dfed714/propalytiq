import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
await prisma.user.create({
  data: {
    id: 'cme7ab58z0000ul78mysm7ot6',
    first_name: 'Daniel',
    last_name: 'Feddy',
    email: 'daniel.feddy0123@gmail.com',
    clerkUserId: 'user_318PLdUg1J9v5Aa0EbOtWxIeWTG',
    createdAt: new Date('2025-08-01T10:00:00Z'), // account creation date
  },
});

await prisma.subscription.create({
  data: {
    id: 'testingID',
    userId: 'cme7ab58z0000ul78mysm7ot6',
    stripeId: 'sub_1RvnDq4eWgFBXKF6mNCI5cqJ',
    status: 'testingStatus',
    plan: 'Basic',
    currentPeriodEnd: new Date('2025-09-13T22:32:00Z'),
    reportsAllowed: 10 // ✅ set a plan limit
  },
});

await prisma.property.create({
  data: {
    id: 'propertyone',
    userId: 'cme7ab58z0000ul78mysm7ot6',
    address: '123 Example Street, Exampletown, EX4 1MP',
    details: {
      price: '450000',
      bedrooms: 3,
      bathrooms: 2,
      description:
        'A well-presented three bedroom terraced house in a popular residential area. The property features a modern kitchen, spacious living room, and a private garden.',
    },
  },
});

await prisma.report.create({
  data: {
    id: 'reportone',
    propertyId: 'propertyone',
    analysis: {
      price: '450000',
      address: '123 Example Street, Exampletown, EX4 1MP',
      bedrooms: 3,
      bathrooms: 2,
      strategies: {
        brr: {
          roi: '12.4',
          cons: [
            'Renovation costs could exceed estimates',
            'Refinance rates may change during project',
            'Planning permission may be required for extensions',
          ],
          pros: [
            'Strong potential for value increase after renovation',
            'Area is undergoing regeneration',
            'Property layout ideal for modernization',
          ],
          title: 'Buy-Refurbish-Refinance',
          cashflow: '220',
          potentialValue: '525000',
          recommendations: [
            'Focus renovation on kitchen and bathrooms for maximum value',
            'Consider converting loft space for additional bedroom',
            'Budget £35,000-£45,000 for comprehensive renovations',
            'This property could also work well as a HMO given the size and number of potential rooms',
          ],
          refinanceAmount: '393750',
        },
        hmo: {
          roi: '9.6',
          cons: [
            'HMO licensing required (£1,000-£1,500)',
            'Fire safety regulations will require investments',
            'Higher tenant turnover than standard BTL',
          ],
          pros: [
            'High demand for rooms in this location',
            'Property layout suitable for conversion',
            'University nearby ensures consistent tenant pool',
          ],
          rooms: '5',
          title: 'HMO',
          cashflow: '1320',
          totalIncome: '3250',
          recommendations: [
            'Budget £15,000-£20,000 for HMO conversion costs',
            'Ensure compliance with minimum room size regulations',
            'Consider dedicated HMO management (12-15% fee)',
            'This property could also work well as a Buy-Refurbish-Refinance project due to its potential for value increase after converting to HMO',
          ],
        },
        buyToLet: {
          roi: '6.2',
          cons: [
            'Local rental market is competitive',
            'Property may need minor updates in 2-3 years',
            'Limited capital growth potential',
          ],
          pros: [
            'Stable monthly income',
            'Property prices in this area have risen 15% over 5 years',
            'Low maintenance costs compared to similar properties',
          ],
          title: 'Buy-to-Let',
          cashflow: '350',
          rentalYield: '5.8',
          monthlyIncome: '1250',
          recommendations: [
            'Consider minor kitchen updates to increase rental value',
            'Tenant demand is high for 2-bed properties in this area',
            'Property management services average 10-12% in this location',
            'This property might perform better as a Serviced Accommodation due to its prime location near tourist attractions',
          ],
        },
        servicedAccommodation: {
          roi: '10.8',
          cons: [
            'Seasonal fluctuations may impact winter income',
            'Higher management requirements than standard BTL',
            'Local regulations may change for short-term rentals',
          ],
          pros: [
            'High tourism in the area drives demand',
            'Property location ideal for short-term rentals',
            'Premium potential during summer months',
          ],
          title: 'Serviced Accommodation',
          cashflow: '750',
          occupancyRate: '68',
          recommendations: [
            'Invest in high-quality furnishings for better reviews',
            'Professional photography will improve booking rates',
            'Consider management service specializing in SA (15-20% fee)',
            'A traditional Buy-to-Let approach could be more stable if consistent income is preferred over higher seasonal returns',
          ],
          averageDailyRate: '125',
        },
      },
      description:
        'A well-presented three bedroom terraced house in a popular residential area. The property features a modern kitchen, spacious living room, and a private garden.',
    },
  },
});

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
