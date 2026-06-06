import { PrismaClient } from "@prisma/client";
import { seedHtmlCssCourse } from "./seed/html-css";
import { seedJsCourse } from "./seed/javascript";
import { seedPythonCourse } from "./seed/python";
import { seedCppCourse } from "./seed/cpp";
import { seedAchievements } from "./seed/achievements";
import { seedPlacementQuestions } from "./seed/placement-questions";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding courses...");

  await seedHtmlCssCourse(prisma);
  console.log("✓ HTML & CSS course seeded");

  await seedJsCourse(prisma);
  console.log("✓ JavaScript course seeded");

  await seedPythonCourse(prisma);
  console.log("✓ Python course seeded");

  await seedCppCourse(prisma);
  console.log("✓ C++ course seeded");

  await seedAchievements(prisma);
  console.log("✓ Achievements seeded");

  await seedPlacementQuestions(prisma);
  console.log("✓ Placement questions seeded");

  console.log("\nAll seed data complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
