import { PrismaClient } from "@prisma/client";

export async function seedJsCourse(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { slug: "javascript-fundamentals" },
    update: {},
    create: {
      slug: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      description:
        "Learn the language of the web. From variables to async programming, build interactive web applications with JavaScript.",
      language: "javascript",
      icon: "🟨",
      order: 2,
      published: true,
    },
  });

  await prisma.$transaction([
    prisma.lesson.deleteMany({ where: { courseId: course.id } }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-introduction",
        title: "JavaScript Introduction",
        order: 1,
        level: "beginner",
        exerciseType: "code",
        theory: `# JavaScript Introduction

JavaScript is one of the most widely used programming languages in the world. It powers the interactive elements of nearly every website you visit and has grown far beyond the browser to run on servers, mobile devices, and even robots.

## What is JavaScript?

JavaScript was created in 1995 by Brendan Eich while he was working at Netscape. Originally called Mocha, then LiveScript, it was renamed JavaScript to capitalize on the popularity of Java at the time. Despite the similar name, JavaScript and Java are completely different languages.

JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It supports multiple programming paradigms including object-oriented, imperative, and functional programming.

## Running JavaScript

There are two primary ways to run JavaScript code:

### In the Browser

Every modern web browser has a built-in JavaScript engine. You can open the browser's developer tools (F12 or right-click → Inspect) and find the Console tab to write and execute JavaScript directly.

### With Node.js

Node.js is a runtime environment that allows you to run JavaScript outside the browser. Once installed, you can run any JavaScript file from the command line:

\`\`\`bash
node myFile.js
\`\`\`

## Your First JavaScript Code

The \`console.log\` function is the most basic way to output information in JavaScript. It prints whatever you pass to it to the console:

\`\`\`javascript
console.log("Hello, World!");
console.log(42);
console.log(true);
\`\`\`

## Comments in JavaScript

Comments are lines of code that are ignored during execution. They help you document your code:

\`\`\`javascript
// This is a single-line comment

/*
  This is a
  multi-line comment
*/
\`\`\`

## Basic Syntax Rules

- JavaScript is case-sensitive (\`myVariable\` and \`myvariable\` are different)
- Statements typically end with a semicolon (though it's optional due to automatic semicolon insertion)
- Curly braces \`{}\` define blocks of code
- Parentheses \`()\` are used for function calls and grouping
- Whitespace is generally ignored

JavaScript's syntax is forgiving but precise. Mastering the basics will give you a strong foundation for everything else you build.`,
        exercisePrompt:
          'Write JavaScript code that prints the string "I am learning JavaScript!" to the console, followed by a multi-line comment explaining what console.log does.',
        starterCode: `// Print your message here
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Understand what JavaScript is and its history",
          "Run JavaScript in the browser console and Node.js",
          "Use console.log to output values",
          "Write single-line and multi-line comments",
          "Recognize basic syntax rules",
        ]),
        quiz: JSON.stringify([
          {
            question: "Who created JavaScript?",
            options: ["Brendan Eich", "Tim Berners-Lee", "Dennis Ritchie", "Guido van Rossum"],
            correctIndex: 0,
          },
          {
            question: "Which of the following is a valid comment in JavaScript?",
            options: ["// This is a comment", "# This is a comment", "<!-- This is a comment -->", "' This is a comment"],
            correctIndex: 0,
          },
          {
            question: "What does console.log() do?",
            options: [
              "Prints output to the console",
              "Creates a new console window",
              "Logs errors only",
              "Saves data to a file",
            ],
            correctIndex: 0,
          },
          {
            question: "Which runtime allows JavaScript to run outside the browser?",
            options: ["Node.js", "React", "TypeScript", "Webpack"],
            correctIndex: 0,
          },
          {
            question: "JavaScript is case-sensitive. What does this mean?",
            options: [
              "myVar and myvar are different variables",
              "myVar and myvar are the same variable",
              "JavaScript ignores uppercase letters",
              "JavaScript only works with lowercase",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-variables",
        title: "Variables",
        order: 2,
        level: "beginner",
        exerciseType: "code",
        theory: `# Variables

Variables are fundamental building blocks in JavaScript. They act as named containers for storing data values that your program can reference and manipulate throughout its execution.

## Declaring Variables: var, let, and const

JavaScript provides three keywords for declaring variables, each with distinct behaviors.

### var (Legacy)

\`var\` was the original way to declare variables in JavaScript. It has function scope and is hoisted to the top of its containing function:

\`\`\`javascript
var name = "Alice";
var age = 25;
\`\`\`

\`var\` has some quirks that can lead to bugs, which is why modern JavaScript prefers \`let\` and \`const\`.

### let (Modern)

\`let\` was introduced in ES6 (2015) and has block scope. It is the preferred way to declare variables that will be reassigned:

\`\`\`javascript
let score = 0;
score = 10; // Reassignment is allowed
\`\`\`

### const (Modern)

\`const\` is used for variables that should not be reassigned. It also has block scope:

\`\`\`javascript
const PI = 3.14159;
const user = { name: "Bob" };
user.name = "Charlie"; // This works - the object itself can be mutated
// PI = 3.14; // This throws an error
\`\`\`

## Naming Conventions

- Variable names must begin with a letter, underscore, or dollar sign
- They cannot start with a number
- They are case-sensitive
- Use camelCase for multiple words: \`myFavoriteColor\`
- Use meaningful, descriptive names

## Hoisting

Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation. \`var\` declarations are hoisted and initialized with \`undefined\`. \`let\` and \`const\` are hoisted but not initialized, creating a Temporal Dead Zone.

\`\`\`javascript
console.log(x); // undefined (hoisted)
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;
\`\`\`

## Scope

- **Global scope**: Variables declared outside any function are globally accessible
- **Function scope**: Variables declared with \`var\` inside a function are only accessible within that function
- **Block scope**: Variables declared with \`let\` and \`const\` inside a block \`{}\` are only accessible within that block

## Temporal Dead Zone (TDZ)

The TDZ is the period between entering a scope and the actual declaration of a \`let\` or \`const\` variable. Accessing the variable during this period throws a ReferenceError.

\`\`\`javascript
{
  // TDZ starts
  // console.log(myVar); // ReferenceError
  let myVar = 10; // TDZ ends
  console.log(myVar); // 10
}
\`\`\`

Choosing the right declaration keyword is essential for writing predictable, bug-free code. Use \`const\` by default, \`let\` when you need reassignment, and avoid \`var\` in modern JavaScript.`,
        exercisePrompt:
          'Declare a const variable called "language" with the value "JavaScript". Then declare a let variable called "version" with the value "ES6". Reassign version to "ES2023". Finally, log both variables to the console.',
        starterCode: `// Declare your variables here
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Understand the differences between var, let, and const",
          "Apply proper variable naming conventions",
          "Explain hoisting and the Temporal Dead Zone",
          "Distinguish between global, function, and block scope",
          "Choose the appropriate declaration keyword for different scenarios",
        ]),
        quiz: JSON.stringify([
          {
            question: "Which keyword should you use for a variable that will not be reassigned?",
            options: ["const", "let", "var", "static"],
            correctIndex: 0,
          },
          {
            question: "What is the Temporal Dead Zone?",
            options: [
              "The period between scope entry and variable declaration where let/const cannot be accessed",
              "A section of code where variables are deleted",
              "The time it takes for a variable to be created",
              "A debugging tool for tracking variable changes",
            ],
            correctIndex: 0,
          },
          {
            question: "What does \`var\` hoisting initialize the variable to?",
            options: ["undefined", "null", "0", "ReferenceError is thrown"],
            correctIndex: 0,
          },
          {
            question: "Which of these is a valid variable name in JavaScript?",
            options: ["$total", "2fast", "my-var", "class"],
            correctIndex: 0,
          },
          {
            question: "What is block scope?",
            options: [
              "Variables declared inside {} with let/const are only accessible within that block",
              "Variables declared anywhere in a file are accessible everywhere",
              "Variables are only accessible in loops",
              "Block scope only applies to functions",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-data-types",
        title: "Data Types",
        order: 3,
        level: "beginner",
        exerciseType: "code",
        theory: `# Data Types

JavaScript has seven primitive data types and one complex data type (Object). Understanding data types is crucial because they determine what operations can be performed on values.

## Primitive Data Types

Primitive types represent single, immutable values. They are stored directly in the variable's memory location.

### String

Strings represent text and are enclosed in quotes:

\`\`\`javascript
const single = 'Hello';
const double = "World";
const backtick = \`Template literal\`;
const combined = \`\${single} \${double}\`; // "Hello World"
\`\`\`

### Number

JavaScript uses a single Number type for all numeric values (both integers and floating-point):

\`\`\`javascript
const integer = 42;
const float = 3.14;
const negative = -10;
const infinity = Infinity;
const notANumber = NaN;
\`\`\`

### Boolean

Boolean represents logical values: \`true\` or \`false\`:

\`\`\`javascript
const isActive = true;
const isComplete = false;
\`\`\`

### null

\`null\` represents the intentional absence of any object value:

\`\`\`javascript
const empty = null;
\`\`\`

### undefined

\`undefined\` indicates a variable that has been declared but not assigned a value:

\`\`\`javascript
let notDefined;
console.log(notDefined); // undefined
\`\`\`

### Symbol (ES6)

Symbols are unique, immutable values often used as object property keys:

\`\`\`javascript
const sym1 = Symbol("id");
const sym2 = Symbol("id");
console.log(sym1 === sym2); // false (each Symbol is unique)
\`\`\`

### BigInt (ES2020)

BigInt allows you to work with integers larger than the safe limit for Number:

\`\`\`javascript
const huge = 9007199254740991n;
const another = BigInt("12345678901234567890");
\`\`\`

## The typeof Operator

\`typeof\` returns a string indicating the type of the operand:

\`\`\`javascript
typeof "hello";  // "string"
typeof 42;       // "number"
typeof true;     // "boolean"
typeof null;     // "object" (this is a known JavaScript bug)
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof 42n;      // "bigint"
\`\`\`

## Type Coercion

JavaScript automatically converts types in certain contexts. This can be either helpful or surprising:

\`\`\`javascript
console.log("5" + 3);  // "53" (string concatenation)
console.log("5" - 3);  // 2 (numeric subtraction)
console.log("5" == 5); // true (loose equality coerces types)
console.log("5" === 5); // false (strict equality checks type too)
\`\`\`

## The Object Type (Non-Primitive)

Objects are collections of key-value pairs and are the foundation of more complex data structures in JavaScript:

\`\`\`javascript
const person = {
  name: "Alice",
  age: 30,
  isStudent: false,
};
\`\`\`

Mastering data types helps you avoid subtle bugs and write more predictable JavaScript code.`,
        exercisePrompt:
          'Create a const variable for each primitive type: string (your name), number (your age), boolean (are you a student?), null (set to null), and undefined (declare without assignment). Log each variable along with its type using typeof.',
        starterCode: `// Declare variables for each data type
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Identify the seven primitive data types in JavaScript",
          "Use the typeof operator correctly",
          "Understand type coercion behavior",
          "Differentiate between null and undefined",
          "Recognize the Object type as non-primitive",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does \`typeof null\` return in JavaScript?",
            options: ["'object'", "'null'", "'undefined'", "'boolean'"],
            correctIndex: 0,
          },
          {
            question: "Which data type represents a unique, immutable value?",
            options: ["Symbol", "String", "Number", "Boolean"],
            correctIndex: 0,
          },
          {
            question: "What does \`'10' - 5\` evaluate to?",
            options: ["5", "'105'", "NaN", "TypeError"],
            correctIndex: 0,
          },
          {
            question: "Which BigInt declaration is valid?",
            options: ["const big = 123n;", "const big = 123;", "const big = '123';", "const big = BigInt;"],
            correctIndex: 0,
          },
          {
            question: "What is the difference between null and undefined?",
            options: [
              "null is intentionally assigned; undefined means no value assigned",
              "undefined is intentionally assigned; null means no value assigned",
              "They are identical",
              "null is a number; undefined is a string",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-operators",
        title: "Operators",
        order: 4,
        level: "beginner",
        exerciseType: "code",
        theory: `# Operators

Operators are special symbols that perform operations on values (operands). JavaScript provides a rich set of operators for various purposes.

## Arithmetic Operators

These operators perform mathematical calculations:

\`\`\`javascript
const a = 10;
const b = 3;
console.log(a + b);  // 13 (addition)
console.log(a - b);  // 7 (subtraction)
console.log(a * b);  // 30 (multiplication)
console.log(a / b);  // 3.333... (division)
console.log(a % b);  // 1 (modulus - remainder)
console.log(a ** b); // 1000 (exponentiation)
\`\`\`

## Assignment Operators

Assignment operators assign values to variables, often with an operation:

\`\`\`javascript
let x = 10;
x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
x /= 4;  // x = x / 4 → 6
x %= 5;  // x = x % 5 → 1
x **= 2; // x = x ** 2 → 1
\`\`\`

## Comparison Operators

Comparison operators compare two values and return a boolean:

\`\`\`javascript
console.log(5 == "5");   // true (loose equality, coerces types)
console.log(5 === "5");  // false (strict equality, checks type)
console.log(5 != "5");   // false (loose inequality)
console.log(5 !== "5");  // true (strict inequality)
console.log(10 > 5);     // true
console.log(10 < 5);     // false
console.log(10 >= 10);   // true
console.log(10 <= 5);    // false
\`\`\`

## Logical Operators

Logical operators work with boolean values and support short-circuit evaluation:

\`\`\`javascript
const isLoggedIn = true;
const isAdmin = false;

console.log(isLoggedIn && isAdmin); // false (AND - both must be true)
console.log(isLoggedIn || isAdmin); // true (OR - at least one must be true)
console.log(!isLoggedIn);           // false (NOT - inverts the value)
\`\`\`

## Ternary Operator

The ternary operator is a shorthand for if/else:

\`\`\`javascript
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"
\`\`\`

## Operator Precedence

Operator precedence determines the order in which operators are evaluated. Multiplication and division have higher precedence than addition and subtraction:

\`\`\`javascript
console.log(2 + 3 * 4);    // 14 (not 20)
console.log((2 + 3) * 4);  // 20 (parentheses override precedence)
\`\`\`

## Short-Circuit Evaluation

Logical operators \`&&\` and \`||\` short-circuit, meaning they stop evaluating as soon as the result is determined:

\`\`\`javascript
const result = false && someFunction(); // someFunction() is never called
const value = "" || "default";          // "default" (empty string is falsy)
\`\`\`

Understanding operators thoroughly is essential for writing concise, expressive, and correct JavaScript code.`,
        exercisePrompt:
          'Given const a = 15 and const b = 4, compute and log: a + b, a - b, a * b, a / b, a % b, a ** b. Then use the ternary operator to log "Even" or "Odd" based on whether a is even or odd.',
        starterCode: `const a = 15;
const b = 4;

// Perform operations below
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Use arithmetic, assignment, comparison, and logical operators",
          "Differentiate between == and ===",
          "Apply the ternary operator for conditional expressions",
          "Understand operator precedence",
          "Explain short-circuit evaluation behavior",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does 5 === '5' evaluate to?",
            options: ["false", "true", "undefined", "TypeError"],
            correctIndex: 0,
          },
          {
            question: "What is the result of 10 % 3?",
            options: ["1", "3", "0", "10"],
            correctIndex: 0,
          },
          {
            question: "Which operator has the highest precedence?",
            options: ["** (exponentiation)", "+ (addition)", "== (equality)", "&& (logical AND)"],
            correctIndex: 0,
          },
          {
            question: "What does short-circuit evaluation mean for ||?",
            options: [
              "If the first operand is truthy, the second is not evaluated",
              "Both operands are always evaluated",
              "The operator terminates the program",
              "It reverses the boolean values",
            ],
            correctIndex: 0,
          },
          {
            question: "What does the ternary expression score > 50 ? 'Pass' : 'Fail' return when score = 45?",
            options: ["'Fail'", "'Pass'", "true", "undefined"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-conditions",
        title: "Conditionals",
        order: 5,
        level: "beginner",
        exerciseType: "code",
        theory: `# Conditionals

Conditionals allow your program to make decisions and execute different code paths based on certain conditions. They are the foundation of dynamic, responsive programs.

## if/else if/else Statements

The \`if\` statement executes a block of code if a condition is truthy. Optional \`else if\` and \`else\` blocks handle alternative conditions:

\`\`\`javascript
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
// "Grade: B"
\`\`\`

## Truthy and Falsy Values

In JavaScript, every value has an inherent boolean truthiness. Falsy values coerce to \`false\` in boolean contexts:

- \`false\`
- \`0\` (and \`-0\`)
- \`""\` (empty string)
- \`null\`
- \`undefined\`
- \`NaN\`

Everything else is truthy:

\`\`\`javascript
if ("hello") console.log("truthy");   // runs
if (42) console.log("truthy");        // runs
if ([]) console.log("truthy");        // runs (empty array is truthy)
if ({}) console.log("truthy");        // runs (empty object is truthy)
if (0) console.log("falsy");          // does not run
\`\`\`

## Switch Statement

\`switch\` is useful when comparing a single value against many possible matches:

\`\`\`javascript
const day = 3;
let dayName;

switch (day) {
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  case 4:
    dayName = "Thursday";
    break;
  case 5:
    dayName = "Friday";
    break;
  default:
    dayName = "Weekend";
}
console.log(dayName); // "Wednesday"
\`\`\`

Without \`break\`, execution falls through to the next case, which can be useful in some patterns.

## Ternary Operator in Depth

The ternary operator can chain multiple conditions, though readability should be considered:

\`\`\`javascript
const age = 25;
const category = age < 13 ? "Child" : age < 20 ? "Teen" : age < 65 ? "Adult" : "Senior";
console.log(category); // "Adult"
\`\`\`

## Nested Conditions

Conditions can be nested inside other conditions, but excessive nesting harms readability:

\`\`\`javascript
const isAuthenticated = true;
const hasPermission = false;

if (isAuthenticated) {
  if (hasPermission) {
    console.log("Access granted");
  } else {
    console.log("Insufficient permissions");
  }
} else {
  console.log("Please log in");
}
\`\`\`

Using logical operators can often flatten nested conditions for cleaner code.

Mastering conditionals enables you to write programs that respond intelligently to different inputs and states.`,
        exercisePrompt:
          'Write code that takes a const variable "temperature" (number). Log: "Freezing" if below 0, "Cold" if 0-15, "Warm" if 16-30, "Hot" if above 30. Use if/else. Then write the same logic using a ternary chain.',
        starterCode: `const temperature = 22;

// Using if/else
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Write if/else if/else conditional statements",
          "Understand truthy and falsy values",
          "Use switch statements for multiple comparisons",
          "Apply the ternary operator effectively",
          "Recognize when nested conditions are appropriate",
        ]),
        quiz: JSON.stringify([
          {
            question: "Which of the following is falsy in JavaScript?",
            options: ["0", "[]", "'false'", "{}"],
            correctIndex: 0,
          },
          {
            question: "What does the break keyword do in a switch statement?",
            options: [
              "Exits the switch block to prevent fall-through",
              "Restarts the switch statement",
              "Breaks out of the entire program",
              "Logs the current case to the console",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the output of Boolean('') in JavaScript?",
            options: ["false", "true", "undefined", "null"],
            correctIndex: 0,
          },
          {
            question: "When would you use a switch statement instead of if/else?",
            options: [
              "When comparing a single value against many distinct cases",
              "When checking complex boolean conditions",
              "Switch and if/else are identical in usage",
              "When you need to loop through values",
            ],
            correctIndex: 0,
          },
          {
            question: "What does the ternary operator x > 0 ? 'positive' : 'non-positive' return when x = -5?",
            options: ["'non-positive'", "'positive'", "false", "undefined"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-loops",
        title: "Loops",
        order: 6,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Loops

Loops allow you to execute a block of code repeatedly, either a specific number of times or while a condition holds true. They are essential for working with collections and repetitive tasks.

## The for Loop

The classic \`for\` loop has three parts: initialization, condition, and increment:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

## The while Loop

The \`while\` loop runs as long as its condition is truthy:

\`\`\`javascript
let count = 0;
while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}
\`\`\`

## The do-while Loop

\`do-while\` is similar to \`while\` but guarantees at least one execution:

\`\`\`javascript
let i = 0;
do {
  console.log(i); // 0 (runs at least once)
  i++;
} while (i < 5);
\`\`\`

## for...of Loop

\`for...of\` iterates over iterable values like arrays and strings:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit); // "apple", "banana", "cherry"
}
\`\`\`

## for...in Loop

\`for...in\` iterates over enumerable property keys (used for objects):

\`\`\`javascript
const person = { name: "Alice", age: 30, city: "Paris" };
for (const key in person) {
  console.log(key, person[key]); // "name Alice", "age 30", "city Paris"
}
\`\`\`

## break and continue

- \`break\` exits the loop entirely
- \`continue\` skips the current iteration and moves to the next one

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // skip 3
  if (i === 7) break;    // stop at 7
  console.log(i); // 0, 1, 2, 4, 5, 6
}
\`\`\`

## Loop Performance Considerations

- Minimize work inside loops, especially DOM access and expensive computations
- Cache array lengths: \`for (let i = 0; i < arr.length; i++)\` evaluates length each iteration
- Use optimized array methods (\`forEach\`, \`map\`) when appropriate
- Avoid unnecessary nesting

## Infinite Loops

An infinite loop occurs when the termination condition is never met. This will crash your program or freeze the browser:

\`\`\`javascript
// DANGER: infinite loop
// while (true) { console.log("running"); }
// for (;;) { console.log("running"); }
\`\`\`

Always ensure your loops have a clear path to termination. Choosing the right loop type makes your code more readable and intentional.`,
        exercisePrompt:
          'Given const numbers = [2, 5, 8, 11, 14], write a for loop that sums all numbers and logs the total. Then use a while loop to log numbers from 10 down to 1. Finally, use for...of to log each number doubled.',
        starterCode: `const numbers = [2, 5, 8, 11, 14];

// for loop sum
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Differentiate between for, while, and do-while loops",
          "Use for...of and for...in for iteration",
          "Control loop flow with break and continue",
          "Understand loop performance implications",
          "Recognize and avoid infinite loops",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the continue statement do in a loop?",
            options: [
              "Skips the rest of the current iteration and continues with the next",
              "Exits the loop entirely",
              "Restarts the loop from the beginning",
              "Throws an error",
            ],
            correctIndex: 0,
          },
          {
            question: "Which loop guarantees at least one execution?",
            options: ["do-while", "while", "for", "for...of"],
            correctIndex: 0,
          },
          {
            question: "What does for...of iterate over?",
            options: ["Iterable values like arrays and strings", "Object property keys", "Only numbers", "Function parameters"],
            correctIndex: 0,
          },
          {
            question: "What happens in an infinite loop?",
            options: [
              "The loop never terminates, potentially freezing the program",
              "The loop runs exactly once",
              "The loop automatically stops after 1000 iterations",
              "JavaScript ignores infinite loops",
            ],
            correctIndex: 0,
          },
          {
            question: "Which loop is best for iterating over an array's values?",
            options: ["for...of", "for...in", "while", "do-while"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-functions",
        title: "Functions",
        order: 7,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Functions

Functions are reusable blocks of code that perform a specific task. They are the primary means of organizing and reusing code in JavaScript.

## Function Declarations

A function declaration defines a named function that is hoisted to the top of its scope:

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

Function declarations are hoisted, meaning you can call them before they appear in the code.

## Function Expressions

A function expression assigns a function to a variable. Unlike declarations, they are not hoisted:

\`\`\`javascript
const greet = function (name) {
  return "Hello, " + name + "!";
};
console.log(greet("Bob")); // "Hello, Bob!"
\`\`\`

## Arrow Functions

Arrow functions provide a concise syntax and lexically bind the \`this\` value:

\`\`\`javascript
const greet = (name) => {
  return "Hello, " + name + "!";
};

// Single expression can omit braces and return
const double = (x) => x * 2;

// Single parameter can omit parentheses
const square = x => x * x;
\`\`\`

## Parameters and Arguments

Functions can accept multiple parameters and access them via the \`arguments\` object (in regular functions):

\`\`\`javascript
function sum(a, b) {
  return a + b;
}
console.log(sum(3, 7)); // 10
\`\`\`

## Default Parameters

Parameters can have default values that are used when no argument is provided:

\`\`\`javascript
function greet(name = "Guest") {
  return "Hello, " + name + "!";
}
console.log(greet());       // "Hello, Guest!"
console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

## Return Values

Functions return \`undefined\` by default. Use the \`return\` keyword to explicitly return a value:

\`\`\`javascript
function add(a, b) {
  return a + b;
  // Anything after return is not executed
}
\`\`\`

## Rest Parameters

Rest parameters collect remaining arguments into an array:

\`\`\`javascript
function sumAll(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10
\`\`\`

## Spread Operator

The spread operator expands an iterable into individual elements:

\`\`\`javascript
const nums = [1, 2, 3];
console.log(Math.max(...nums)); // 3
\`\`\`

Functions are the building blocks of JavaScript applications. Mastering them is essential for writing clean, modular, and maintainable code.`,
        exercisePrompt:
          'Write an arrow function called "isPalindrome" that takes a string and returns true if it reads the same forwards and backwards (ignoring case). Test it with "racecar", "hello", and "Madam". Log the results.',
        starterCode: `// Write your isPalindrome arrow function
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Differentiate between function declarations, expressions, and arrow functions",
          "Use parameters, arguments, and default parameters",
          "Understand return values and function scope",
          "Apply rest and spread operators with functions",
          "Choose the appropriate function syntax for different scenarios",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the key difference between function declarations and function expressions?",
            options: [
              "Function declarations are hoisted; function expressions are not",
              "Function expressions are hoisted; function declarations are not",
              "There is no difference",
              "Function declarations cannot have parameters",
            ],
            correctIndex: 0,
          },
          {
            question: "What does an arrow function use instead of the function keyword?",
            options: ["=> (arrow)", "=> (equals greater than)", "-> (dash greater than)", ":: (double colon)"],
            correctIndex: 0,
          },
          {
            question: "What happens when a function has a return statement?",
            options: [
              "The function stops executing and returns the specified value",
              "The function continues executing after return",
              "The return value is ignored",
              "The function terminates without a value",
            ],
            correctIndex: 0,
          },
          {
            question: "What do rest parameters (...) do?",
            options: [
              "Collect remaining arguments into an array",
              "Spread an array into individual arguments",
              "Create a copy of an array",
              "Rest parameters are used for pausing execution",
            ],
            correctIndex: 0,
          },
          {
            question: "What does a function return if no return statement is provided?",
            options: ["undefined", "null", "0", "An empty string"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-arrays",
        title: "Arrays",
        order: 8,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Arrays

Arrays are ordered, zero-indexed collections that can hold any type of data. They are one of the most commonly used data structures in JavaScript.

## Creating Arrays

Arrays can be created using literal syntax or the Array constructor:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];
const numbers = new Array(1, 2, 3);
const empty = [];
const mixed = [1, "hello", true, null, { name: "Alice" }];
\`\`\`

## Array Indexing

Array elements are accessed by their index, starting at 0:

\`\`\`javascript
const colors = ["red", "green", "blue"];
console.log(colors[0]);  // "red"
console.log(colors[2]);  // "blue"
console.log(colors[5]);  // undefined
\`\`\`

## Basic Array Methods

\`\`\`javascript
const arr = [1, 2, 3];
arr.push(4);    // [1, 2, 3, 4] (adds to end)
arr.pop();      // [1, 2, 3] (removes from end)
arr.unshift(0); // [0, 1, 2, 3] (adds to start)
arr.shift();    // [1, 2, 3] (removes from start)
\`\`\`

## Powerful Iterator Methods

### map

Creates a new array by transforming each element:

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]
\`\`\`

### filter

Creates a new array with elements that pass a test:

\`\`\`javascript
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]
\`\`\`

### reduce

Reduces an array to a single value:

\`\`\`javascript
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 10
\`\`\`

### find, some, every

\`\`\`javascript
const firstEven = numbers.find(n => n % 2 === 0); // 2
const hasNegative = numbers.some(n => n < 0);     // false
const allPositive = numbers.every(n => n > 0);    // true
\`\`\`

## Spread Operator with Arrays

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const copy = [...arr1]; // shallow copy
\`\`\`

## Array Destructuring

\`\`\`javascript
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first);  // 10
console.log(second); // 20
console.log(rest);   // [30, 40, 50]
\`\`\`

Arrays have a rich API that makes data manipulation concise and expressive. Mastering these methods will dramatically improve your JavaScript productivity.`,
        exercisePrompt:
          'Given const numbers = [3, 7, 1, 9, 4, 6, 8], use array methods to: (1) filter numbers greater than 5, (2) map the result to their squares, (3) reduce to find the sum of squares. Log each step.',
        starterCode: `const numbers = [3, 7, 1, 9, 4, 6, 8];

// Step 1: filter > 5
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Create and access arrays using indexing",
          "Use push, pop, shift, and unshift methods",
          "Apply map, filter, and reduce for data transformation",
          "Utilize find, some, and every for searching",
          "Use spread operator and destructuring with arrays",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the map method return?",
            options: [
              "A new array with transformed elements",
              "The original array modified in place",
              "A boolean value",
              "A single reduced value",
            ],
            correctIndex: 0,
          },
          {
            question: "What does arr.push(5) do?",
            options: [
              "Adds 5 to the end of the array",
              "Adds 5 to the beginning of the array",
              "Removes the last element",
              "Sorts the array",
            ],
            correctIndex: 0,
          },
          {
            question: "Which method removes the first element of an array?",
            options: ["shift", "pop", "unshift", "slice"],
            correctIndex: 0,
          },
          {
            question: "What does reduce do?",
            options: [
              "Reduces an array to a single accumulated value",
              "Reduces the array size by removing duplicates",
              "Creates a smaller array by filtering",
              "Sorts the array in descending order",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the result of [...[1, 2], ...[3, 4]]?",
            options: ["[1, 2, 3, 4]", "[[1, 2], [3, 4]]", "Syntax error", "[1, 2, ...[3, 4]]"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-objects",
        title: "Objects",
        order: 9,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Objects

Objects are collections of key-value pairs and form the backbone of JavaScript's data organization. They allow you to group related data and functionality together.

## Object Literals

The simplest way to create an object is with literal syntax:

\`\`\`javascript
const person = {
  firstName: "Alice",
  lastName: "Johnson",
  age: 28,
  isEmployed: true,
};
\`\`\`

## Accessing Properties

Properties can be accessed with dot notation or bracket notation:

\`\`\`javascript
console.log(person.firstName); // "Alice"
console.log(person["lastName"]); // "Johnson"

const key = "age";
console.log(person[key]); // 28
\`\`\`

Bracket notation is necessary when property names have spaces, special characters, or are dynamic.

## Methods

Functions stored as object properties are called methods:

\`\`\`javascript
const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
};
console.log(calculator.add(5, 3)); // 8
\`\`\`

## The this Keyword

Inside a method, \`this\` refers to the object that owns the method:

\`\`\`javascript
const user = {
  name: "Alice",
  greet() {
    console.log("Hello, I'm " + this.name);
  },
};
user.greet(); // "Hello, I'm Alice"
\`\`\`

The value of \`this\` depends on how the function is called, not where it is defined.

## Object.keys, Object.values, Object.entries

These static methods provide ways to work with object data:

\`\`\`javascript
const person = { name: "Alice", age: 30, city: "Paris" };

console.log(Object.keys(person));   // ["name", "age", "city"]
console.log(Object.values(person)); // ["Alice", 30, "Paris"]
console.log(Object.entries(person));
// [["name", "Alice"], ["age", 30], ["city", "Paris"]]
\`\`\`

## Optional Chaining

Optional chaining (\`?.\`) allows safe access to nested properties without throwing an error if an intermediate value is \`null\` or \`undefined\`:

\`\`\`javascript
const user = { profile: { name: "Alice" } };
console.log(user?.profile?.name);      // "Alice"
console.log(user?.address?.street);    // undefined (no error)
\`\`\`

## Computed Properties

Object keys can be dynamically computed using bracket notation in the literal:

\`\`\`javascript
const key = "favoriteColor";
const person = {
  name: "Alice",
  [key]: "blue",
};
console.log(person.favoriteColor); // "blue"
\`\`\`

## Property Shorthand

When a variable name matches the property name, you can use shorthand:

\`\`\`javascript
const name = "Alice";
const age = 30;
const person = { name, age }; // { name: "Alice", age: 30 }
\`\`\`

Objects are incredibly versatile and are used everywhere in JavaScript for configuration, data modeling, namespacing, and more.`,
        exercisePrompt:
          'Create an object called "book" with properties: title ("The Great Gatsby"), author ("F. Scott Fitzgerald"), year (1925), and a method getAge that returns the current age of the book (2026 - year). Add a computed property "isClassic" that is true if age > 50. Log book.getAge() and book.isClassic.',
        starterCode: `// Create the book object
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Create and access object properties using dot and bracket notation",
          "Define methods on objects using the this keyword",
          "Use Object.keys, Object.values, and Object.entries",
          "Apply optional chaining for safe property access",
          "Use computed property names and property shorthand",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does optional chaining (?.) do?",
            options: [
              "Safely accesses nested properties without throwing on null/undefined",
              "Makes a property mandatory",
              "Chains multiple method calls together",
              "Creates a new object chain",
            ],
            correctIndex: 0,
          },
          {
            question: "How do you access a property with a dynamic key?",
            options: ["Bracket notation (obj[key])", "Dot notation (obj.key)", "Both work the same", "Arrow notation (obj->key)"],
            correctIndex: 0,
          },
          {
            question: "What does Object.entries() return?",
            options: [
              "An array of [key, value] pairs",
              "An array of keys only",
              "An array of values only",
              "A string representation of the object",
            ],
            correctIndex: 0,
          },
          {
            question: "Inside a method, what does this refer to?",
            options: [
              "The object that owns the method",
              "The global window object",
              "The function itself",
              "The parent object's prototype",
            ],
            correctIndex: 0,
          },
          {
            question: "What is property shorthand in object literals?",
            options: [
              "Omitting the value when variable name matches the property name",
              "Using single-letter property names",
              "Writing properties in a compressed format",
              "Automatically generating property names",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-dom",
        title: "DOM Manipulation",
        order: 10,
        level: "intermediate",
        exerciseType: "code",
        theory: `# DOM Manipulation

The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page as a tree of nodes that JavaScript can manipulate to change content, structure, and styling dynamically.

## Selecting Elements

Before you can manipulate elements, you need to select them:

\`\`\`javascript
// Select a single element by CSS selector
const header = document.querySelector("h1");

// Select by ID
const main = document.getElementById("main");

// Select all matching elements
const items = document.querySelectorAll(".item");

// Select by class name
const boxes = document.getElementsByClassName("box");

// Select by tag name
const paragraphs = document.getElementsByTagName("p");
\`\`\`

\`querySelector\` and \`querySelectorAll\` are the most versatile, accepting any CSS selector.

## Modifying Content and Style

Once selected, you can change elements in various ways:

\`\`\`javascript
const title = document.querySelector("h1");

// Change text content
title.textContent = "New Title";

// Change HTML content
title.innerHTML = "<span>Styled Title</span>";

// Change styles
title.style.color = "blue";
title.style.fontSize = "2rem";
title.style.backgroundColor = "yellow";
\`\`\`

## Creating and Removing Elements

\`\`\`javascript
// Create a new element
const newDiv = document.createElement("div");
newDiv.textContent = "I am new!";

// Add it to the DOM
document.body.appendChild(newDiv);

// Insert at a specific position
const container = document.querySelector(".container");
container.insertBefore(newDiv, container.firstChild);

// Remove an element
const oldElement = document.querySelector(".old");
oldElement.remove();
\`\`\`

## Working with Classes

\`\`\`javascript
const element = document.querySelector(".box");

element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("visible");
console.log(element.classList.contains("active")); // true

// Alternative: className
element.className = "new-class another-class";
\`\`\`

## Traversing the DOM

Navigate between elements in the DOM tree:

\`\`\`javascript
const parent = element.parentElement;
const children = element.children; // HTMLCollection
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;
const nextSibling = element.nextElementSibling;
const previousSibling = element.previousElementSibling;
\`\`\`

## Attributes

\`\`\`javascript
const link = document.querySelector("a");
console.log(link.getAttribute("href"));
link.setAttribute("target", "_blank");
link.removeAttribute("disabled");
\`\`\`

DOM manipulation is the foundation of interactive web pages. Understanding how to efficiently select, read, and modify the DOM is essential for front-end development.`,
        exercisePrompt:
          'Write code that: (1) creates a div with id "app", (2) creates an h1 with text "TODO List", (3) creates a ul with three li items "Learn JS", "Build a project", "Master DOM", (4) appends everything to document.body, and (5) adds the class "todo-app" to the div.',
        starterCode: `// Create the todo list structure
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Select DOM elements using querySelector and getElementById",
          "Modify element content, attributes, and styles",
          "Create and remove DOM elements dynamically",
          "Manipulate classes using classList API",
          "Traverse the DOM tree between elements",
        ]),
        quiz: JSON.stringify([
          {
            question: "Which method selects all elements matching a CSS selector?",
            options: ["querySelectorAll", "querySelector", "getElementById", "getElementsByClassName"],
            correctIndex: 0,
          },
          {
            question: "What does element.classList.toggle('active') do?",
            options: [
              "Adds 'active' if absent, removes it if present",
              "Permanently adds 'active'",
              "Permanently removes 'active'",
              "Checks if 'active' exists",
            ],
            correctIndex: 0,
          },
          {
            question: "How do you create a new HTML element?",
            options: ["document.createElement('div')", "new Div()", "document.new('div')", "HTML.create('div')"],
            correctIndex: 0,
          },
          {
            question: "What is the difference between textContent and innerHTML?",
            options: [
              "textContent sets plain text; innerHTML sets HTML markup",
              "textContent sets HTML; innerHTML sets plain text",
              "They are identical",
              "textContent is for forms only",
            ],
            correctIndex: 0,
          },
          {
            question: "Which property accesses an element's parent node?",
            options: ["parentElement", "parent", "ownerElement", "container"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-events",
        title: "Events",
        order: 11,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Events

Events are actions or occurrences that happen in the browser. JavaScript can listen for events and execute code in response, making pages interactive.

## addEventListener

The primary way to handle events is with \`addEventListener\`:

\`\`\`javascript
const button = document.querySelector("button");

button.addEventListener("click", function () {
  console.log("Button was clicked!");
});
\`\`\`

You can also pass an arrow function or a named function reference:

\`\`\`javascript
const handleClick = (event) => {
  console.log("Clicked:", event.target);
};
button.addEventListener("click", handleClick);
// Later, you can remove it:
button.removeEventListener("click", handleClick);
\`\`\`

## Common Event Types

\`\`\`javascript
// Click events
element.addEventListener("click", handler);
element.addEventListener("dblclick", handler);

// Form events
form.addEventListener("submit", handler);
input.addEventListener("input", handler);
input.addEventListener("change", handler);

// Keyboard events
document.addEventListener("keydown", handler);
document.addEventListener("keyup", handler);

// Mouse events
element.addEventListener("mouseenter", handler);
element.addEventListener("mouseleave", handler);
\`\`\`

## The Event Object

Event handlers receive an event object with useful properties:

\`\`\`javascript
button.addEventListener("click", (event) => {
  console.log(event.target);      // The element that was clicked
  console.log(event.currentTarget); // The element the listener is attached to
  console.log(event.type);         // "click"
  console.log(event.clientX, event.clientY); // Mouse coordinates
});
\`\`\`

## Event Delegation

Event delegation takes advantage of event bubbling to handle events efficiently:

\`\`\`javascript
// Instead of adding a listener to each item:
const list = document.querySelector("ul");
list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("Item clicked:", event.target.textContent);
  }
});
\`\`\`

## Bubbling vs Capturing

Events have three phases: capturing, target, and bubbling:

\`\`\`javascript
// Bubbling (default): event goes from target up to root
// Capturing: event goes from root down to target

// To use capturing, pass true as the third argument:
parent.addEventListener("click", handler, true);
\`\`\`

\`\`\`javascript
// Stop event propagation:
event.stopPropagation();

// Stop propagation and prevent other listeners on the same element:
event.stopImmediatePropagation();
\`\`\`

## preventDefault

Prevent the browser's default behavior for an event:

\`\`\`javascript
const link = document.querySelector("a");
link.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Navigation prevented");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Form submission prevented");
});
\`\`\`

Mastering events enables you to create rich, interactive user experiences. Understanding propagation and delegation is key to writing efficient event handling code.`,
        exercisePrompt:
          'Create a button with id "colorBtn" and text "Change Color". Add a click event that toggles the background color of document.body between "#3498db" and "#e74c3c". Also add a keydown event on document that logs "Escape pressed" when the Escape key is pressed.',
        starterCode: `// Create button and add event listeners
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Add event listeners using addEventListener",
          "Handle different event types (click, submit, keydown, input)",
          "Use the event object to access target and coordinates",
          "Implement event delegation for dynamic elements",
          "Understand bubbling, capturing, and preventDefault",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does event.stopPropagation() do?",
            options: [
              "Prevents the event from bubbling up to parent elements",
              "Stops the event from firing",
              "Prevents the default browser behavior",
              "Removes all event listeners",
            ],
            correctIndex: 0,
          },
          {
            question: "What is event delegation?",
            options: [
              "Using a single listener on a parent to handle events for multiple children",
              "Assigning events to delegate functions",
              "Creating custom events",
              "Removing event listeners automatically",
            ],
            correctIndex: 0,
          },
          {
            question: "What does preventDefault() do?",
            options: [
              "Prevents the browser's default action for the event",
              "Stops the event from propagating",
              "Removes the element from the DOM",
              "Cancels all other event listeners",
            ],
            correctIndex: 0,
          },
          {
            question: "Which event fires when a form is submitted?",
            options: ["submit", "click", "change", "input"],
            correctIndex: 0,
          },
          {
            question: "What is the difference between bubbling and capturing?",
            options: [
              "Bubbling goes from target to root; capturing goes from root to target",
              "Bubbling goes from root to target; capturing goes from target to root",
              "They are the same thing",
              "Capturing only works for click events",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-async",
        title: "Async JavaScript",
        order: 12,
        level: "advanced",
        exerciseType: "code",
        theory: `# Async JavaScript

Asynchronous programming is essential for tasks that take time, such as fetching data from servers, reading files, or waiting for user input. JavaScript handles asynchrony through callbacks, Promises, and async/await.

## Callbacks

A callback is a function passed as an argument to another function, to be executed later:

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData((result) => {
  console.log(result); // "Data received" (after 1 second)
});
\`\`\`

### Callback Hell

Nesting callbacks leads to deeply indented, hard-to-maintain code:

\`\`\`javascript
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});
\`\`\`

Promises and async/await solve this problem.

## Promises

A Promise represents a value that may be available now, later, or never. It has three states: pending, fulfilled, and rejected.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Operation succeeded");
  } else {
    reject("Operation failed");
  }
});

promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
\`\`\`

## Chaining Promises

Promises can be chained to avoid nesting:

\`\`\`javascript
fetchUser(id)
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.error(error));
\`\`\`

## async/await

\`async/await\` provides a synchronous-looking syntax for asynchronous code:

\`\`\`javascript
async function loadData() {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
  } catch (error) {
    console.error("Error:", error);
  }
}
\`\`\`

Any function marked \`async\` returns a Promise implicitly.

## Error Handling with async/await

Use \`try/catch\` blocks for error handling:

\`\`\`javascript
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error; // re-throw if needed
  }
}
\`\`\`

## Promise.all / Promise.race / Promise.allSettled

\`\`\`javascript
// Run multiple promises in parallel
const [users, posts] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts"),
]);

// Resolves when the first promise settles
const result = await Promise.race([
  fetch("/api/data"),
  timeout(5000),
]);

// Resolves when all settle (fulfilled or rejected)
const results = await Promise.allSettled([
  fetch("/api/data1"),
  fetch("/api/data2"),
]);
\`\`\`

Asynchronous programming is fundamental to modern JavaScript. Mastering these patterns allows you to build responsive, efficient applications that handle complex operations gracefully.`,
        exercisePrompt:
          'Write an async function called "fetchUserData" that simulates fetching user data. Use a Promise that resolves after 1 second with { id: 1, name: "Alice", email: "alice@example.com" }. Call the function with await, log the result, and add error handling with try/catch.',
        starterCode: `// Write the async function fetchUserData
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Understand callbacks and the callback hell problem",
          "Create and consume Promises with then/catch",
          "Use async/await for cleaner asynchronous code",
          "Handle async errors with try/catch",
          "Use Promise.all, Promise.race, and Promise.allSettled",
        ]),
        quiz: JSON.stringify([
          {
            question: "What states can a Promise be in?",
            options: ["pending, fulfilled, rejected", "start, running, done", "queued, active, finished", "open, closed, error"],
            correctIndex: 0,
          },
          {
            question: "What does the await keyword do?",
            options: [
              "Pauses execution until the Promise resolves and returns the value",
              "Creates a new Promise",
              "Rejects the current Promise",
              "Makes a function synchronous",
            ],
            correctIndex: 0,
          },
          {
            question: "What is callback hell?",
            options: [
              "Deeply nested callbacks that are hard to read and maintain",
              "Callbacks that throw errors",
              "Callbacks that are never called",
              "Callbacks that run synchronously",
            ],
            correctIndex: 0,
          },
          {
            question: "What does Promise.all do?",
            options: [
              "Runs multiple promises in parallel and resolves when all fulfill",
              "Runs promises sequentially",
              "Resolves when the first promise settles",
              "Creates a new promise from multiple values",
            ],
            correctIndex: 0,
          },
          {
            question: "How do you handle errors with async/await?",
            options: ["try/catch blocks", "then/catch chains", "error callbacks", "Both try/catch and then/catch are valid"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-apis",
        title: "Working with APIs",
        order: 13,
        level: "advanced",
        exerciseType: "code",
        theory: `# Working with APIs

Modern web applications rely heavily on APIs (Application Programming Interfaces) to communicate with servers. JavaScript provides the \`fetch\` API for making HTTP requests.

## The Fetch API

\`fetch\` returns a Promise that resolves to a Response object:

\`\`\`javascript
fetch("https://api.example.com/users")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
\`\`\`

## HTTP Methods

APIs use standard HTTP methods for different operations:

### GET (Read)

\`\`\`javascript
async function getUsers() {
  const response = await fetch("https://api.example.com/users");
  if (!response.ok) {
    throw new Error("HTTP error! status: " + response.status);
  }
  const users = await response.json();
  return users;
}
\`\`\`

### POST (Create)

\`\`\`javascript
async function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}
\`\`\`

### PUT (Update)

\`\`\`javascript
async function updateUser(id, userData) {
  const response = await fetch("https://api.example.com/users/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}
\`\`\`

### DELETE (Delete)

\`\`\`javascript
async function deleteUser(id) {
  const response = await fetch("https://api.example.com/users/" + id, {
    method: "DELETE",
  });
  return response.ok;
}
\`\`\`

## Handling Responses

Always check if the response was successful:

\`\`\`javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
\`\`\`

## Working with JSON

JSON (JavaScript Object Notation) is the most common data format for APIs:

\`\`\`javascript
// Parse JSON
const jsonString = '{"name":"Alice","age":30}';
const parsed = JSON.parse(jsonString);

// Convert to JSON string
const data = { name: "Bob", age: 25 };
const stringified = JSON.stringify(data);
\`\`\`

## REST APIs

REST (Representational State Transfer) is an architectural style for APIs. Key principles:
- Resources are identified by URLs
- HTTP methods define operations
- Responses are typically JSON
- Stateless communication

## Query Parameters and Headers

\`\`\`javascript
// Add query parameters
const url = new URL("https://api.example.com/search");
url.searchParams.set("q", "javascript");
url.searchParams.set("page", "2");

// Set custom headers
const response = await fetch(url, {
  headers: {
    "Authorization": "Bearer " + token,
    "X-Custom-Header": "value",
  },
});
\`\`\`

Working with APIs is a core skill for modern web developers. Understanding the full request/response cycle enables you to build connected, data-driven applications.`,
        exercisePrompt:
          'Write an async function "getWeather" that takes a city name and fetches from a placeholder API. Use fetch with query param ?city=cityName. Handle errors with try/catch, check response.ok, and log the result. (Use a fake API endpoint like https://api.example.com/weather). Then write a POST request to create a new user.',
        starterCode: `// Write the getWeather function
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Use the fetch API for HTTP requests",
          "Implement GET, POST, PUT, and DELETE operations",
          "Handle API responses and errors properly",
          "Work with JSON data (parse and stringify)",
          "Understand REST API principles and query parameters",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the fetch API return?",
            options: ["A Promise that resolves to a Response object", "A JSON object", "A string", "An XML document"],
            correctIndex: 0,
          },
          {
            question: "Which HTTP method is typically used to create a new resource?",
            options: ["POST", "GET", "DELETE", "PUT"],
            correctIndex: 0,
          },
          {
            question: "How do you check if a fetch request was successful?",
            options: ["Check response.ok", "Check response.status === 200 only", "Check response.error", "Use response.success()"],
            correctIndex: 0,
          },
          {
            question: "What does JSON.parse do?",
            options: [
              "Converts a JSON string to a JavaScript object",
              "Converts a JavaScript object to a JSON string",
              "Validates JSON syntax",
              "Fetches JSON from a URL",
            ],
            correctIndex: 0,
          },
          {
            question: "What are query parameters used for in API requests?",
            options: [
              "To send additional data in the URL for filtering or pagination",
              "To set HTTP headers",
              "To define the request body",
              "To specify the HTTP method",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-es6-plus",
        title: "Modern ES6+",
        order: 14,
        level: "advanced",
        exerciseType: "code",
        theory: `# Modern ES6+ Features

ECMAScript 2015 (ES6) brought monumental changes to JavaScript, and subsequent versions have continued to add powerful features. Modern JavaScript is cleaner, more expressive, and more powerful than ever.

## Template Literals

Template literals use backticks and support interpolation and multi-line strings:

\`\`\`javascript
const name = "Alice";
const age = 30;

// String interpolation
const greeting = \`Hello, I'm \${name} and I'm \${age} years old.\`;

// Multi-line strings
const html = \`
  <div>
    <h1>\${name}</h1>
    <p>Age: \${age}</p>
  </div>
\`;
\`\`\`

## Destructuring

Extract values from arrays and objects with concise syntax:

\`\`\`javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const person = { name: "Alice", age: 30, city: "Paris" };
const { name, age, ...other } = person;

// Renaming in destructuring
const { name: userName, age: userAge } = person;

// Nested destructuring
const data = { user: { id: 1, name: "Alice" } };
const { user: { id, name } } = data;
\`\`\`

## Spread and Rest Operators

The \`...\` syntax serves dual purposes:

\`\`\`javascript
// Spread (expand)
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest (collect)
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
\`\`\`

## Modules (import/export)

Organize code into reusable modules:

\`\`\`javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export default class Calculator { ... }

// app.js
import Calculator, { PI, add } from "./math.js";
import * as MathUtils from "./math.js";
\`\`\`

## Classes

ES6 classes provide syntactic sugar over prototypal inheritance:

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a sound.\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks.\`);
  }
}

const dog = new Dog("Buddy");
dog.speak(); // "Buddy barks."
\`\`\`

## Optional Chaining (?.)

Safely access deeply nested properties:

\`\`\`javascript
const user = { profile: { name: "Alice" } };
console.log(user?.profile?.name);      // "Alice"
console.log(user?.address?.street);    // undefined
console.log(user?.company?.getName?.()); // undefined
\`\`\`

## Nullish Coalescing (??)

Returns the right-hand operand only when the left is \`null\` or \`undefined\` (not other falsy values):

\`\`\`javascript
const value = 0;
console.log(value ?? 10);  // 0 (0 is not null/undefined)
console.log(null ?? 10);   // 10
console.log(undefined ?? 10); // 10
\`\`\`

Modern ES6+ features make JavaScript code more readable, maintainable, and enjoyable to write. Embracing these features is essential for contemporary JavaScript development.`,
        exercisePrompt:
          'Write code that: (1) creates an object "user" with name "Alice" and address { city: "Paris", zip: "75001" }, (2) uses destructuring to extract name and nested city, (3) uses nullish coalescing to default street to "Unknown", (4) uses template literals to log "Alice lives in Paris", (5) uses spread to create a copy of user with age: 30.',
        starterCode: `// Use modern ES6+ features
`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Use template literals for string interpolation and multi-line strings",
          "Apply destructuring for arrays and objects",
          "Differentiate between spread and rest operators",
          "Use ES6 modules for code organization",
          "Use optional chaining and nullish coalescing operators",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the difference between ?? and ||?",
            options: [
              "?? checks for null/undefined; || checks for any falsy value",
              "|| checks for null/undefined; ?? checks for any falsy value",
              "They are identical",
              "?? is for numbers only; || is for booleans",
            ],
            correctIndex: 0,
          },
          {
            question: "What does optional chaining (?.) do?",
            options: [
              "Safely accesses nested properties without throwing on null/undefined",
              "Makes properties required",
              "Creates optional method parameters",
              "Automatically fills in default values",
            ],
            correctIndex: 0,
          },
          {
            question: "What syntax is used for module exports?",
            options: ["export keyword", "module.exports", "exports default", "All of the above depending on module system"],
            correctIndex: 0,
          },
          {
            question: "What does const { name, age } = person do?",
            options: [
              "Extracts name and age properties from the person object",
              "Creates new properties on person",
              "Deletes name and age from person",
              "Converts person to an array",
            ],
            correctIndex: 0,
          },
          {
            question: "Which statement correctly creates a class that extends another?",
            options: ["class Dog extends Animal {}", "class Dog inherits Animal {}", "class Dog : Animal {}", "class Dog(Animal) {}"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "js-project",
        title: "Final Project: Interactive Todo App",
        order: 15,
        level: "advanced",
        exerciseType: "code",
        theory: `# Final Project: Interactive Todo App

This final project brings together everything you've learned: variables, functions, arrays, objects, DOM manipulation, events, and async programming. You'll build a complete interactive todo application.

## Project Overview

You will build a fully-functional todo application with the following features:

- Add new todos with a text input
- Delete individual todos
- Toggle completion status
- Persist data with localStorage
- Dark mode toggle
- Search/filter todos

## Architecture

Before writing code, plan the application architecture:

\`\`\`javascript
// Data structure for a todo
const todo = {
  id: Date.now(),
  text: "Learn JavaScript",
  completed: false,
  createdAt: new Date().toISOString(),
};
\`\`\`

## Step 1: Setting Up the HTML Structure

Your app needs these elements:
- An input field and "Add" button for creating todos
- A filter/search input
- A todo list container
- A dark mode toggle button
- A stats area showing total and completed count

## Step 2: State Management

Keep all todos in a single array that serves as your source of truth:

\`\`\`javascript
let todos = [];

function addTodo(text) {
  todos.push({
    id: Date.now(),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}
\`\`\`

## Step 3: localStorage Persistence

Save and load todos from localStorage:

\`\`\`javascript
const STORAGE_KEY = "todo-app";

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  todos = stored ? JSON.parse(stored) : [];
  renderTodos();
}
\`\`\`

## Step 4: Rendering the UI

Create a render function that builds the DOM dynamically:

\`\`\`javascript
function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  const filtered = getFilteredTodos();

  filtered.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.innerHTML = \`
      <input type="checkbox" \${todo.completed ? "checked" : ""}>
      <span>\${todo.text}</span>
      <button class="delete-btn">X</button>
    \`;
    list.appendChild(li);
  });
}
\`\`\`

## Step 5: Event Handling

Wire up all the event listeners:

\`\`\`javascript
document.getElementById("add-btn").addEventListener("click", () => {
  const input = document.getElementById("todo-input");
  if (input.value.trim()) {
    addTodo(input.value.trim());
    input.value = "";
  }
});

// Use event delegation for dynamic elements
document.getElementById("todo-list").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  } else if (e.target.type === "checkbox") {
    toggleTodo(id);
  }
});
\`\`\`

## Step 6: Dark Mode Toggle

\`\`\`javascript
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("dark-mode", isDark);
}
\`\`\`

## Step 7: Search and Filter

\`\`\`javascript
document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTodos();
});

function getFilteredTodos() {
  let filtered = todos;
  if (searchQuery) {
    filtered = filtered.filter(todo =>
      todo.text.toLowerCase().includes(searchQuery)
    );
  }
  if (filterMode === "active") {
    filtered = filtered.filter(todo => !todo.completed);
  } else if (filterMode === "completed") {
    filtered = filtered.filter(todo => todo.completed);
  }
  return filtered;
}
\`\`\`

Building this project consolidates all the skills you've learned and gives you a portfolio-ready application. Take your time, experiment, and make it your own!`,
        exercisePrompt:
          'Build a complete todo app with the following minimum requirements: (1) add todos with an input and button, (2) delete todos with a click, (3) toggle completion with a checkbox, (4) persist todos with localStorage, (5) add a dark mode toggle. Use good code organization and event delegation.',
        starterCode: `// Build your complete todo app here
// Start by defining your state and DOM references

`,
        language: "javascript",
        learningObjectives: JSON.stringify([
          "Build a complete interactive application from scratch",
          "Manage application state with arrays and objects",
          "Persist data using localStorage",
          "Implement event delegation for dynamic elements",
          "Apply all JavaScript fundamentals in a real-world project",
        ]),
        quiz: JSON.stringify([
          {
            question: "Why use event delegation for dynamically created elements?",
            options: [
              "It avoids adding listeners to each element and works for future elements",
              "It's the only way to handle clicks on lists",
              "It prevents event bubbling",
              "It automatically creates event listeners",
            ],
            correctIndex: 0,
          },
          {
            question: "What does localStorage.setItem do?",
            options: [
              "Stores a key-value pair in the browser's local storage",
              "Sends data to a server",
              "Creates a cookie",
              "Saves data to a database",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the purpose of having a single source of truth for state?",
            options: [
              "To ensure the UI matches the data and avoid inconsistencies",
              "To make the code run faster",
              "To reduce the number of variables",
              "To eliminate the need for functions",
            ],
            correctIndex: 0,
          },
          {
            question: "How do you prevent adding empty todos?",
            options: [
              "Check if input.value.trim() is not empty before adding",
              "Use a required attribute on the input",
              "Catch an error when adding",
              "Automatically fill empty todos with a default value",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the benefit of using map over forEach when toggling todo completion?",
            options: [
              "map returns a new array, making it immutable and easier to reason about",
              "map is faster than forEach",
              "forEach cannot modify array elements",
              "There is no benefit; they are identical",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
  ]);
}
