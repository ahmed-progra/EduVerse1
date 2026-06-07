import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TutorContext = {
  lessonTitle: string;
  theoryMarkdown: string;
  userCode: string;
  exerciseGoal: string;
};

export async function streamTutorResponse(
  messages: TutorMessage[],
  context: TutorContext,
  onChunk: (chunk: string) => void
): Promise<void> {
  const systemPrompt = `You are a helpful coding tutor for EduVerse. 
You are helping a student with the lesson "${context.lessonTitle}".

Lesson content:
${context.theoryMarkdown}

Exercise goal:
${context.exerciseGoal}

The student's current code:
${context.userCode}

Rules:
- Explain concepts, debug the student's code, and give hints.
- Never paste the full solution. Nudge, don't solve.
- Be encouraging and educational.`;

  const stream = await anthropic.messages.stream({
    model: process.env.ANTHROPIC_MODEL ?? "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: systemPrompt.slice(0, 8000),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      onChunk(event.delta.text);
    }
  }
}

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  userAnswer: number;
};

export type QuizFeedback = {
  perQuestion: { questionIndex: number; note: string }[];
  summary: string;
  reviewTopics: string[];
};

export async function generateQuizFeedback(
  questions: QuizQuestion[]
): Promise<QuizFeedback | null> {
  try {
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-haiku-20240307",
      max_tokens: 1500,
      system: `You are a quiz grader for EduVerse. Given quiz questions, the student's answers, and the correct answers, generate structured feedback. 
Return valid JSON with this shape: { "perQuestion": [{ "questionIndex": number, "note": string }], "summary": string, "reviewTopics": string[] }`,
      messages: [
        {
          role: "user",
          content: `Grade these quiz results and provide feedback:\n${JSON.stringify(questions, null, 2)}`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : null;
    if (!text) return null;

    const parsed = JSON.parse(text) as QuizFeedback;
    return parsed;
  } catch {
    return null;
  }
}


