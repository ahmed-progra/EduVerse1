import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const courses = await p.course.findMany({ include: { lessons: { take: 2, orderBy: { order: "asc" } } } });
  for (const c of courses) {
    console.log(c.slug, c.title);
    for (const l of c.lessons) {
      console.log("  ", l.slug, l.title);
    }
  }
  await p.$disconnect();
}
main();
