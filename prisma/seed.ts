import { PrismaClient } from "@prisma/client";

import { seedDefaultPortfolioContent } from "../src/lib/portfolio-seed";

const prisma = new PrismaClient();

async function main() {
  await seedDefaultPortfolioContent(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
