import { PrismaClient } from "@prisma/client";

type PlacementQuestionSeed = {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  order: number;
};

const HTML_CSS_QUESTIONS: PlacementQuestionSeed[] = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
    correctAnswer: 0,
    difficulty: "easy",
    order: 1,
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<nav>"],
    correctAnswer: 1,
    difficulty: "easy",
    order: 2,
  },
  {
    question: "Which CSS property changes the text color?",
    options: ["font-color", "text-color", "color", "foreground"],
    correctAnswer: 2,
    difficulty: "easy",
    order: 3,
  },
  {
    question: "What does the CSS 'display: flex' do?",
    options: ["Makes an element invisible", "Creates a flexible container for layout", "Adds flexibility to text size", "Displays elements in a stack"],
    correctAnswer: 1,
    difficulty: "medium",
    order: 4,
  },
  {
    question: "Which HTML element is used for semantic navigation?",
    options: ["<navigation>", "<nav>", "<menu>", "<header>"],
    correctAnswer: 1,
    difficulty: "medium",
    order: 5,
  },
  {
    question: "What is the box model in CSS?",
    options: ["A JavaScript library", "A layout system: content, padding, border, margin", "A way to style boxes", "A type of HTML element"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 6,
  },
];

const JS_QUESTIONS: PlacementQuestionSeed[] = [
  {
    question: "Which keyword declares a constant variable in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: 2,
    difficulty: "easy",
    order: 1,
  },
  {
    question: "What will 'typeof 42' return in JavaScript?",
    options: ["'integer'", "'number'", "'string'", "'object'"],
    correctAnswer: 1,
    difficulty: "easy",
    order: 2,
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: 0,
    difficulty: "easy",
    order: 3,
  },
  {
    question: "What is a closure in JavaScript?",
    options: ["A way to close a browser tab", "A function with access to its outer scope", "A type of loop", "An error handling mechanism"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 4,
  },
  {
    question: "What does the '===' operator check?",
    options: ["Value only", "Type only", "Value and type", "Reference equality"],
    correctAnswer: 2,
    difficulty: "medium",
    order: 5,
  },
  {
    question: "What is the output of 'Boolean([])' in JavaScript?",
    options: ["false", "true", "undefined", "TypeError"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 6,
  },
];

const PYTHON_QUESTIONS: PlacementQuestionSeed[] = [
  {
    question: "Which keyword defines a function in Python?",
    options: ["function", "def", "func", "define"],
    correctAnswer: 1,
    difficulty: "easy",
    order: 1,
  },
  {
    question: "What data type is the value '3.14' in Python?",
    options: ["int", "float", "str", "decimal"],
    correctAnswer: 1,
    difficulty: "easy",
    order: 2,
  },
  {
    question: "Which of these is a Python list?",
    options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "{1: 'a', 2: 'b'}"],
    correctAnswer: 2,
    difficulty: "easy",
    order: 3,
  },
  {
    question: "What is a decorator in Python?",
    options: ["A design pattern for classes", "A function that modifies another function", "A way to decorate strings", "A type of loop"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 4,
  },
  {
    question: "What does 'len()' do in Python?",
    options: ["Returns the length of a sequence", "Makes a string longer", "Counts items in a database", "Returns the last element"],
    correctAnswer: 0,
    difficulty: "medium",
    order: 5,
  },
  {
    question: "What is the difference between a list and a tuple?",
    options: ["Lists are ordered, tuples are not", "Lists are mutable, tuples are immutable", "Tuples are faster than lists", "There is no difference"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 6,
  },
];

const CPP_QUESTIONS: PlacementQuestionSeed[] = [
  {
    question: "What is the correct entry point of a C++ program?",
    options: ["int start()", "void main()", "int main()", "function main()"],
    correctAnswer: 2,
    difficulty: "easy",
    order: 1,
  },
  {
    question: "Which header is needed for input/output in C++?",
    options: ["<stdio.h>", "<iostream>", "<input>", "<console>"],
    correctAnswer: 1,
    difficulty: "easy",
    order: 2,
  },
  {
    question: "What does 'int* ptr;' declare?",
    options: ["An integer", "A pointer to an integer", "A reference to an integer", "A function returning an int"],
    correctAnswer: 1,
    difficulty: "medium",
    order: 3,
  },
  {
    question: "What is a virtual function in C++?",
    options: ["A function that doesn't exist", "A function that can be overridden in a derived class", "A function that runs virtually", "A function with no body"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 4,
  },
  {
    question: "Which operator allocates memory on the heap in C++?",
    options: ["malloc", "alloc", "new", "create"],
    correctAnswer: 2,
    difficulty: "medium",
    order: 5,
  },
  {
    question: "What is RAII in C++?",
    options: ["Rapid Application Integration Interface", "Resource Acquisition Is Initialization", "Random Access Iterator Implementation", "Runtime Abstract Input Inheritance"],
    correctAnswer: 1,
    difficulty: "hard",
    order: 6,
  },
];

const COURSE_QUESTIONS: Record<string, PlacementQuestionSeed[]> = {
  "html-css": HTML_CSS_QUESTIONS,
  "javascript-fundamentals": JS_QUESTIONS,
  "python-basics": PYTHON_QUESTIONS,
  "cpp-basics": CPP_QUESTIONS,
};

export async function seedPlacementQuestions(prisma: PrismaClient) {
  const courses = await prisma.course.findMany({
    select: { id: true, slug: true },
  });

  for (const course of courses) {
    const questions = COURSE_QUESTIONS[course.slug];
    if (!questions) {
      console.log(`  No placement questions for ${course.slug}, skipping`);
      continue;
    }

    await prisma.placementQuestion.deleteMany({
      where: { courseId: course.id },
    });

    await prisma.placementQuestion.createMany({
      data: questions.map((q) => ({
        courseId: course.id,
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        order: q.order,
      })),
    });

    console.log(`  Seeded ${questions.length} placement questions for ${course.slug}`);
  }
}
