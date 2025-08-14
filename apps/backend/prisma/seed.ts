import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  await prisma.user.create({
    data: {
      id: 'cme7ab58z0000ul78mysm7ot6',
      first_name: 'Daniel',
      last_name: 'Feddy',
      email: 'daniel.feddy0123@gmail.com',
      clerkUserId: 'user_319CwggYVslwK4CkeIoKJdGojpK',
      createdAt: new Date('2025-08-01T10:00:00Z'), // account creation date
    },
  });

  // Create subscription
  await prisma.subscription.create({
    data: {
      id: 'testingID',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      stripeId: 'sub_1RvnDq4eWgFBXKF6mNCI5cqJ',
      status: 'testingStatus',
      plan: 'Basic',
      currentPeriodEnd: new Date('2025-09-13T22:32:00Z'),
      reportsAllowed: 10,
    },
  });

  // Create property
  await prisma.property.create({
    data: {
      id: 'propertyone',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      address: '123 Example Street, Exampletown, EX4 1MP',
      details: {
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        description:
          'A well-presented three bedroom terraced house in a popular residential area. The property features a modern kitchen, spacious living room, and a private garden.',
      },
    },
  });

  await prisma.property.create({
    data: {
      id: 'propertytwo',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      address: '456 Example Road, Exampletown, EX5 2YZ',
      details: {
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        description:
          'A spacious three bedroom semi-detached property, ideal for HMO conversion. Located near a university and public transport links, with a large rear garden.',
      },
    },
  });

  await prisma.property.create({
    data: {
      id: 'propertythree',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      address: '789 Coastal View, Exampletown, EX6 3CD',
      details: {
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        description:
          'A charming coastal property with stunning sea views, perfect for serviced accommodation. Features modern interiors and a short walk to the beach.',
      },
    },
  });

  await prisma.report.create({
    data: {
      id: 'reportone',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      propertyId: 'propertyone',
      address: '123 Example Street, Exampletown, EX4 1MP',
      analysis: {
        type: 'brr',
        price: 450000,
        name: 'Buy-Refurbish-Refinance',
        roi: 12.4,
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
        cashflow: 220,
        potentialValue: 525000,
        recommendations: [
          'Focus renovation on kitchen and bathrooms for maximum value',
          'Consider converting loft space for additional bedroom',
          'Budget £35,000-£45,000 for comprehensive renovations',
          'This property could also work well as a HMO given the size and number of potential rooms',
        ],
        refinanceAmount: 393750,
      },
    },
  });

  await prisma.report.create({
    data: {
      id: 'reporttwo',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      propertyId: 'propertytwo',
      address: '3 Vernon Road, Manchester, M25 0GW',
      analysis: {
        type: 'hmo',
        price: 450000,
        name: 'HMO',
        roi: 9.6,
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
        cashflow: 1320,
        rooms: 5,
        totalIncome: 3250,
        recommendations: [
          'Budget £15,000-£20,000 for HMO conversion costs',
          'Ensure compliance with minimum room size regulations',
          'Consider dedicated HMO management (12-15% fee)',
          'This property could also work well as a Buy-Refurbish-Refinance project due to its potential for value increase after converting to HMO',
        ],
      },
    },
  });

  await prisma.report.create({
    data: {
      id: 'reportthree',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      propertyId: 'propertythree',
      address: '126 Park Road, Manchester, M25 0DU',
      analysis: {
        type: 'servicedAccommodation',
        price: 450000,
        name: 'Serviced Accommodation',
        roi: 10.8,
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
        cashflow: 750,
        occupancyRate: 68,
        recommendations: [
          'Invest in high-quality furnishings for better reviews',
          'Professional photography will improve booking rates',
          'Consider management service specializing in SA (15-20% fee)',
          'A traditional Buy-to-Let approach could be more stable if consistent income is preferred over higher seasonal returns',
        ],
        averageDailyRate: 125,
      },
    },
  });

  await prisma.report.create({
    data: {
      id: 'reportfour',
      userId: 'cme7ab58z0000ul78mysm7ot6',
      propertyId: 'propertyone',
      address: '11 Demo Avenue, Preston, SW4 2BN',
      analysis: {
        type: 'buyToLet',
        price: 450000,
        name: 'Buy-to-Let',
        roi: 6.2,
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
        cashflow: 350,
        rentalYield: 5.8,
        monthlyIncome: 1250,
        recommendations: [
          'Consider minor kitchen updates to increase rental value',
          'Tenant demand is high for 2-bed properties in this area',
          'Property management services average 10-12% in this location',
          'This property might perform better as a Serviced Accommodation due to its prime location near tourist attractions',
        ],
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
