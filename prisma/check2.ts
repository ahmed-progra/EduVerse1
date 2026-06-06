import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const l = await p.lesson.findFirst({ where: { slug: "introduction-web-development" } });
  if (l) {
    console.log(JSON.stringify({
      slug: l.slug,
      title: l.title,
      exerciseType: l.exerciseType,
      language: l.language,
      exercisePrompt: l.exercisePrompt?.slice(0, 100),
      starterCode: l.starterCode?.slice(0, 100),
      hasQuiz: !!l.quiz,
      quizLen: (l.quiz || "").length,
      objectivesLen: (l.learningObjectives || "").length,
    }));
  } else {
    console.log("lesson not found");
  }
  await p.$disconnect();
}
main();
