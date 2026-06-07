import { z } from "zod";

export const runCodeSchema = z.object({
  language: z.string().min(1),
  code: z.string().min(1),
  stdin: z.string().optional(),
});

export const tutorMessageSchema = z.object({
  lessonId: z.string().min(1),
  message: z.string().min(1),
});

export const quizSubmitSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.array(z.number()),
});

export const quizFeedbackSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
      userAnswer: z.number(),
    })
  ),
});

export const progressSchema = z.object({
  completed: z.boolean(),
  score: z.number().optional(),
});

export const examSubmitSchema = z.object({
  courseId: z.string().min(1),
  answers: z.array(z.number()),
});

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
});
