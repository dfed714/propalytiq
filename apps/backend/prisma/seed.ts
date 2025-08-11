import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      first_name: 'Daniel',
      last_name: 'Feddy',
      email: 'daniel.feddy0123@gmail.com',
      clerkUserId: 'user_318PLdUg1J9v5Aa0EbOtWxIeWTG',
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
