import { PrismaClient } from "@prisma/client";

export async function seedCppCourse(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { slug: "cpp-basics" },
    update: {},
    create: {
      slug: "cpp-basics",
      title: "C++ Programming",
      description:
        "Learn C++ — a powerful systems programming language. Master memory management, OOP, and the STL to build high-performance applications.",
      language: "cpp",
      icon: "⚡",
      order: 4,
      published: true,
    },
  });

  await prisma.$transaction([
    prisma.lesson.deleteMany({ where: { courseId: course.id } }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-introduction",
        title: "Introduction to C++",
        order: 1,
        level: "beginner",
        exerciseType: "code",
        theory: `# Introduction to C++

C++ is a powerful, high-performance programming language developed by Bjarne Stroustrup in 1979 at Bell Labs. Originally called "C with Classes," it was designed as an extension of the C language, adding object-oriented features while maintaining C's efficiency and low-level control. Today, C++ is widely used in game development, operating systems, embedded systems, financial trading platforms, and high-performance computing.

## Compiled vs Interpreted Languages

C++ is a **compiled** language, meaning source code must be translated into machine code by a compiler before it can run. This differs from interpreted languages like Python or JavaScript, which execute code line-by-line at runtime. Compiled C++ code generally runs much faster because the translation happens ahead of time, and the compiler can perform extensive optimizations during the build process.

The compilation pipeline typically involves:
- **Preprocessing**: Handles \`#include\`, \`#define\`, and other preprocessor directives
- **Compilation**: Translates C++ source into assembly or intermediate representation
- **Assembly**: Converts assembly into machine code (object files)
- **Linking**: Combines object files and libraries into a single executable

## Setting Up a C++ Development Environment

To write and run C++ programs, you need a compiler. Popular options include:
- **GCC (G++)**: The GNU Compiler Collection, standard on Linux and available on Windows via MinGW or WSL
- **Clang**: A fast, modern compiler with excellent error messages
- **MSVC**: Microsoft Visual C++ Compiler, part of Visual Studio on Windows

You also need a text editor or IDE such as Visual Studio Code, CLion, or Visual Studio. With VS Code, install the C/C++ extension by Microsoft for syntax highlighting, IntelliSense, and debugging support.

## Your First C++ Program

Every C++ program begins with the \`main\` function, which is the entry point of execution. Here is the classic "Hello, World!" program:

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`

Let's break down what each part does:
- \`#include <iostream>\`: This preprocessor directive includes the Input/Output Stream library, which gives us access to \`std::cout\` for console output
- \`int main()\`: The main function — every C++ program must have exactly one. The \`int\` return type indicates the program returns an integer status code to the operating system
- \`std::cout << "Hello, World!" << std::endl;\`: Prints text to the console. \`std::cout\` is the standard output stream, \`<<\` is the stream insertion operator, and \`std::endl\` inserts a newline and flushes the buffer
- \`return 0;\`: Indicates successful execution. A non-zero return typically signals an error

## Comments in C++

Comments are lines of text ignored by the compiler. They help document your code:

\`\`\`cpp
// This is a single-line comment

/* This is a
   multi-line comment */

/**
 * This is a documentation comment (Javadoc style)
 * Used for generating automatic documentation
 */
\`\`\`

## Building and Running

To compile and run a C++ program using G++:

\`\`\`bash
g++ hello.cpp -o hello
./hello
\`\`\`

The \`-o\` flag specifies the output filename. Without it, the compiler produces \`a.exe\` (Windows) or \`a.out\` (Unix). For more control, common compiler flags include \`-Wall\` to enable all warnings and \`-std=c++17\` to set the C++ standard version.

C++ gives you unparalleled control over system resources while maintaining high-level abstractions. Mastering the basics you learned here is the first step toward becoming a proficient C++ developer.`,
        exercisePrompt:
          'Write a C++ program that: (1) includes the iostream header, (2) defines the main function, (3) prints "I am learning C++!" to the console using std::cout, (4) adds a multi-line comment explaining what each line does, (5) returns 0. Build and run your program using a compiler.',
        starterCode: `#include <iostream>

int main() {
    // Your code here

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Understand the history and purpose of C++",
          "Differentiate compiled vs interpreted languages",
          "Set up a C++ development environment",
          "Write and explain a basic C++ program with iostream and main",
          "Use single-line and multi-line comments",
        ]),
        quiz: JSON.stringify([
          {
            question: "Who created C++?",
            options: ["Bjarne Stroustrup", "Dennis Ritchie", "Brendan Eich", "Guido van Rossum"],
            correctIndex: 0,
          },
          {
            question: "What does #include <iostream> do?",
            options: [
              "Includes the Input/Output Stream library for console operations",
              "Creates a new iostream object",
              "Defines the main function",
              "Links the program to the operating system",
            ],
            correctIndex: 0,
          },
          {
            question: "What does int main() return by convention on successful execution?",
            options: ["0", "1", "-1", "void"],
            correctIndex: 0,
          },
          {
            question: "Which of the following is a valid C++ single-line comment?",
            options: ["// This is a comment", "# This is a comment", "<!-- This is a comment -->", "' This is a comment"],
            correctIndex: 0,
          },
          {
            question: "What does the -o flag do when compiling with g++?",
            options: [
              "Specifies the output filename",
              "Enables all warnings",
              "Optimizes the code",
              "Links object files",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-variables",
        title: "Variables",
        order: 2,
        level: "beginner",
        exerciseType: "code",
        theory: `# Variables

Variables are named storage locations in memory that hold data values. In C++, every variable must have a declared type before it can be used. This is because C++ is a **statically typed** language — the type of a variable is known at compile time and cannot change during execution.

## Static Typing

Unlike dynamically typed languages where a variable can hold a string at one point and a number later, C++ requires you to declare the type upfront. This strictness helps catch type-related errors early during compilation and enables the compiler to generate highly optimized machine code.

## Fundamental Data Types

C++ provides several built-in types for storing different kinds of data:

\`\`\`cpp
int age = 25;              // Integer (whole numbers)
double price = 19.99;      // Double-precision floating point
char grade = 'A';          // Single character (use single quotes)
bool isActive = true;      // Boolean (true or false)
\`\`\`

## Declaration and Initialization

C++ offers multiple ways to declare and initialize variables:

\`\`\`cpp
int a;                   // Default-initialization (value is indeterminate)
int b = 10;              // Copy-initialization
int c(20);               // Direct-initialization
int d{30};               // Brace-initialization (C++11, preferred — prevents narrowing)
int e = {};              // Value-initialization (zero)
\`\`\`

Brace initialization (\`{}\`) is the recommended modern style because it prevents **narrowing conversions** — accidentally losing data when assigning a value of one type to a variable of another type:

\`\`\`cpp
int x{3.14};  // Compiler error: narrowing conversion from double to int
int y = 3.14; // Allowed: y becomes 3 (data silently lost)
\`\`\`

## Naming Rules

C++ variable names must follow these rules:
- Can contain letters, digits, and underscores
- Must begin with a letter or underscore (not a digit)
- Cannot be a reserved keyword (\`int\`, \`return\`, \`if\`, etc.)
- Case-sensitive: \`myVar\` and \`myvar\` are different variables
- Convention: use snake_case or camelCase consistently

## Constants with const

The \`const\` keyword makes a variable read-only after initialization. Any attempt to modify it will cause a compile error:

\`\`\`cpp
const double PI = 3.14159;
const int DAYS_IN_WEEK = 7;
// PI = 3.0;  // Error: cannot assign to a const variable
\`\`\`

Use \`const\` for values that should never change. This makes your code safer and communicates intent clearly.

## The sizeof Operator

\`sizeof\` returns the size of a type or variable in bytes:

\`\`\`cpp
std::cout << sizeof(int) << std::endl;    // 4 (on most modern systems)
std::cout << sizeof(double) << std::endl; // 8
std::cout << sizeof(char) << std::endl;   // 1
std::cout << sizeof(bool) << std::endl;   // 1
\`\`\`

Understanding variable types and sizes is crucial for writing efficient C++ code, especially in memory-constrained environments like embedded systems.`,
        exercisePrompt:
          'Declare the following variables using modern brace initialization: an int for your age, a double for your height in meters, a char for your initial, and a bool for whether you are a student. Also declare a const int for the current year. Print each variable and its type size using sizeof.',
        starterCode: `#include <iostream>

int main() {
    // Declare your variables here

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Understand C++ static typing and type declaration",
          "Declare and initialize variables using modern brace syntax",
          "Follow C++ naming rules and conventions",
          "Use const to create immutable variables",
          "Apply the sizeof operator to determine type sizes",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does brace initialization prevent?",
            options: [
              "Narrowing conversions that lose data",
              "Variable declaration without initialization",
              "Using const variables",
              "Memory leaks",
            ],
            correctIndex: 0,
          },
          {
            question: "Which of the following is a valid C++ variable name?",
            options: ["_count", "2fast", "my-var", "int"],
            correctIndex: 0,
          },
          {
            question: "What happens if you try to modify a const variable after initialization?",
            options: [
              "Compile-time error",
              "Runtime error",
              "The value changes silently",
              "Undefined behavior",
            ],
            correctIndex: 0,
          },
          {
            question: "What does sizeof(int) typically return on modern systems?",
            options: ["4", "2", "8", "1"],
            correctIndex: 0,
          },
          {
            question: "Which keyword declares a variable whose value cannot change after initialization?",
            options: ["const", "static", "readonly", "final"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-data-types",
        title: "Data Types",
        order: 3,
        level: "beginner",
        exerciseType: "code",
        theory: `# Data Types

C++ provides a rich set of fundamental data types that serve as the building blocks for all other data structures. Understanding these types, their ranges, and their behavior is essential for writing correct and efficient C++ programs.

## Fundamental Types

The core data types in C++ are:

\`\`\`cpp
bool b = true;           // Boolean — 1 byte, stores true or false
char c = 'A';            // Character — 1 byte, stores a single ASCII character
int i = 42;              // Integer — typically 4 bytes
float f = 3.14f;         // Single-precision floating-point — 4 bytes
double d = 3.14159;      // Double-precision floating-point — 8 bytes
void                      // Void — no type, used for functions that return nothing
\`\`\`

## Signed and Unsigned

By default, integer types are **signed**, meaning they can hold both positive and negative values. You can prefix them with \`unsigned\` to make them non-negative only, which doubles the upper range:

\`\`\`cpp
int signedVal = -100;           // Range: -2,147,483,648 to 2,147,483,647
unsigned int unsignedVal = 100;  // Range: 0 to 4,294,967,295
\`\`\`

Be careful with unsigned integers — mixing signed and unsigned in expressions can lead to surprising results due to implicit type conversions. A common bug is writing a loop condition like \`i < vec.size()\` where \`vec.size()\` returns an unsigned value.

## Float vs Double Precision

\`float\` provides about 7 decimal digits of precision while \`double\` provides about 15. The trade-off is memory: 4 bytes for \`float\` versus 8 for \`double\`. In modern C++, \`double\` is the default choice for floating-point arithmetic unless memory is extremely constrained:

\`\`\`cpp
float pi_float = 3.14159265358979f;    // Stored as ~3.1415927
double pi_double = 3.14159265358979;   // Stored as ~3.14159265358979
\`\`\`

## char and ASCII

The \`char\` type stores a single character using its ASCII (American Standard Code for Information Interchange) numeric code:

\`\`\`cpp
char letter = 'A';       // ASCII value 65
char digit = '0';        // ASCII value 48
char newline = '\\n';     // Newline character (ASCII 10)

// You can use char as a small integer
std::cout << letter + 1;  // Prints 66 ('B')
\`\`\`

## The auto Keyword (C++11)

\`auto\` tells the compiler to deduce the type of a variable from its initializer:

\`\`\`cpp
auto x = 42;            // int
auto y = 3.14;          // double
auto z = "hello";       // const char*
auto w = 'A';           // char
\`\`\`

\`auto\` is especially useful for complex types like iterators or lambda expressions where writing the full type would be cumbersome.

## Type Casting with static_cast

C++ provides several casting operators. \`static_cast\` is the most commonly used for safe, well-defined conversions between related types:

\`\`\`cpp
double pi = 3.14159;
int truncated = static_cast<int>(pi);       // 3 (truncation)
char ascii = static_cast<char>(65);         // 'A'

// Safer than C-style casts
int a = static_cast<int>(3.14);  // Explicit intent, compiler checked
\`\`\`

Always prefer \`static_cast\` over C-style casts (\`(int)x\`) because the compiler can verify the conversion is valid and the intent is explicit.`,
        exercisePrompt:
          "Write a program that declares variables of types: bool, char, int, float, and double. Initialize each with appropriate values. Print the size of each type using sizeof. Use auto to declare a variable and let the compiler deduce its type. Demonstrate static_cast by converting a double to an int and a char to its ASCII code.",
        starterCode: `#include <iostream>

int main() {
    // Declare and initialize fundamental types

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Identify fundamental C++ data types and their sizes",
          "Understand signed vs unsigned integer types",
          "Explain float vs double precision differences",
          "Work with char and ASCII values",
          "Use auto for type deduction and static_cast for type conversion",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the approximate precision of a double type?",
            options: ["15 decimal digits", "7 decimal digits", "20 decimal digits", "4 decimal digits"],
            correctIndex: 0,
          },
          {
            question: "What does static_cast<int>(3.99) return?",
            options: ["3", "4", "3.99", "Compiler error"],
            correctIndex: 0,
          },
          {
            question: "What is the ASCII value of the character 'A'?",
            options: ["65", "97", "41", "0"],
            correctIndex: 0,
          },
          {
            question: "Which keyword allows the compiler to deduce the type of a variable?",
            options: ["auto", "deduce", "typeof", "var"],
            correctIndex: 0,
          },
          {
            question: "What is the range of an unsigned int on a typical 32-bit system?",
            options: ["0 to 4,294,967,295", "-2,147,483,648 to 2,147,483,647", "0 to 65,535", "-32,768 to 32,767"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-operators",
        title: "Operators",
        order: 4,
        level: "beginner",
        exerciseType: "code",
        theory: `# Operators

Operators are symbols that tell the compiler to perform specific mathematical, relational, or logical operations. C++ has a rich set of operators that give you fine-grained control over data manipulation.

## Arithmetic Operators

These perform basic mathematical operations:

\`\`\`cpp
int a = 10, b = 3;
std::cout << a + b;   // 13 (addition)
std::cout << a - b;   // 7  (subtraction)
std::cout << a * b;   // 30 (multiplication)
std::cout << a / b;   // 3  (integer division — truncates toward zero)
std::cout << a % b;   // 1  (modulus — remainder)
\`\`\`

Important: dividing two integers performs integer division, truncating any fractional part. Use \`double\` operands for floating-point division.

## Assignment and Compound Assignment

The assignment operator (\`=\`) stores a value in a variable. Compound assignment operators combine an operation with assignment:

\`\`\`cpp
int x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 5;   // x = x % 5  → 1
\`\`\`

## Comparison (Relational) Operators

These compare two values and return a boolean (\`true\` or \`false\`):

\`\`\`cpp
std::cout << (5 == 5);   // true  (equal to)
std::cout << (5 != 3);   // true  (not equal to)
std::cout << (5 > 3);    // true  (greater than)
std::cout << (5 < 3);    // false (less than)
std::cout << (5 >= 5);   // true  (greater than or equal)
std::cout << (5 <= 3);   // false (less than or equal)
\`\`\`

## Logical Operators

Logical operators work with boolean values and support short-circuit evaluation:

\`\`\`cpp
bool a = true, b = false;
std::cout << (a && b);   // false (AND — both must be true)
std::cout << (a || b);   // true  (OR — at least one must be true)
std::cout << (!a);       // false (NOT — inverts the value)
\`\`\`

## Increment and Decrement

The increment (\`++\`) and decrement (\`--\`) operators add or subtract 1 from a variable. They exist in prefix and postfix forms:

\`\`\`cpp
int x = 5;
std::cout << ++x;  // 6 (prefix: increment then use)
std::cout << x++;  // 6 (postfix: use then increment — x becomes 7)
std::cout << x;    // 7
\`\`\`

## Bitwise Operators (Introduction)

Bitwise operators manipulate individual bits of integer values:

\`\`\`cpp
unsigned int a = 5;   // Binary: 0101
unsigned int b = 3;   // Binary: 0011

std::cout << (a & b);  // 1  (AND: 0001)
std::cout << (a | b);  // 7  (OR:  0111)
std::cout << (a ^ b);  // 6  (XOR: 0110)
std::cout << (~a);     // large number (NOT: inverts all bits)
std::cout << (a << 1); // 10 (left shift: 1010)
std::cout << (a >> 1); // 2  (right shift: 0010)
\`\`\`

## Operator Precedence

Operator precedence determines the order of evaluation. For example, multiplication has higher precedence than addition:

\`\`\`cpp
std::cout << 2 + 3 * 4;     // 14 (not 20)
std::cout << (2 + 3) * 4;   // 20 (parentheses override precedence)
\`\`\`

When in doubt, use parentheses to make the intended order explicit. Clear code is better than clever code.`,
        exercisePrompt:
          "Write a program that: (1) declares int a = 15 and int b = 4 and computes all arithmetic operations, (2) demonstrates prefix vs postfix increment, (3) uses compound assignment operators, (4) compares a and b with all relational operators, and (5) performs bitwise AND, OR, and XOR on a and b. Print each result with a descriptive label.",
        starterCode: `#include <iostream>

int main() {
    int a = 15, b = 4;

    // Arithmetic operations

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Use arithmetic, assignment, and compound assignment operators",
          "Apply comparison and logical operators in expressions",
          "Differentiate between prefix and postfix increment/decrement",
          "Understand operator precedence and use parentheses",
          "Perform basic bitwise operations on integers",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does 15 / 4 produce in C++ with int operands?",
            options: ["3", "3.75", "4", "3.0"],
            correctIndex: 0,
          },
          {
            question: "What is the result of 5 & 3 (bitwise AND)?",
            options: ["1", "7", "6", "0"],
            correctIndex: 0,
          },
          {
            question: "If x = 5, what does ++x + x++ evaluate to?",
            options: ["12", "11", "10", "Undefined behavior"],
            correctIndex: 0,
          },
          {
            question: "What does x %= 3 do if x is 10?",
            options: ["Sets x to 1", "Sets x to 3", "Sets x to 10 % 3", "Divides x by 3"],
            correctIndex: 0,
          },
          {
            question: "What is the result of true && false || true?",
            options: ["true", "false", "undefined", "compiler error"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-conditions",
        title: "Conditionals",
        order: 5,
        level: "beginner",
        exerciseType: "code",
        theory: `# Conditionals

Conditionals are fundamental control structures that allow your program to make decisions and execute different code paths based on whether conditions are true or false.

## if, else if, else Statements

The \`if\` statement executes a block of code when its condition evaluates to \`true\`. You can chain additional conditions with \`else if\` and provide a fallback with \`else\`:

\`\`\`cpp
int score = 85;

if (score >= 90) {
    std::cout << "Grade: A";
} else if (score >= 80) {
    std::cout << "Grade: B";
} else if (score >= 70) {
    std::cout << "Grade: C";
} else if (score >= 60) {
    std::cout << "Grade: D";
} else {
    std::cout << "Grade: F";
}
\`\`\`

## switch Statement

\`switch\` is useful when comparing a single integer or enum value against many distinct cases. It can be more readable and sometimes faster than long if/else chains:

\`\`\`cpp
int day = 3;

switch (day) {
    case 1:
        std::cout << "Monday";
        break;
    case 2:
        std::cout << "Tuesday";
        break;
    case 3:
        std::cout << "Wednesday";
        break;
    case 4:
        std::cout << "Thursday";
        break;
    case 5:
        std::cout << "Friday";
        break;
    default:
        std::cout << "Weekend";
}
\`\`\`

Each \`case\` needs a \`break\` to prevent **fall-through**, where execution continues into the next case. Fall-through can be intentional but must be clearly documented.

## Ternary Operator

The ternary operator (\`?:\`) is a compact way to write simple conditional expressions:

\`\`\`cpp
int age = 20;
std::string status = (age >= 18) ? "Adult" : "Minor";
std::cout << status;  // "Adult"
\`\`\`

Ternaries can be nested but it hurts readability. Use regular if/else for complex conditions.

## Logical Operators in Conditions

Logical operators combine multiple conditions:

\`\`\`cpp
int age = 25;
bool hasLicense = true;

if (age >= 18 && hasLicense) {
    std::cout << "You can drive";
}

if (age < 16 || !hasLicense) {
    std::cout << "You cannot drive";
}
\`\`\`

## Common Pitfall: == vs =

One of the most common beginner mistakes is using assignment (\`=\`) instead of comparison (\`==\`) in conditions:

\`\`\`cpp
int x = 5;
if (x = 10) {    // BUG: assigns 10 to x, then checks if 10 is truthy (always true)
    // This always runs!
}

if (x == 10) {   // Correct: compares x with 10
    // Runs only if x equals 10
}
\`\`\`

To catch this error, put the literal on the left: \`if (10 == x)\`. If you accidentally write \`if (10 = x)\`, the compiler will error because you cannot assign to a literal.

Mastering conditionals is essential for writing programs that respond intelligently to different inputs, states, and edge cases.`,
        exercisePrompt:
          'Write a program that: (1) declares an int variable called "temperature" with value 22, (2) uses if/else if/else to print: "Freezing" if below 0, "Cold" if 0-10, "Cool" if 11-20, "Warm" if 21-30, "Hot" if above 30, (3) uses a switch statement on a "month" variable to print the season (winter: 12,1,2; spring: 3,4,5; summer: 6,7,8; fall: 9,10,11), (4) uses the ternary operator to print "Even" or "Odd" for a given number.',
        starterCode: `#include <iostream>

int main() {
    int temperature = 22;
    int month = 3;
    int number = 7;

    // if/else chain for temperature

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Write if/else if/else conditional chains",
          "Use switch/case statements with break correctly",
          "Apply the ternary operator for simple conditions",
          "Combine logical operators in complex conditions",
          "Avoid common pitfalls like = vs ==",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does break do in a switch statement?",
            options: [
              "Exits the switch to prevent fall-through to the next case",
              "Restarts the switch statement",
              "Breaks out of the entire program",
              "Logs the current case",
            ],
            correctIndex: 0,
          },
          {
            question: "What does the ternary (x > 0) ? 'positive' : 'negative' return when x = -5?",
            options: ["'negative'", "'positive'", "false", "undefined"],
            correctIndex: 0,
          },
          {
            question: "What happens with if (x = 0) in C++?",
            options: [
              "Assigns 0 to x and the condition is false (0 is falsy)",
              "Compares x to 0",
              "Compiler error",
              "Undefined behavior",
            ],
            correctIndex: 0,
          },
          {
            question: "Which logical operator requires both operands to be true?",
            options: ["&& (AND)", "|| (OR)", "! (NOT)", "^ (XOR)"],
            correctIndex: 0,
          },
          {
            question: "What should a switch case end with to prevent fall-through?",
            options: ["break", "continue", "return", "exit"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-loops",
        title: "Loops",
        order: 6,
        level: "beginner",
        exerciseType: "code",
        theory: `# Loops

Loops allow you to execute a block of code repeatedly. C++ provides three primary loop constructs, each suited for different scenarios.

## The for Loop

The \`for\` loop is ideal when you know the number of iterations in advance. It has three parts: initialization, condition, and increment:

\`\`\`cpp
for (int i = 0; i < 5; i++) {
    std::cout << i << " ";  // 0 1 2 3 4
}
\`\`\`

All three parts are optional. \`for (;;)\` creates an infinite loop. The initialization variable (\`i\` here) is scoped to the loop in C++11 and later.

## The while Loop

The \`while\` loop runs as long as its condition is \`true\`. It checks the condition before each iteration:

\`\`\`cpp
int count = 0;
while (count < 5) {
    std::cout << count << " ";  // 0 1 2 3 4
    count++;
}
\`\`\`

Use \`while\` when the number of iterations depends on a dynamic condition rather than a fixed count.

## The do-while Loop

\`do-while\` is similar to \`while\` but guarantees that the body executes at least once because the condition is checked after each iteration:

\`\`\`cpp
int i = 0;
do {
    std::cout << i << " ";  // 0 1 2 3 4
    i++;
} while (i < 5);
\`\`\`

## break and continue

\`break\` exits the loop immediately. \`continue\` skips the rest of the current iteration and jumps to the next one:

\`\`\`cpp
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;   // Skip 3
    if (i == 7) break;       // Stop at 7
    std::cout << i << " ";   // 0 1 2 4 5 6
}
\`\`\`

## Nested Loops

Loops can be placed inside other loops. Nested loops are common for working with multidimensional data:

\`\`\`cpp
for (int row = 0; row < 3; row++) {
    for (int col = 0; col < 4; col++) {
        std::cout << "(" << row << "," << col << ") ";
    }
    std::cout << std::endl;
}
\`\`\`

## Loop Variable Scope

Variables declared in the \`for\` loop header are scoped to the loop body in C++11 and later. If you need the variable after the loop, declare it before:

\`\`\`cpp
for (int i = 0; i < 5; i++) { /* i is local to the loop */ }
// std::cout << i;  // Error: i is out of scope

int i = 0;
for (i = 0; i < 5; i++) { /* ... */ }
std::cout << i;  // 5 — i is still in scope
\`\`\`

## Infinite Loops

An infinite loop occurs when the termination condition is never met. Always ensure there's a clear path to exit:

\`\`\`cpp
// DANGER: infinite loops
// while (true) { /* runs forever */ }
// for (;;) { /* runs forever */ }

// Safe: exit condition will eventually be met
int x = 0;
while (true) {
    if (x >= 5) break;
    x++;
}
\`\`\`

Choosing the right loop construct makes your code clearer and less error-prone. Prefer \`for\` when the iteration count is known, and \`while\` for condition-based repetition.`,
        exercisePrompt:
          "Write a program that: (1) uses a for loop to print numbers 1 to 10, (2) uses a while loop to print numbers 10 down to 1, (3) uses a do-while loop to calculate the sum of numbers from 1 to 100, (4) prints a 5x5 multiplication table using nested for loops, and (5) uses break to stop a loop when a condition is met.",
        starterCode: `#include <iostream>

int main() {
    // For loop: 1 to 10

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Differentiate between for, while, and do-while loops",
          "Control loop flow with break and continue",
          "Use nested loops for multidimensional iteration",
          "Understand loop variable scoping rules",
          "Recognize and avoid infinite loops",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the continue statement do inside a loop?",
            options: [
              "Skips the rest of the current iteration and proceeds to the next",
              "Exits the loop entirely",
              "Restarts the loop from the beginning",
              "Throws an error",
            ],
            correctIndex: 0,
          },
          {
            question: "Which loop guarantees that its body executes at least once?",
            options: ["do-while", "while", "for", "range-based for"],
            correctIndex: 0,
          },
          {
            question: "What is the scope of a variable declared in the for loop header?",
            options: [
              "The loop body only (C++11 and later)",
              "The entire function",
              "The entire file",
              "Global scope",
            ],
            correctIndex: 0,
          },
          {
            question: "What does for (;;) create?",
            options: ["An infinite loop", "A syntax error", "A loop that runs once", "A loop that never runs"],
            correctIndex: 0,
          },
          {
            question: "What is the output of: for (int i = 0; i < 5; i++) { if (i == 2) continue; cout << i; }",
            options: ["0134", "01234", "012", "34"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-functions",
        title: "Functions",
        order: 7,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Functions

Functions are reusable blocks of code that perform a specific task. They are the primary mechanism for organizing code, avoiding duplication, and enabling abstraction in C++.

## Declaration vs Definition

In C++, you can separate a function's **declaration** (prototype) from its **definition** (implementation). The declaration tells the compiler about the function's name, return type, and parameters. The definition provides the actual body:

\`\`\`cpp
// Declaration (prototype) — typically in a header file
int add(int a, int b);

// Definition — typically in a source file
int add(int a, int b) {
    return a + b;
}
\`\`\`

Function prototypes allow you to call a function before its definition appears in the file, which is essential for organizing code across multiple files.

## Parameters and Return Types

Functions can accept zero or more parameters and return a value (or \`void\` for no return):

\`\`\`cpp
// No parameters, no return value
void greet() {
    std::cout << "Hello!";
}

// Parameters and return value
int multiply(int x, int y) {
    return x * y;
}
\`\`\`

## Pass by Value vs Pass by Reference

By default, C++ passes arguments **by value** — the function receives a copy of the argument. Changes to the parameter do not affect the original variable:

\`\`\`cpp
void doubleValue(int x) {
    x *= 2;  // Only modifies the local copy
}

int num = 5;
doubleValue(num);
std::cout << num;  // Still 5
\`\`\`

To modify the original, pass **by reference** using the \`&\` symbol:

\`\`\`cpp
void doubleValue(int& x) {
    x *= 2;  // Modifies the original variable
}

int num = 5;
doubleValue(num);
std::cout << num;  // 10
\`\`\`

## Function Overloading

C++ allows multiple functions with the same name as long as their parameter lists differ (different number of parameters or different types):

\`\`\`cpp
int max(int a, int b) {
    return (a > b) ? a : b;
}

double max(double a, double b) {
    return (a > b) ? a : b;
}

int max(int a, int b, int c) {
    return max(max(a, b), c);
}
\`\`\`

The compiler selects the correct overload based on the arguments at the call site. This is called **compile-time polymorphism**.

## Default Arguments

Function parameters can have default values that are used when the caller omits the corresponding argument:

\`\`\`cpp
void display(int value, int base = 10) {
    if (base == 10) {
        std::cout << value;
    } else if (base == 16) {
        std::cout << std::hex << value;
    }
}

display(42);       // Uses default base = 10
display(42, 16);   // Uses base = 16
\`\`\`

Default arguments must appear after all required parameters in the parameter list.

## Function Prototypes

A function prototype declares a function before its full definition. This is required when functions call each other recursively or when organizing code across multiple files:

\`\`\`cpp
#include <iostream>

// Prototype
bool isEven(int n);

int main() {
    std::cout << isEven(10);  // Works because prototype exists
    return 0;
}

// Definition
bool isEven(int n) {
    return n % 2 == 0;
}
\`\`\`

Functions are the building blocks of modular C++ programs. Mastering return types, parameter passing, overloading, and prototyping will enable you to write clean, reusable, and well-organized code.`,
        exercisePrompt:
          "Write a program with: (1) a function prototype for double rectangleArea(double length, double width), (2) a function definition that returns length * width, (3) an overloaded function int rectangleArea(int length, int width), (4) a function void scale(int& value, double factor) that modifies value by reference, and (5) a function greet with a default argument of 'Guest'. Call all functions from main and print results.",
        starterCode: `#include <iostream>

// Function prototype

int main() {
    // Call functions here
    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Write function declarations (prototypes) and definitions",
          "Differentiate pass-by-value from pass-by-reference",
          "Use function overloading with different parameter lists",
          "Apply default argument values in functions",
          "Understand when and why to use function prototypes",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the difference between pass-by-value and pass-by-reference?",
            options: [
              "Pass-by-value copies the argument; pass-by-reference gives access to the original",
              "Pass-by-value is faster; pass-by-reference is slower",
              "They are functionally identical",
              "Pass-by-reference copies the argument; pass-by-value modifies the original",
            ],
            correctIndex: 0,
          },
          {
            question: "What is function overloading?",
            options: [
              "Multiple functions with the same name but different parameters",
              "Writing a function that calls itself",
              "Assigning a function to a variable",
              "Using a function before its definition",
            ],
            correctIndex: 0,
          },
          {
            question: "What happens when a default argument is omitted in a function call?",
            options: [
              "The default value is used",
              "The compiler throws an error",
              "The program crashes at runtime",
              "Undefined behavior occurs",
            ],
            correctIndex: 0,
          },
          {
            question: "What symbol is used to indicate a reference parameter?",
            options: ["&", "*", "@", "ref"],
            correctIndex: 0,
          },
          {
            question: "A function prototype must specify:",
            options: [
              "Return type, name, and parameter types",
              "Only the function body",
              "Only the return type",
              "The full implementation with default values",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-arrays",
        title: "Arrays",
        order: 8,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Arrays

Arrays are collection of elements of the same type, stored contiguously in memory. In C++, arrays have a fixed size determined at compile time, and they provide fast indexed access to elements.

## Fixed-Size Array Declaration

Arrays are declared with the element type followed by square brackets containing the size:

\`\`\`cpp
int numbers[5];                        // Uninitialized — values are indeterminate
int scores[3] = {85, 92, 78};         // Aggregate initialization
int primes[] = {2, 3, 5, 7, 11};     // Size deduced from initializer
int zeros[10] = {};                   // All elements initialized to 0
int fixed[3] = {1, 2};               // Partially initialized: {1, 2, 0}
\`\`\`

## Array Indexing

Array elements are accessed using the subscript operator \`[]\` with zero-based indexing:

\`\`\`cpp
int arr[4] = {10, 20, 30, 40};
std::cout << arr[0];   // 10 (first element)
std::cout << arr[3];   // 40 (last element)
arr[1] = 25;           // Modify element at index 1

std::cout << arr[4];   // BUG: out-of-bounds access! Undefined behavior
\`\`\`

C++ does **not** perform bounds checking on array accesses. Accessing an index beyond the array size results in undefined behavior — it might crash, corrupt data, or silently produce wrong results.

## Multidimensional Arrays

Arrays can have multiple dimensions for representing matrices, grids, or tables:

\`\`\`cpp
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

std::cout << matrix[1][2];  // 7 (row 1, column 2)
\`\`\`

Multidimensional arrays are stored in **row-major order**, meaning elements of the same row are adjacent in memory.

## Range-Based for Loops (C++11)

C++11 introduced range-based for loops for iterating over arrays (and other containers):

\`\`\`cpp
int numbers[] = {1, 2, 3, 4, 5};

for (int n : numbers) {
    std::cout << n << " ";  // 1 2 3 4 5
}

// Using auto and reference to modify elements
for (auto& n : numbers) {
    n *= 2;
}

// Using const reference for read-only access
for (const auto& n : numbers) {
    std::cout << n << " ";  // 2 4 6 8 10
}
\`\`\`

## Arrays as Function Parameters

When you pass an array to a function, it **decays** to a pointer to its first element. The size information is lost, so you must pass the size separately:

\`\`\`cpp
// Array parameter decays to pointer
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i] << " ";
    }
}

// Equivalent pointer notation
void printArray(int* arr, int size) {
    // Same implementation
}

int data[] = {1, 2, 3, 4, 5};
printArray(data, 5);
\`\`\`

Alternatively, you can pass arrays by reference (preserving size) using templates or the reference syntax:

\`\`\`cpp
void printFixedArray(int (&arr)[5]) {  // Only accepts arrays of exactly 5 ints
    for (int n : arr) {
        std::cout << n << " ";
    }
}
\`\`\`

Arrays are a fundamental data structure that every C++ programmer must master. However, for most applications, prefer \`std::vector\` or \`std::array\` over raw arrays for better safety and convenience.`,
        exercisePrompt:
          "Write a program that: (1) declares an int array of size 10 initialized with the first 10 natural numbers, (2) uses a range-based for loop to print the array, (3) defines a function that takes an array and its size and returns the sum of all elements, (4) declares a 3x3 identity matrix as a 2D array and prints it, and (5) demonstrates modifying an array element using a reference in a range-based for loop.",
        starterCode: `#include <iostream>

// Function to sum array elements

int main() {
    // Array of first 10 natural numbers

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Declare and initialize fixed-size arrays",
          "Access array elements using zero-based indexing",
          "Use range-based for loops for iteration",
          "Pass arrays to functions and understand array-to-pointer decay",
          "Work with multidimensional arrays",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the index of the first element in a C++ array?",
            options: ["0", "1", "-1", "It depends on the compiler"],
            correctIndex: 0,
          },
          {
            question: "What happens when you access an array element out of bounds?",
            options: [
              "Undefined behavior — the program may crash or produce wrong results",
              "A std::out_of_range exception is thrown",
              "The program always crashes immediately",
              "The access is silently ignored",
            ],
            correctIndex: 0,
          },
          {
            question: "What does a range-based for loop (for (int x : arr)) iterate over?",
            options: ["All elements of the array", "Array indices", "Every other element", "Elements in reverse order"],
            correctIndex: 0,
          },
          {
            question: "What happens to an array when passed to a function?",
            options: [
              "It decays to a pointer to the first element",
              "A complete copy of the array is made",
              "The function receives a reference to the array",
              "The array size is automatically preserved",
            ],
            correctIndex: 0,
          },
          {
            question: "How is a 2D array int m[3][4] stored in memory?",
            options: [
              "Row-major order (all elements of row 0, then row 1, etc.)",
              "Column-major order (all elements of column 0, then column 1, etc.)",
              "As a linked list of rows",
              "In random order decided by the compiler",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-pointers",
        title: "Pointers",
        order: 9,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Pointers

Pointers are variables that store memory addresses rather than data values. They are one of C++'s most powerful and dangerous features, giving you direct access to and control over memory.

## Address-of Operator (&) and Dereference Operator (*)

The address-of operator (\`&\`) returns the memory address of a variable. The dereference operator (\`*\`) accesses the value stored at the address a pointer holds:

\`\`\`cpp
int value = 42;
int* ptr = &value;   // ptr stores the address of value

std::cout << ptr;     // Prints the memory address (e.g., 0x7ffd1234)
std::cout << *ptr;    // Prints 42 (dereference — get the value at the address)

*ptr = 100;           // Modify value through the pointer
std::cout << value;   // 100
\`\`\`

## Pointer Arithmetic

You can perform arithmetic operations on pointers, which is especially useful when navigating arrays:

\`\`\`cpp
int arr[] = {10, 20, 30, 40, 50};
int* p = arr;           // Points to arr[0]

std::cout << *p;         // 10 (arr[0])
std::cout << *(p + 1);   // 20 (arr[1])
std::cout << *(p + 3);   // 40 (arr[3])

p++;                     // Now points to arr[1]
std::cout << *p;         // 20 (arr[1])
\`\`\`

Pointer arithmetic takes the size of the pointed-to type into account. If \`p\` is an \`int*\`, \`p + 1\` advances by \`sizeof(int)\` bytes (typically 4), not 1 byte.

## Null Pointers

A null pointer points to nothing (address 0). Dereferencing a null pointer causes a crash (or worse, undefined behavior):

\`\`\`cpp
int* ptr = nullptr;      // Modern C++: use nullptr, not NULL or 0

if (ptr != nullptr) {
    std::cout << *ptr;   // Safe: only dereference if not null
}
\`\`\`

Always initialize pointers and check for null before dereferencing.

## Pointers and Arrays

Arrays and pointers are closely related in C++. An array name acts as a pointer to its first element:

\`\`\`cpp
int arr[5] = {1, 2, 3, 4, 5};
int* p = arr;            // Equivalent to &arr[0]

// Array indexing is pointer arithmetic under the hood
std::cout << arr[2];     // 3
std::cout << *(arr + 2); // 3 — identical
\`\`\`

## Dynamic Allocation: new and delete

C++ allows you to allocate memory at runtime on the **heap**:

\`\`\`cpp
// Allocate a single integer on the heap
int* p = new int(42);
std::cout << *p;          // 42
delete p;                 // Free the memory — ALWAYS do this!

// Allocate an array on the heap
int* arr = new int[10];
for (int i = 0; i < 10; i++) arr[i] = i * 10;
delete[] arr;             // Use delete[] for arrays
\`\`\`

## Memory Leaks — An Introduction

A **memory leak** occurs when you allocate memory with \`new\` but never release it with \`delete\`. The memory remains allocated until the program exits, which wastes resources and can cause crashes in long-running programs:

\`\`\`cpp
void leakExample() {
    int* ptr = new int(100);
    // Never call delete ptr — memory leak!
}

// Each call leaks 4 bytes (or more)
for (int i = 0; i < 1000000; i++) {
    leakExample();
}
\`\`\`

Modern C++ prefers **smart pointers** (\`std::unique_ptr\`, \`std::shared_ptr\`) over raw pointers for dynamic allocation, as they automatically free memory when no longer needed. However, understanding raw pointers is essential for reading legacy code and grasping how memory management works under the hood.`,
        exercisePrompt:
          "Write a program that: (1) declares an int variable and a pointer to it, prints the value and address using both the variable and the pointer, (2) creates an array of 5 ints and uses pointer arithmetic to print all elements, (3) dynamically allocates an array of integers using new, fills it with values, prints them, and deallocates with delete[], (4) demonstrates a null pointer check before dereferencing.",
        starterCode: `#include <iostream>

int main() {
    // Declare int and pointer

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Use the address-of (&) and dereference (*) operators correctly",
          "Perform pointer arithmetic on arrays",
          "Initialize and check for null pointers with nullptr",
          "Understand the relationship between arrays and pointers",
          "Allocate and deallocate heap memory with new and delete",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the dereference operator (*) do when applied to a pointer?",
            options: [
              "Accesses the value stored at the memory address the pointer holds",
              "Returns the memory address of the pointer",
              "Creates a new pointer",
              "Deletes the pointer",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the modern C++ way to represent a null pointer?",
            options: ["nullptr", "NULL", "0", "null"],
            correctIndex: 0,
          },
          {
            question: "If p is an int* pointing to arr[0], what does *(p + 2) give you?",
            options: ["arr[2]", "arr[0] + 2", "The address of arr[2]", "Undefined behavior"],
            correctIndex: 0,
          },
          {
            question: "What must you do after allocating memory with new to avoid memory leaks?",
            options: ["Call delete to free the memory", "Nothing — it frees automatically", "Set the pointer to nullptr", "Call free()"],
            correctIndex: 0,
          },
          {
            question: "How are array names and pointers related?",
            options: [
              "An array name acts as a pointer to the first element",
              "They are completely unrelated",
              "An array is a pointer with different syntax",
              "Arrays cannot be used with pointers",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-references",
        title: "References",
        order: 10,
        level: "intermediate",
        exerciseType: "code",
        theory: `# References

References are aliases for existing variables. Once a reference is bound to a variable, any operation on the reference is actually performed on the original variable. References are a key feature of C++ that enables cleaner, safer code compared to pointers in many scenarios.

## Reference Variables

A reference is declared using the \`&\` symbol after the type. It must be initialized when declared and cannot be reassigned to refer to a different variable:

\`\`\`cpp
int original = 42;
int& ref = original;   // ref is a reference to original

std::cout << ref;       // 42
ref = 100;              // Modifies original
std::cout << original;  // 100
\`\`\`

Unlike pointers, references cannot be null and do not require dereferencing syntax. They behave syntactically like the original variable they alias.

## References vs Pointers

While references and pointers both provide indirect access to variables, they have important differences:

| Feature | Reference | Pointer |
|---------|-----------|---------|
| Must be initialized | Yes | No (dangerous) |
| Can be reassigned | No | Yes |
| Can be null | No | Yes (use nullptr) |
| Dereferencing syntax | Automatic | Requires * |
| Arithmetic | Not supported | Supported |
| Use with arrays | No | Yes |

## Passing by Reference

The most common use of references is to avoid copying large objects when passing arguments to functions, or to allow the function to modify the original variable:

\`\`\`cpp
// Without reference: a copy is made
void incrementCopy(int x) {
    x++;  // Only modifies the local copy
}

// With reference: the original is modified
void incrementRef(int& x) {
    x++;  // Modifies the original variable
}

int value = 5;
incrementCopy(value);
std::cout << value;  // 5 (unchanged)

incrementRef(value);
std::cout << value;  // 6 (modified)
\`\`\`

## Returning by Reference

Functions can return references, which is useful for chaining operations or accessing elements of a container:

\`\`\`cpp
int& getElement(int arr[], int index) {
    return arr[index];
}

int data[3] = {10, 20, 30};
getElement(data, 1) = 99;  // Modifies data[1]
std::cout << data[1];      // 99

// Chaining with references (common in operator overloading)
std::cout << (std::cout << "Hello");  // Outputs "Hello" and returns cout
\`\`\`

Never return a reference to a local variable, as the variable will be destroyed when the function exits, leaving a dangling reference.

## const References

Using \`const\` with references allows you to read data without copying and without risk of modification:

\`\`\`cpp
void printLargeObject(const std::string& str) {
    // Can read str, but cannot modify it
    std::cout << str;
}

// const reference can bind to temporaries
const int& ref = 42;  // OK: temporary extended lifetime

// Non-const reference cannot bind to temporaries
// int& ref = 42;  // Compiler error
\`\`\`

\`const\` references are the preferred way to pass parameters that you only need to read, especially for large types like strings, vectors, and custom objects.

## Reference vs Pointer Use Cases

Use references when:
- You need an alias that cannot be reassigned
- You want to pass parameters by reference with clean syntax
- You are overloading operators (which typically return references)
- You need to guarantee the object exists (no null)

Use pointers when:
- You need to reassign what the variable points to
- You need pointer arithmetic (e.g., iterating through arrays)
- The variable might need to be null
- You are working with dynamic memory allocation

References are a cornerstone of modern C++ programming. Mastering them is essential for writing efficient, readable code that leverages the full power of the language.`,
        exercisePrompt:
          "Write a program that: (1) declares an int variable and a reference to it, modifies through the reference and prints the original, (2) defines a function void swap(int& a, int& b) that swaps two values using references, (3) defines a function that takes a const reference to a std::string and prints it, (4) demonstrates that a reference cannot be reassigned (try it — observe the compiler error), (5) calls the swap function with two integers from main.",
        starterCode: `#include <iostream>
#include <string>

// swap function using references

int main() {
    int a = 10, b = 20;

    // Declare a reference

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Declare and use reference variables",
          "Differentiate references from pointers",
          "Pass arguments by reference to modify the original",
          "Use const references for read-only parameter passing",
          "Choose between references and pointers for different use cases",
        ]),
        quiz: JSON.stringify([
          {
            question: "What must happen when a reference variable is declared?",
            options: [
              "It must be initialized to refer to an existing variable",
              "It can be left uninitialized",
              "It must be initialized to nullptr",
              "It is automatically initialized to zero",
            ],
            correctIndex: 0,
          },
          {
            question: "What happens when you modify a reference?",
            options: [
              "The original variable it refers to is modified",
              "Only the reference is modified, not the original",
              "A new variable is created",
              "Undefined behavior occurs",
            ],
            correctIndex: 0,
          },
          {
            question: "Can a reference be reassigned to refer to a different variable?",
            options: ["No", "Yes", "Only with pointers", "Only in C++20 and later"],
            correctIndex: 0,
          },
          {
            question: "What is the benefit of passing a parameter as const reference?",
            options: [
              "Avoids copying while preventing modification",
              "Makes the function run faster with no overhead",
              "Allows the parameter to be modified",
              "Creates a copy of the parameter",
            ],
            correctIndex: 0,
          },
          {
            question: "Which of the following can be null?",
            options: ["A pointer", "A reference", "Both pointers and references", "Neither pointers nor references"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-classes",
        title: "Classes",
        order: 11,
        level: "advanced",
        exerciseType: "code",
        theory: `# Classes

Classes are the foundation of object-oriented programming in C++. They allow you to bundle data (member variables) and functions (member functions or methods) together into a single unit called an object.

## Class Definition and Members

A class is defined using the \`class\` keyword followed by the class name and a body enclosed in braces:

\`\`\`cpp
class Rectangle {
private:
    double width_;
    double height_;

public:
    void setDimensions(double w, double h) {
        width_ = w;
        height_ = h;
    }

    double area() const {
        return width_ * height_;
    }
};
\`\`\`

## Access Specifiers: public and private

Access specifiers control who can access class members:

- \`private\`: Members can only be accessed from within the class itself (default for \`class\`)
- \`public\`: Members can be accessed from anywhere
- \`protected\`: Members can be accessed from the class and its derived classes

The principle of **encapsulation** dictates that member variables should generally be private, with public methods providing controlled access to the data.

## Constructors

Constructors are special member functions that are automatically called when an object is created. They have the same name as the class and no return type:

\`\`\`cpp
class Rectangle {
private:
    double width_;
    double height_;

public:
    // Default constructor
    Rectangle() : width_(0), height_(0) {}

    // Parameterized constructor
    Rectangle(double w, double h) : width_(w), height_(h) {}
};
\`\`\`

## Destructors

Destructors are called when an object is destroyed. They have the same name as the class preceded by a tilde (\`~\`) and take no parameters:

\`\`\`cpp
class ResourceHolder {
private:
    int* data_;
public:
    ResourceHolder(int size) {
        data_ = new int[size];
    }

    ~ResourceHolder() {
        delete[] data_;  // Clean up dynamically allocated memory
    }
};
\`\`\`

## Member Initializer Lists

Member initializer lists are the preferred way to initialize member variables, especially for \`const\` members, references, or members without default constructors:

\`\`\`cpp
class Point {
private:
    const int x_;
    const int y_;

public:
    // Member initializer list (colon after constructor parameters)
    Point(int x, int y) : x_(x), y_(y) {}

    // This is MORE EFFICIENT than assigning inside the body
    // because members are initialized directly rather than default-constructed then assigned
};
\`\`\`

## The this Pointer

Inside a member function, \`this\` is a pointer to the object on which the function was called. It is useful for distinguishing parameters from member variables and for method chaining:

\`\`\`cpp
class Person {
private:
    std::string name_;
public:
    Person& setName(const std::string& name) {
        this->name_ = name;  // 'this->' clarifies it's the member variable
        return *this;        // Return reference for chaining
    }

    Person& setAge(int age) {
        // this->age_ = age;
        return *this;
    }
};

// Method chaining
Person p;
p.setName("Alice").setAge(30);
\`\`\`

## const Member Functions

A \`const\` member function promises not to modify the object's state. Marking member functions \`const\` enables them to be called on \`const\` objects:

\`\`\`cpp
class Rectangle {
private:
    double width_, height_;
public:
    double area() const {   // const qualifier after parameter list
        // width_ = 0;     // Compiler error: cannot modify member
        return width_ * height_;
    }
};

void printArea(const Rectangle& rect) {
    // Can only call const member functions on rect
    std::cout << rect.area();
}
\`\`\`

The rule of thumb: any member function that does not modify the object's observable state should be marked \`const\`. This enables safe usage with const references and improves code clarity.`,
        exercisePrompt:
          "Create a class called 'BankAccount' with: (1) private members: std::string owner_ and double balance_, (2) a constructor that takes owner name and initial balance with a member initializer list, (3) const member function getBalance() returning balance, (4) member functions deposit(double amount) and withdraw(double amount) that modify balance, (5) withdraw should return false if insufficient funds, (6) a method chain pattern returning *this from deposit and withdraw. Demonstrate creating an account, depositing, withdrawing, and printing the balance.",
        starterCode: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner_;
    double balance_;

public:
    // Constructor with member initializer list

};

int main() {
    // Create account and perform operations
    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Define classes with private and public access specifiers",
          "Write constructors with member initializer lists",
          "Implement destructors for resource cleanup",
          "Use the this pointer for method chaining",
          "Mark member functions as const for const-correctness",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the default access level for members of a class?",
            options: ["private", "public", "protected", "static"],
            correctIndex: 0,
          },
          {
            question: "What is a member initializer list?",
            options: [
              "A colon-separated list after the constructor parameters that initializes members",
              "A list of class members in the header file",
              "A list of all public methods",
              "An array of member values",
            ],
            correctIndex: 0,
          },
          {
            question: "What does a const member function guarantee?",
            options: [
              "It will not modify the object's state",
              "It will return a const value",
              "It can only be called at compile time",
              "It cannot have parameters",
            ],
            correctIndex: 0,
          },
          {
            question: "What is the purpose of a destructor?",
            options: [
              "To clean up resources when an object is destroyed",
              "To create an object",
              "To copy an object",
              "To display object information",
            ],
            correctIndex: 0,
          },
          {
            question: "What does 'this' pointer refer to inside a member function?",
            options: [
              "The object on which the member function was called",
              "The class itself",
              "The parent class",
              "The global scope",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-oop",
        title: "OOP in C++",
        order: 12,
        level: "advanced",
        exerciseType: "code",
        theory: `# OOP in C++

Object-Oriented Programming (OOP) is a programming paradigm centered around objects rather than functions. C++ supports all four pillars of OOP: encapsulation, inheritance, polymorphism, and abstraction.

## Inheritance

Inheritance allows a class (derived class) to inherit members from another class (base class). C++ supports three inheritance access specifiers:

\`\`\`cpp
class Animal {
protected:
    std::string name_;
public:
    Animal(const std::string& name) : name_(name) {}
    virtual void speak() const {
        std::cout << name_ << " makes a sound" << std::endl;
    }
    virtual ~Animal() = default;
};

// Public inheritance: public members stay public
class Dog : public Animal {
public:
    Dog(const std::string& name) : Animal(name) {}
    void speak() const override {
        std::cout << name_ << " barks: Woof!" << std::endl;
    }
};
\`\`\`

- \`public\` inheritance: public members of base remain public in derived
- \`protected\` inheritance: public and protected members become protected
- \`private\` inheritance: public and protected members become private

## Virtual Functions and Polymorphism

The \`virtual\` keyword enables **polymorphism** — the ability to call derived class functions through a base class pointer or reference. Without \`virtual\`, the base class version would always be called:

\`\`\`cpp
Animal* animals[2];
animals[0] = new Dog("Buddy");
animals[1] = new Animal("Generic");

animals[0]->speak();  // "Buddy barks: Woof!" (virtual dispatch)
animals[1]->speak();  // "Generic makes a sound"

for (auto a : animals) delete a;
\`\`\`

The \`override\` keyword (C++11) is optional but recommended — it tells the compiler to verify that the function actually overrides a virtual function from the base class, catching mistakes like signature mismatches.

## Abstract Classes (Pure Virtual Functions)

A **pure virtual function** has no implementation in the base class and makes the class abstract — you cannot instantiate it directly:

\`\`\`cpp
class Shape {
public:
    virtual double area() const = 0;  // Pure virtual function
    virtual ~Shape() = default;
};

// This is now an abstract class
// Shape s;  // Compiler error: cannot instantiate abstract class

class Circle : public Shape {
private:
    double radius_;
public:
    Circle(double r) : radius_(r) {}
    double area() const override {
        return 3.14159 * radius_ * radius_;
    }
};
\`\`\`

## Multiple Inheritance

C++ allows a class to inherit from multiple base classes. While powerful, it introduces complexity including the **diamond problem**:

\`\`\`cpp
class Printable {
public:
    virtual void print() const = 0;
};

class Serializable {
public:
    virtual void serialize() const = 0;
};

// Multiple inheritance
class Document : public Printable, public Serializable {
public:
    void print() const override { /* ... */ }
    void serialize() const override { /* ... */ }
};
\`\`\`

## Virtual Destructors

If a class has virtual functions, it should almost always have a **virtual destructor**. This ensures that the correct destructor is called when deleting a derived object through a base pointer:

\`\`\`cpp
class Base {
public:
    virtual ~Base() { std::cout << "Base destructor"; }
};

class Derived : public Base {
    ~Derived() { std::cout << "Derived destructor"; }
};

Base* ptr = new Derived();
delete ptr;  // Calls ~Derived() then ~Base() — correct!
\`\`\`

Without a virtual destructor in the base class, only the base destructor would run, potentially causing resource leaks. This is one of the most common OOP pitfalls in C++, so always remember: if a class has virtual functions, give it a virtual destructor.`,
        exercisePrompt:
          "Create a class hierarchy: (1) an abstract base class 'Shape' with a pure virtual function double area() const and a virtual destructor, (2) a 'Rectangle' class derived from Shape with width and height, (3) a 'Circle' class derived from Shape with radius, (4) both override area() and implement constructors, (5) in main, create a vector of Shape* pointers pointing to a Rectangle and a Circle, (6) loop through and print each shape's area using polymorphism.",
        starterCode: `#include <iostream>
#include <vector>

// Abstract base class Shape

int main() {
    std::vector<Shape*> shapes;

    // Add shapes

    // Delete shapes
    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Implement inheritance with public, protected, and private access",
          "Use virtual functions and the override keyword for polymorphism",
          "Create abstract classes with pure virtual functions",
          "Understand multiple inheritance and virtual destructors",
          "Apply polymorphic behavior through base class pointers",
        ]),
        quiz: JSON.stringify([
          {
            question: "What does the virtual keyword enable in C++?",
            options: [
              "Polymorphism — calling derived functions through base pointers",
              "Faster function execution",
              "Automatic memory management",
              "Multiple inheritance",
            ],
            correctIndex: 0,
          },
          {
            question: "What is a pure virtual function?",
            options: [
              "A virtual function with no implementation, making the class abstract",
              "A virtual function that is optimized by the compiler",
              "A function that cannot be overridden",
              "A function with no parameters",
            ],
            correctIndex: 0,
          },
          {
            question: "When must a base class have a virtual destructor?",
            options: [
              "When the class has any virtual functions",
              "Always — every class needs a virtual destructor",
              "Only when using multiple inheritance",
              "Only when the class has dynamically allocated memory",
            ],
            correctIndex: 0,
          },
          {
            question: "What does the override specifier do?",
            options: [
              "Tells the compiler to verify a function actually overrides a base class virtual function",
              "Creates a new virtual function",
              "Prevents a function from being overridden",
              "Marks a function as inline",
            ],
            correctIndex: 0,
          },
          {
            question: "Can you instantiate an abstract class directly?",
            options: ["No", "Yes", "Only with a default constructor", "Only in C++20"],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-memory",
        title: "Memory Management",
        order: 13,
        level: "advanced",
        exerciseType: "code",
        theory: `# Memory Management

C++ gives you fine-grained control over memory, which is both a strength and a responsibility. Understanding how memory works is crucial for writing efficient, bug-free C++ programs.

## Stack vs Heap

C++ programs use two primary memory regions:

**Stack**: Automatically managed memory where local variables live. Allocation and deallocation are instant (just moving a stack pointer). Each function call creates a stack frame that is destroyed when the function returns. Stack memory is limited (typically 1-8 MB).

**Heap**: Dynamically allocated memory that persists until explicitly freed. Allocations use \`new\` (or \`malloc\` in C). The heap is much larger than the stack but slower to allocate and deallocate.

\`\`\`cpp
void example() {
    int stackVar = 42;         // Stack: automatically managed
    int* heapVar = new int(42); // Heap: must be manually deleted
    delete heapVar;             // Free heap memory
}
\`\`\`

## new and delete

\`new\` allocates memory on the heap and calls the object's constructor. \`delete\` calls the destructor and frees the memory:

\`\`\`cpp
// Single object
int* p = new int(100);
delete p;

// Array of objects
int* arr = new int[50];
delete[] arr;  // Use delete[] for arrays!

// Custom object
MyClass* obj = new MyClass(args);
delete obj;
\`\`\`

Mismatching \`new\`/ \`delete\` with \`new[]\`/ \`delete[]\` causes undefined behavior.

## Smart Pointers (C++11)

Smart pointers automatically manage heap memory, freeing it when no longer needed. They are defined in the \`<memory>\` header.

### std::unique_ptr

Exclusive ownership — only one \`unique_ptr\` can own a resource at a time. It cannot be copied, only moved:

\`\`\`cpp
#include <memory>

std::unique_ptr<int> ptr = std::make_unique<int>(42);
// auto ptr2 = ptr;          // Error: cannot copy unique_ptr
auto ptr2 = std::move(ptr);  // Transfer ownership (ptr becomes null)

// Automatically deleted when ptr2 goes out of scope
\`\`\`

### std::shared_ptr

Shared ownership — multiple \`shared_ptr\` instances can own the same resource. The resource is freed when the last \`shared_ptr\` is destroyed. Uses **reference counting** internally:

\`\`\`cpp
std::shared_ptr<int> sptr1 = std::make_shared<int>(100);
{
    std::shared_ptr<int> sptr2 = sptr1;  // Reference count: 2
    // Both point to the same int
}  // sptr2 destroyed, count: 1
// sptr1 destroyed, count: 0 → memory freed
\`\`\`

### std::weak_ptr

A \`weak_ptr\` holds a non-owning reference to a resource managed by \`shared_ptr\`. It does not increase the reference count and is used to break circular references:

\`\`\`cpp
std::weak_ptr<int> wptr;
{
    auto sptr = std::make_shared<int>(200);
    wptr = sptr;
    // wptr.use_count() == 1
}
// sptr destroyed → wptr is expired
if (auto locked = wptr.lock()) {
    std::cout << *locked;  // Won't execute — wptr is expired
}
\`\`\`

## RAII (Resource Acquisition Is Initialization)

RAII is a core C++ idiom where resource management is tied to object lifetime. Resources (memory, file handles, mutexes, network connections) are acquired in constructors and released in destructors:

\`\`\`cpp
class FileHandler {
private:
    FILE* file_;
public:
    FileHandler(const char* filename) {
        file_ = fopen(filename, "r");
        if (!file_) throw std::runtime_error("Failed to open file");
    }
    ~FileHandler() {
        if (file_) fclose(file_);  // Guaranteed cleanup
    }
    // No copy or assignment (or implement properly)
};

void processFile() {
    FileHandler fh("data.txt");  // File opened
    // ... process ...
}  // File automatically closed when fh goes out of scope
\`\`\`

## Memory Leaks and How to Avoid Them

Memory leaks occur when allocated memory is never freed. In long-running programs, leaks accumulate and eventually exhaust available memory:

**Common causes:**
- Forgetting to call \`delete\` after \`new\`
- Losing the last pointer to allocated memory
- Circular references with \`shared_ptr\`

**Best practices to avoid leaks:**
- Prefer stack allocation whenever possible
- Use smart pointers instead of raw pointers for ownership
- Never use \`new\`/ \`delete\` directly — use \`std::make_unique\`/ \`std::make_shared\`
- Use RAII wrappers for all resources
- Run tools like Valgrind or AddressSanitizer during development

Modern C++ with smart pointers and RAII makes memory leaks a rarity rather than a constant concern. Embrace these tools and write safe, self-cleaning code.`,
        exercisePrompt:
          "Write a program that: (1) demonstrates stack vs heap by allocating an int on the stack and another on the heap with new, (2) uses std::unique_ptr<int> created with make_unique, (3) uses std::shared_ptr<int> with make_shared and demonstrates shared ownership by creating a copy, (4) uses std::weak_ptr to observe a shared_ptr without owning it, (5) creates a RAII-style class 'IntArray' that allocates an array in the constructor and deletes it in the destructor.",
        starterCode: `#include <iostream>
#include <memory>

class IntArray {
private:
    int* data_;
    int size_;
public:
    // RAII constructor

    // Destructor

};

int main() {
    // Stack vs heap

    // Smart pointers

    // RAII IntArray

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Differentiate between stack and heap memory allocation",
          "Use new/delete correctly and avoid mismatched forms",
          "Apply unique_ptr, shared_ptr, and weak_ptr for automatic memory management",
          "Understand and implement the RAII idiom",
          "Identify and prevent common memory leak scenarios",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the key difference between stack and heap memory?",
            options: [
              "Stack is automatically managed; heap must be explicitly freed",
              "Stack is slower than heap",
              "Heap is automatically managed; stack must be explicitly freed",
              "Stack has unlimited size",
            ],
            correctIndex: 0,
          },
          {
            question: "Which smart pointer enforces exclusive ownership?",
            options: ["unique_ptr", "shared_ptr", "weak_ptr", "auto_ptr"],
            correctIndex: 0,
          },
          {
            question: "What does RAII stand for?",
            options: [
              "Resource Acquisition Is Initialization",
              "Random Access Is Important",
              "Return Address Is Invalid",
              "Runtime Allocation Interface",
            ],
            correctIndex: 0,
          },
          {
            question: "What happens when the last shared_ptr to a resource is destroyed?",
            options: [
              "The managed resource is automatically deleted",
              "A memory leak occurs",
              "The resource persists until the program ends",
              "Undefined behavior",
            ],
            correctIndex: 0,
          },
          {
            question: "What is a weak_ptr used for?",
            options: [
              "Breaking circular references in shared_ptr ownership",
              "Exclusive ownership of heap memory",
              "Faster pointer arithmetic",
              "Replacing raw pointers in all scenarios",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-stl",
        title: "STL: Standard Template Library",
        order: 14,
        level: "advanced",
        exerciseType: "code",
        theory: `# STL: Standard Template Library

The Standard Template Library (STL) is a powerful set of C++ template classes for data structures and algorithms. It is a cornerstone of modern C++ programming, providing ready-to-use containers, iterators, and algorithms that are efficient, type-safe, and well-tested.

## Containers

### std::vector

A dynamic array that grows automatically. It provides O(1) amortized insertion at the end and O(1) random access:

\`\`\`cpp
#include <vector>

std::vector<int> vec = {1, 2, 3, 4, 5};
vec.push_back(6);               // Add to end: {1,2,3,4,5,6}
std::cout << vec[2];            // 3 (random access)
std::cout << vec.size();        // 6
vec.pop_back();                 // Remove last element
\`\`\`

### std::string

A powerful string class that manages character arrays automatically:

\`\`\`cpp
#include <string>

std::string s1 = "Hello";
std::string s2 = "World";
std::string s3 = s1 + " " + s2;  // "Hello World"
std::cout << s3.length();        // 11
std::cout << s3.substr(0, 5);    // "Hello"
\`\`\`

### std::map

An associative container storing key-value pairs in sorted order (typically a red-black tree). O(log n) for insert, find, and erase:

\`\`\`cpp
#include <map>

std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
ages.insert({"Charlie", 35});

for (const auto& [name, age] : ages) {
    std::cout << name << ": " << age << std::endl;
}
// Bob: 25, Charlie: 35, Alice: 30  (sorted by key)
\`\`\`

### std::set

A sorted container of unique elements. O(log n) for insert, find, and erase:

\`\`\`cpp
#include <set>

std::set<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
// Stores: {1, 2, 3, 4, 5, 6, 9} (sorted, duplicates removed)

if (numbers.find(4) != numbers.end()) {
    std::cout << "4 is in the set";
}
\`\`\`

## Iterators

Iterators provide a uniform way to traverse container elements. They are the bridge between containers and algorithms:

\`\`\`cpp
std::vector<int> vec = {10, 20, 30, 40};

// Manual iteration
for (auto it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << " ";
}

// Range-based for loop (uses iterators internally)
for (int x : vec) {
    std::cout << x << " ";
}

// Reverse iteration
for (auto it = vec.rbegin(); it != vec.rend(); ++it) {
    std::cout << *it << " ";  // 40, 30, 20, 10
}
\`\`\`

## Algorithms (\<algorithm\>)

The STL provides dozens of ready-to-use algorithms that work with any container through iterators:

\`\`\`cpp
#include <algorithm>
#include <numeric>

std::vector<int> v = {5, 2, 8, 1, 9, 3};

// Sorting
std::sort(v.begin(), v.end());            // {1, 2, 3, 5, 8, 9}

// Finding
auto it = std::find(v.begin(), v.end(), 8);
if (it != v.end()) std::cout << "Found: " << *it;

// Accumulate (sum)
int sum = std::accumulate(v.begin(), v.end(), 0);  // 28

// Count elements matching a condition
int count = std::count_if(v.begin(), v.end(), [](int x) { return x > 4; });
\`\`\`

## Lambda Expressions (C++11)

Lambdas are anonymous functions that can capture variables from their surrounding scope. They are especially useful with STL algorithms:

\`\`\`cpp
std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

// Sort in descending order with a lambda
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
});

// Filter with capture
int threshold = 4;
auto count = std::count_if(v.begin(), v.end(), [threshold](int x) {
    return x > threshold;
});

// Capture everything by reference
std::for_each(v.begin(), v.end(), [&](int& x) {
    x *= 2;
});
\`\`\`

## auto with STL

\`auto\` dramatically simplifies working with STL types that have long, complex names:

\`\`\`cpp
std::map<std::string, std::vector<int>> data;
// Without auto:
std::map<std::string, std::vector<int>>::iterator it = data.find("key");
// With auto:
auto it = data.find("key");

// Range-based for with structured binding
for (const auto& [key, values] : data) {
    for (auto val : values) {
        std::cout << key << ": " << val;
    }
}
\`\`\`

The STL is a testament to the power of generic programming in C++. Mastering its containers, iterators, and algorithms will make you a dramatically more productive and effective C++ programmer.`,
        exercisePrompt:
          "Write a program that: (1) creates a vector<int> with values {7, 2, 9, 1, 5, 3}, (2) sorts it in ascending order using std::sort, (3) uses std::find to locate the value 5, (4) uses std::accumulate to compute the sum, (5) uses a lambda with std::count_if to count elements greater than 3, (6) creates a map<string, int> with three names and ages and prints them sorted, (7) uses a range-based for loop with auto to print the vector.",
        starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <map>

int main() {
    std::vector<int> v = {7, 2, 9, 1, 5, 3};

    // Sort

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Use vector, string, map, and set containers effectively",
          "Traverse containers with iterators and range-based for loops",
          "Apply STL algorithms like sort, find, and accumulate",
          "Write lambda expressions for custom operations",
          "Use auto to simplify STL type declarations",
        ]),
        quiz: JSON.stringify([
          {
            question: "What is the time complexity of std::sort on average?",
            options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
            correctIndex: 0,
          },
          {
            question: "What is a lambda expression in C++?",
            options: [
              "An anonymous function that can capture variables from its scope",
              "A named function defined in a header file",
              "A special type of loop",
              "A macro for defining functions",
            ],
            correctIndex: 0,
          },
          {
            question: "Which container maintains sorted unique elements?",
            options: ["set", "vector", "list", "map"],
            correctIndex: 0,
          },
          {
            question: "What does std::accumulate do?",
            options: [
              "Computes the sum (or general fold) over a range",
              "Finds the maximum element",
              "Counts matching elements",
              "Sorts the container",
            ],
            correctIndex: 0,
          },
          {
            question: "What is an iterator in the STL?",
            options: [
              "An object that provides a uniform way to traverse container elements",
              "A pointer to the first element of an array",
              "A special type of for loop",
              "A function that iterates over containers",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-project",
        title: "Final Project: Grade Manager",
        order: 25,
        level: "advanced",
        exerciseType: "code",
        theory: `# Final Project: Grade Manager

This capstone project brings together everything you have learned: variables, data types, functions, arrays, pointers, references, classes, OOP, memory management, and the STL. You will build a complete console-based Grade Manager application.

## Project Overview

You will create a program that manages student grades for a class. The application will:

1. **Store student names and grades** using \`std::vector\` and a custom \`Student\` class
2. **Add new students** with their grades
3. **Remove students** by name
4. **Calculate averages** — per student and class-wide
5. **Sort students** by grade (highest to lowest)
6. **Save and load data** from a text file
7. **Use OOP principles** with proper encapsulation

## Architecture

### Student Class

The \`Student\` class encapsulates a student's data:

\`\`\`cpp
class Student {
private:
    std::string name_;
    std::vector<int> grades_;
public:
    Student(const std::string& name) : name_(name) {}
    void addGrade(int grade) { grades_.push_back(grade); }
    double getAverage() const;
    const std::string& getName() const { return name_; }
    const std::vector<int>& getGrades() const { return grades_; }
};
\`\`\`

### GradeManager Class

The \`GradeManager\` class manages the collection of students:

\`\`\`cpp
class GradeManager {
private:
    std::vector<Student> students_;
public:
    void addStudent(const std::string& name);
    bool removeStudent(const std::string& name);
    void addGrade(const std::string& name, int grade);
    void displayAll() const;
    double getClassAverage() const;
    void sortByAverage();
    void saveToFile(const std::string& filename) const;
    void loadFromFile(const std::string& filename);
};
\`\`\`

### Key Design Decisions

- **Encapsulation**: All member variables are private. Access is through public methods.
- **const correctness**: Methods that do not modify state are marked \`const\`.
- **STL containers**: Use \`std::vector\` for dynamic storage of students and grades.
- **STL algorithms**: Use \`std::sort\` with a lambda for sorting by average, \`std::find_if\` for locating students by name.
- **File I/O**: Use \`std::ifstream\` and \`std::ofstream\` for persistent storage.

### File Format

When saving to file, use a simple text format:

\`\`\`
StudentName
grade1 grade2 grade3
AnotherStudent
grade1 grade2
\`\`\`

Each student's name is on its own line, followed by a line of space-separated grades.

### Sorting with Lambda

To sort students by their average grade (highest first):

\`\`\`cpp
void GradeManager::sortByAverage() {
    std::sort(students_.begin(), students_.end(),
        [](const Student& a, const Student& b) {
            return a.getAverage() > b.getAverage();
        });
}
\`\`\`

### Main Menu Loop

The program should present an interactive menu:

\`\`\`
=== Grade Manager ===
1. Add student
2. Remove student
3. Add grade to student
4. Display all students
5. Display class average
6. Sort by average
7. Save to file
8. Load from file
9. Exit
Choose an option:
\`\`\`

### Error Handling

- Handle invalid menu choices gracefully
- Check that students exist before adding grades or removing them
- Handle file I/O failures
- Validate grade input (0-100 range)

This project challenges you to apply all the skills you have developed throughout this course. Focus on clean architecture, proper encapsulation, and robust error handling. The result will be a polished, functional application that demonstrates mastery of C++ programming.`,
        exercisePrompt:
          'Implement the complete Grade Manager application: (1) create a Student class with private name and grades, public methods for adding grades and calculating average, (2) create a GradeManager class with a vector of students, methods for add/remove/display/sort/file I/O, (3) use std::sort with a lambda to sort by average descending, (4) implement file save/load with ifstream/ofstream, (5) create an interactive menu loop, (6) handle errors: invalid input, student not found, file errors, grade validation (0-100). Make sure the program compiles and runs.',
        starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <fstream>
#include <sstream>
#include <limits>

class Student {
private:
    std::string name_;
    std::vector<int> grades_;

public:
    Student(const std::string& name) : name_(name) {}

    void addGrade(int grade) {
        if (grade >= 0 && grade <= 100) {
            grades_.push_back(grade);
        }
    }

    double getAverage() const {
        if (grades_.empty()) return 0.0;
        double sum = std::accumulate(grades_.begin(), grades_.end(), 0.0);
        return sum / grades_.size();
    }

    const std::string& getName() const { return name_; }
    const std::vector<int>& getGrades() const { return grades_; }
};

class GradeManager {
private:
    std::vector<Student> students_;

public:
    void addStudent(const std::string& name);
    bool removeStudent(const std::string& name);
    void addGrade(const std::string& name, int grade);
    void displayAll() const;
    double getClassAverage() const;
    void sortByAverage();
    void saveToFile(const std::string& filename) const;
    void loadFromFile(const std::string& filename);
};

// Implement GradeManager methods here

int main() {
    GradeManager manager;
    int choice;

    do {
        std::cout << "\\n=== Grade Manager ===\\n";
        std::cout << "1. Add student\\n";
        std::cout << "2. Remove student\\n";
        std::cout << "3. Add grade\\n";
        std::cout << "4. Display all\\n";
        std::cout << "5. Class average\\n";
        std::cout << "6. Sort by average\\n";
        std::cout << "7. Save to file\\n";
        std::cout << "8. Load from file\\n";
        std::cout << "9. Exit\\n";
        std::cout << "Choice: ";
        std::cin >> choice;

        switch (choice) {
            // Handle each case
        }
    } while (choice != 9);

    return 0;
}
`,
        language: "cpp",
        learningObjectives: JSON.stringify([
          "Build a complete application using classes and OOP principles",
          "Use STL containers (vector) and algorithms (sort, find_if, accumulate)",
          "Implement file I/O for persistent data storage",
          "Handle user input errors and edge cases gracefully",
          "Apply const correctness, encapsulation, and RAII in a real project",
        ]),
        quiz: JSON.stringify([
          {
            question: "Why is encapsulation important in the Grade Manager?",
            options: [
              "It protects student data from being modified in unintended ways",
              "It makes the code run faster",
              "It reduces the file size of the program",
              "It allows multiple inheritance",
            ],
            correctIndex: 0,
          },
          {
            question: "Which STL algorithm sorts the students by average?",
            options: ["std::sort with a custom lambda", "std::find_if", "std::accumulate", "std::for_each"],
            correctIndex: 0,
          },
          {
            question: "What file stream class is used for reading data from a file?",
            options: ["std::ifstream", "std::ofstream", "std::fstream", "std::stringstream"],
            correctIndex: 0,
          },
          {
            question: "Why should grade input be validated (0-100)?",
            options: [
              "To ensure data integrity and prevent invalid values from corrupting calculations",
              "Because the compiler requires it",
              "To make the program faster",
              "To reduce memory usage",
            ],
            correctIndex: 0,
          },
          {
            question: "What happens if a student is not found when trying to remove them?",
            options: [
              "The method should return false or display an error message",
              "The program crashes",
              "A new student is created automatically",
              "The file is deleted",
            ],
            correctIndex: 0,
          },
        ]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-strings",
        title: "Strings (std::string)",
        order: 15,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Strings (std::string)

C inherited fixed-size character arrays (\`char[]\`), but modern C++ gives you \`std::string\` — a safe, dynamic, feature-rich string type from the \`<string>\` header.

## Creating and Joining

\`\`\`cpp
#include <iostream>
#include <string>

int main() {
    std::string first = "Ada";
    std::string last = "Lovelace";
    std::string full = first + " " + last;  // concatenation with +
    std::cout << full << "\\n";              // Ada Lovelace
    std::cout << full.length() << "\\n";     // 12
}
\`\`\`

Unlike C strings, \`std::string\` grows automatically and tracks its own length — no manual memory or null-terminator bookkeeping.

## Accessing and Modifying

\`\`\`cpp
std::string s = "hello";
char c = s[0];          // 'h'  (index access)
s[0] = 'H';             // strings are mutable: "Hello"
s += " world";          // append
\`\`\`

## Useful Members

\`\`\`cpp
s.length();             // or s.size()
s.substr(0, 3);         // first 3 characters
s.find("wor");          // index of substring, or std::string::npos
s.empty();              // true if length is 0
\`\`\`

## Reading Input

\`std::cin >> word\` reads a single whitespace-delimited word. To read an entire line including spaces, use \`std::getline\`:

\`\`\`cpp
std::string line;
std::getline(std::cin, line);
\`\`\`

\`std::string\` makes text handling in C++ nearly as convenient as in higher-level languages, while staying fast.`,
        exercisePrompt: "Declare two std::string variables for a first and last name. Concatenate them with a space into a full name, then print the full name and its length using .length().",
        starterCode: `#include <iostream>
#include <string>

int main() {
    std::string first = "Grace";
    std::string last = "Hopper";

    // 1. Combine into full name with a space

    // 2. Print full name and its length

    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Use std::string from the <string> header","Concatenate strings with +","Access and modify characters by index","Call members like length, substr, and find","Read whole lines with std::getline"]),
        quiz: JSON.stringify([{"question":"Which header provides std::string?","options":["<cstring>","<string>","<iostream>","<text>"],"correctIndex":1},{"question":"How do you join two std::strings?","options":["With the . operator","With the + operator","With join()","With <<"],"correctIndex":1},{"question":"Which member returns the number of characters?","options":["count()","length()","chars()","total()"],"correctIndex":1},{"question":"How do you read a whole line including spaces?","options":["std::cin >> line","std::getline(std::cin, line)","std::read(line)","cin.line()"],"correctIndex":1},{"question":"Compared to C char arrays, std::string...","options":["Has a fixed size","Grows automatically and tracks its length","Cannot be modified","Is slower to index"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-structs",
        title: "Structs",
        order: 16,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Structs

A \`struct\` groups related variables into a single custom type. It is the foundation for modeling real-world entities and a stepping stone to classes.

## Defining and Using a Struct

\`\`\`cpp
#include <iostream>
#include <string>

struct Point {
    int x;
    int y;
};

int main() {
    Point p;          // create a Point
    p.x = 3;          // set members with the dot operator
    p.y = 5;
    std::cout << p.x << ", " << p.y << "\\n";  // 3, 5
}
\`\`\`

## Initializing Concisely

You can initialize all members at once with braces:

\`\`\`cpp
Point p = {3, 5};     // x = 3, y = 5
\`\`\`

## Structs with Different Types

Members can be any type, including strings and other structs:

\`\`\`cpp
struct Player {
    std::string name;
    int score;
    bool active;
};

Player p = {"Neo", 100, true};
std::cout << p.name << ": " << p.score << "\\n";
\`\`\`

## Structs as Function Parameters

Pass a struct by **reference** (\`&\`) to avoid copying large objects:

\`\`\`cpp
void printPlayer(const Player& p) {
    std::cout << p.name << "\\n";
}
\`\`\`

In C++, a \`struct\` is actually almost identical to a \`class\` — the only difference is that struct members are \`public\` by default. Use structs for simple data bundles and classes when you need encapsulation and behavior.`,
        exercisePrompt: "Define a struct called Book with members title (std::string), pages (int), and a bool 'read'. Create a Book, fill in its members, and print a one-line summary.",
        starterCode: `#include <iostream>
#include <string>

// 1. Define the Book struct

int main() {
    // 2. Create a Book and set its members

    // 3. Print a summary line

    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Define a struct to group related data","Access members with the dot operator","Use brace initialization","Combine multiple member types in one struct","Pass structs by const reference to avoid copies"]),
        quiz: JSON.stringify([{"question":"What does a struct do?","options":["Repeats code","Groups related variables into one type","Allocates the heap","Imports a library"],"correctIndex":1},{"question":"Which operator accesses a struct member?","options":["->","The dot (.)","::","#"],"correctIndex":1},{"question":"How can you initialize Point with x=1, y=2?","options":["Point p(1, 2);","Point p = {1, 2};","Point p = 1, 2;","Point p << 1 << 2;"],"correctIndex":1},{"question":"By default, struct members are...","options":["private","public","protected","hidden"],"correctIndex":1},{"question":"Why pass a large struct by const reference?","options":["To modify it","To avoid copying it","It is required","To make it global"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-enums",
        title: "Enumerations",
        order: 17,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Enumerations

An enum (enumeration) defines a type with a fixed set of named values. Instead of remembering that 0 means "Red" and 1 means "Green," you give the values readable names.

## Scoped Enums (enum class)

Modern C++ prefers \`enum class\`, which keeps names scoped and type-safe:

\`\`\`cpp
#include <iostream>

enum class Color { Red, Green, Blue };

int main() {
    Color c = Color::Green;

    if (c == Color::Green) {
        std::cout << "Go!\\n";
    }
}
\`\`\`

You must qualify values with the enum name (\`Color::Green\`), which prevents naming clashes between different enums.

## Why Use Enums?

Compare these two function calls:

\`\`\`cpp
setState(2);              // what does 2 mean?
setState(State::Paused);  // crystal clear
\`\`\`

Enums make code self-documenting and let the compiler catch invalid values.

## Underlying Values

Each enumerator has an integer value, starting at 0 by default. You can set them explicitly:

\`\`\`cpp
enum class Level { Low = 1, Medium = 5, High = 10 };
\`\`\`

To read the number, cast it:

\`\`\`cpp
int n = static_cast<int>(Level::High);  // 10
\`\`\`

Use enums whenever a variable should hold one of a small, known set of options — states, categories, directions, days of the week.`,
        exercisePrompt: "Define an enum class Direction with North, East, South, West. Create a variable set to East, and use a switch or if statement to print the chosen direction's name.",
        starterCode: `#include <iostream>

// 1. Define enum class Direction

int main() {
    // 2. Create a Direction variable set to East

    // 3. Print the direction name based on its value

    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Define a type with a fixed set of named values","Use enum class for scoped, type-safe enums","Qualify enumerators with the enum name","Assign explicit underlying integer values","Convert an enum to its integer with static_cast"]),
        quiz: JSON.stringify([{"question":"What is an enum used for?","options":["Looping","A type with a fixed set of named values","Memory allocation","String formatting"],"correctIndex":1},{"question":"Which is the modern, type-safe form?","options":["enum","enum class","typedef enum","struct enum"],"correctIndex":1},{"question":"How do you refer to Green in 'enum class Color'?","options":["Green","Color.Green","Color::Green","Color->Green"],"correctIndex":2},{"question":"By default, the first enumerator has value...","options":["1","0","-1","undefined"],"correctIndex":1},{"question":"How do you get the integer value of an enum class member?","options":["int(x)","static_cast<int>(x)","x.toInt()","(int*)x"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-overloading",
        title: "Function Overloading & Default Arguments",
        order: 18,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Function Overloading & Default Arguments

C++ lets several functions share the same name as long as their parameters differ. This is **function overloading**, and it keeps related operations under one intuitive name.

## Overloading

\`\`\`cpp
#include <iostream>

int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {   // same name, different parameter types
    return a + b;
}

int main() {
    std::cout << add(2, 3) << "\\n";       // calls the int version -> 5
    std::cout << add(2.5, 1.5) << "\\n";   // calls the double version -> 4
}
\`\`\`

The compiler picks the right version by matching the **number and types** of arguments — this is resolved at compile time. Note: functions cannot be overloaded on return type alone.

## Default Arguments

You can give parameters default values, used when the caller omits them:

\`\`\`cpp
void greet(std::string name, std::string greeting = "Hello") {
    std::cout << greeting << ", " << name << "!\\n";
}

greet("Sam");              // Hello, Sam!
greet("Sam", "Welcome");   // Welcome, Sam!
\`\`\`

Default arguments must come **after** all non-default parameters. Together, overloading and defaults let one logical operation handle many call styles cleanly — a key part of writing flexible, readable C++ APIs.`,
        exercisePrompt: "Write two overloaded functions named area: one taking a single int side (square) and one taking int width and int height (rectangle). Also give the rectangle version a default height of 1. Call both and print the results.",
        starterCode: `#include <iostream>

// 1. area(int side) -> side * side

// 2. area(int width, int height = 1) -> width * height

int main() {
    std::cout << area(5) << "\\n";
    std::cout << area(4, 3) << "\\n";
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Define multiple functions with the same name (overloading)","Explain how the compiler resolves overloads by parameters","Know that return type alone cannot distinguish overloads","Provide default argument values","Place default parameters after non-default ones"]),
        quiz: JSON.stringify([{"question":"Function overloading means...","options":["A function calling itself","Multiple functions with the same name but different parameters","A function with too many lines","Returning multiple values"],"correctIndex":1},{"question":"How does the compiler choose which overload to call?","options":["Randomly","By the number and types of arguments","By the return type only","Alphabetically"],"correctIndex":1},{"question":"Can two functions be overloaded by return type alone?","options":["Yes","No","Only for int","Only in classes"],"correctIndex":1},{"question":"Where must default arguments appear?","options":["Before non-default parameters","After all non-default parameters","Anywhere","Only first"],"correctIndex":1},{"question":"Given 'void f(int a, int b = 2)', what is f(5)?","options":["Error","a=5, b=2","a=5, b=0","a=2, b=5"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-recursion",
        title: "Recursion",
        order: 19,
        level: "intermediate",
        exerciseType: "code",
        theory: `# Recursion

A recursive function **calls itself** to solve a smaller version of a problem. It needs a **base case** to stop and a **recursive case** that moves toward it.

## Classic Example: Factorial

\`\`\`cpp
#include <iostream>

int factorial(int n) {
    if (n <= 1) {            // base case
        return 1;
    }
    return n * factorial(n - 1);   // recursive case
}

int main() {
    std::cout << factorial(5) << "\\n";  // 120
}
\`\`\`

## How It Works

\`factorial(3)\` calls \`factorial(2)\`, which calls \`factorial(1)\`, which returns 1. Each call waits on the **call stack** until the deeper call returns, then multiplies on the way back up: 1 → 2 → 6.

## The Danger

Without a reachable base case, recursion never stops and overflows the stack:

\`\`\`cpp
int bad(int n) {
    return bad(n + 1);   // stack overflow — no base case
}
\`\`\`

## Recursion vs Loops

In C++, loops are often faster and use less memory than recursion because each recursive call adds a stack frame. But recursion is far clearer for **self-similar, branching problems** like traversing trees or directories. Choose recursion when it makes the structure obvious; choose loops for simple repetition.`,
        exercisePrompt: "Write a recursive function power(int base, int exp) that returns base raised to exp (so power(2, 4) is 16). Use exp == 0 returning 1 as your base case. Print power(3, 4).",
        starterCode: `#include <iostream>

int power(int base, int exp) {
    // base case: exp == 0 -> return 1
    // recursive case: base * power(base, exp - 1)
    return 0;
}

int main() {
    std::cout << power(3, 4) << "\\n";  // should print 81
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Write recursive functions with a base and recursive case","Trace how calls unfold on the call stack","Recognize and avoid stack overflow","Compare recursion with iteration in C++"]),
        quiz: JSON.stringify([{"question":"A recursive function must include a...","options":["Loop","Base case to stop recursion","Pointer","Template"],"correctIndex":1},{"question":"What does factorial(1) return in the lesson code?","options":["0","1","Error","None"],"correctIndex":1},{"question":"Missing a reachable base case causes a...","options":["Compile error","Stack overflow at runtime","Faster program","Memory leak only"],"correctIndex":1},{"question":"Each recursive call adds a...","options":["Heap allocation","Stack frame","Global variable","Thread"],"correctIndex":1},{"question":"Recursion is clearest for...","options":["Simple counting","Self-similar problems like tree traversal","Reading input","Printing once"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-inheritance",
        title: "Inheritance",
        order: 20,
        level: "advanced",
        exerciseType: "code",
        theory: `# Inheritance

Inheritance lets one class (the **derived** class) reuse and extend another (the **base** class). It models "is-a" relationships — a Dog *is an* Animal — and avoids duplicating shared code.

## Basic Inheritance

\`\`\`cpp
#include <iostream>
#include <string>

class Animal {
public:
    std::string name;
    void eat() {
        std::cout << name << " is eating\\n";
    }
};

class Dog : public Animal {   // Dog inherits from Animal
public:
    void bark() {
        std::cout << name << " says woof\\n";
    }
};

int main() {
    Dog d;
    d.name = "Rex";   // inherited member
    d.eat();          // inherited method
    d.bark();         // Dog's own method
}
\`\`\`

\`Dog\` automatically gets \`name\` and \`eat()\` from \`Animal\`, plus its own \`bark()\`.

## Access Specifiers

- \`public\` members are accessible everywhere.
- \`protected\` members are accessible in the class and its derived classes (but not outside).
- \`private\` members are accessible only within the class itself — derived classes cannot see them.

## Constructors

A derived class can call its base class constructor in an initializer list:

\`\`\`cpp
class Dog : public Animal {
public:
    Dog(std::string n) { name = n; }
};
\`\`\`

Inheritance is the backbone of object-oriented design, and it sets up **polymorphism**, which you'll learn next.`,
        exercisePrompt: "Create a base class Shape with a member 'name' and a method describe() that prints the name. Derive a class Circle from Shape that adds a method area(double r) printing 3.14 * r * r. Create a Circle, set its name, and call both methods.",
        starterCode: `#include <iostream>
#include <string>

class Shape {
public:
    std::string name;
    // add describe()
};

// derive Circle from Shape, add area(double r)

int main() {
    // create a Circle, set name, call describe() and area()
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Derive one class from another with : public Base","Reuse base-class members in a derived class","Distinguish public, protected, and private access","Add new members in the derived class","Understand inheritance as an is-a relationship"]),
        quiz: JSON.stringify([{"question":"What relationship does inheritance model?","options":["has-a","is-a","uses-a","next-to"],"correctIndex":1},{"question":"How do you derive Dog publicly from Animal?","options":["class Dog -> Animal","class Dog : public Animal","class Dog includes Animal","class Dog extends Animal"],"correctIndex":1},{"question":"Which members can a derived class access?","options":["Only public","public and protected","Only private","None"],"correctIndex":1},{"question":"In the example, where does Dog get the 'name' member?","options":["It declares it","It is inherited from Animal","From main()","From the STL"],"correctIndex":1},{"question":"private base members are accessible in derived classes?","options":["Yes","No","Only if static","Only with friend"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-polymorphism",
        title: "Polymorphism & Virtual Functions",
        order: 21,
        level: "advanced",
        exerciseType: "code",
        theory: `# Polymorphism & Virtual Functions

Polymorphism means "many forms" — the ability to treat objects of different derived types through a common base interface, with each calling its own version of a method. In C++, this is enabled by **virtual functions**.

## The Problem Without virtual

If a base pointer holds a derived object, calling a normal method runs the **base** version — not what you usually want:

\`\`\`cpp
class Animal {
public:
    void speak() { std::cout << "...\\n"; }
};
class Dog : public Animal {
public:
    void speak() { std::cout << "Woof\\n"; }
};

Animal* a = new Dog();
a->speak();   // prints "..." — the base version! Not ideal.
\`\`\`

## The Solution: virtual

Mark the base method \`virtual\`. Now the call is resolved at **runtime** based on the actual object type:

\`\`\`cpp
class Animal {
public:
    virtual void speak() { std::cout << "...\\n"; }
};
class Dog : public Animal {
public:
    void speak() override { std::cout << "Woof\\n"; }
};

Animal* a = new Dog();
a->speak();   // prints "Woof" — runtime dispatch!
\`\`\`

The \`override\` keyword tells the compiler you intend to replace a virtual method, catching typos.

## Why It Matters

You can store many shapes in one \`std::vector<Shape*>\` and call \`draw()\` on each — every object draws itself correctly. This is the heart of flexible, extensible OOP design. Base classes meant for inheritance should also declare a \`virtual\` destructor so derived objects clean up properly.`,
        exercisePrompt: "Create a base class Shape with a virtual method area() returning 0.0. Derive Square (with a side) and override area() to return side*side. Create a Shape pointer to a Square and call area() through it to confirm runtime dispatch.",
        starterCode: `#include <iostream>

class Shape {
public:
    virtual double area() { return 0.0; }
};

// derive Square with a 'side' member and override area()

int main() {
    // Shape* s = new Square(...); print s->area();
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Explain polymorphism through a common base interface","Use virtual to enable runtime method dispatch","Use override to safely replace virtual methods","Store mixed derived objects via base pointers","Know that base classes need a virtual destructor"]),
        quiz: JSON.stringify([{"question":"What does polymorphism allow?","options":["Faster loops","Treating different derived types through a common base interface","Memory savings only","Compile-time math"],"correctIndex":1},{"question":"Which keyword enables runtime dispatch?","options":["static","virtual","const","inline"],"correctIndex":1},{"question":"Without virtual, a base pointer calling speak() runs...","options":["The derived version","The base version","Both","Neither"],"correctIndex":1},{"question":"What does 'override' do?","options":["Makes a method static","Signals intent to replace a virtual method (catching typos)","Deletes the base method","Allocates memory"],"correctIndex":1},{"question":"Base classes used for inheritance should declare a virtual...","options":["constructor","destructor","variable","loop"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-templates",
        title: "Templates",
        order: 22,
        level: "advanced",
        exerciseType: "code",
        theory: `# Templates

Templates let you write code that works with **any type**, generated by the compiler on demand. They are how the STL provides containers like \`vector<int>\` and \`vector<string>\` from a single definition — this is **generic programming**.

## Function Templates

Instead of writing \`maxValue\` for int, double, and so on, write it once:

\`\`\`cpp
#include <iostream>

template <typename T>
T maxValue(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << maxValue(3, 7) << "\\n";       // int -> 7
    std::cout << maxValue(2.5, 1.5) << "\\n";   // double -> 2.5
    std::cout << maxValue('a', 'z') << "\\n";   // char -> z
}
\`\`\`

\`T\` is a placeholder type. The compiler **instantiates** a concrete version for each type you use — zero runtime cost.

## Class Templates

Whole classes can be templated. This is exactly how containers work:

\`\`\`cpp
template <typename T>
class Box {
    T value;
public:
    void set(T v) { value = v; }
    T get() { return value; }
};

Box<int> b;
b.set(42);
std::cout << b.get() << "\\n";   // 42
\`\`\`

## Why Templates Matter

Templates give you **type safety and reuse at once**: one implementation, checked by the compiler for every type, with no duplication and no performance penalty. They are a defining feature of modern C++ and the foundation of the entire STL.`,
        exercisePrompt: "Write a function template called swapValues that takes two references of any type T and swaps them. Test it by swapping two ints and printing them before and after.",
        starterCode: `#include <iostream>

// template <typename T> ... swapValues(T& a, T& b)

int main() {
    int x = 1, y = 2;
    std::cout << x << " " << y << "\\n";
    // swapValues(x, y);
    std::cout << x << " " << y << "\\n";
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Write function templates with template <typename T>","Understand compile-time instantiation per type","Create class templates like Box<T>","Connect templates to how STL containers work","Explain the type-safety and reuse benefits of generics"]),
        quiz: JSON.stringify([{"question":"What problem do templates solve?","options":["Memory leaks","Writing the same code for many types","Slow I/O","Naming variables"],"correctIndex":1},{"question":"How do you start a function template?","options":["generic <T>","template <typename T>","type T","class T"],"correctIndex":1},{"question":"When is a template turned into concrete code?","options":["At runtime","At compile time, per type used","Never","Only for int"],"correctIndex":1},{"question":"Which uses a class template?","options":["Box b;","Box<int> b;","int Box;","template Box;"],"correctIndex":1},{"question":"The STL containers (vector, map) are built using...","options":["Macros","Templates","Inheritance only","Pointers only"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-exceptions",
        title: "Exception Handling",
        order: 23,
        level: "advanced",
        exerciseType: "code",
        theory: `# Exception Handling

When something goes wrong at runtime — invalid input, a failed allocation, a missing file — C++ uses **exceptions** to separate error handling from normal logic.

## try, throw, catch

\`\`\`cpp
#include <iostream>
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division by zero");
    }
    return a / b;
}

int main() {
    try {
        std::cout << divide(10, 0) << "\\n";
    } catch (const std::runtime_error& e) {
        std::cout << "Error: " << e.what() << "\\n";
    }
}
\`\`\`

- \`throw\` raises an exception, immediately leaving the current function.
- \`try\` wraps code that might throw.
- \`catch\` handles a thrown exception; \`e.what()\` returns its message.

## Standard Exception Types

The \`<stdexcept>\` header defines useful types, all derived from \`std::exception\`:

\`\`\`cpp
std::runtime_error    // errors detected at runtime
std::invalid_argument // a bad argument value
std::out_of_range     // index out of bounds
\`\`\`

## Catching by Reference

Always catch exceptions **by const reference** (\`const std::exception& e\`) to avoid copying and to catch derived types correctly. A single \`catch (const std::exception& e)\` handles any standard exception.

Exceptions let functions report failures without polluting return values, and let callers decide how to recover — cleanly separating the "happy path" from error handling.`,
        exercisePrompt: "Write a function getAge(int value) that throws std::invalid_argument if value is negative, otherwise returns value. In main, call it inside a try/catch with a negative number and print the caught error message.",
        starterCode: `#include <iostream>
#include <stdexcept>

int getAge(int value) {
    // throw std::invalid_argument if value < 0, else return value
    return value;
}

int main() {
    try {
        // call getAge(-5)
    } catch (const std::exception& e) {
        // print e.what()
    }
    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Raise errors with throw","Wrap risky code in try and handle it with catch","Read an exception message via e.what()","Use standard exception types from <stdexcept>","Catch exceptions by const reference"]),
        quiz: JSON.stringify([{"question":"Which keyword raises an exception?","options":["raise","throw","error","panic"],"correctIndex":1},{"question":"Code that might fail goes inside a...","options":["catch block","try block","throw block","for block"],"correctIndex":1},{"question":"What does e.what() return?","options":["The error code number","The exception's message","The line number","Nothing"],"correctIndex":1},{"question":"Which header has std::runtime_error?","options":["<iostream>","<stdexcept>","<errors>","<string>"],"correctIndex":1},{"question":"How should you catch exceptions?","options":["By value","By const reference","By pointer always","You cannot catch them"],"correctIndex":1}]),
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        slug: "cpp-smart-pointers",
        title: "Smart Pointers",
        order: 24,
        level: "advanced",
        exerciseType: "code",
        theory: `# Smart Pointers

Raw pointers with \`new\`/\`delete\` are error-prone: forget to \`delete\` and you leak memory; delete twice and you crash. Modern C++ solves this with **smart pointers** from \`<memory>\` that free memory automatically.

## unique_ptr — Sole Ownership

A \`std::unique_ptr\` owns its object exclusively and deletes it automatically when it goes out of scope:

\`\`\`cpp
#include <iostream>
#include <memory>

struct Player { std::string name; };

int main() {
    std::unique_ptr<Player> p = std::make_unique<Player>();
    p->name = "Neo";
    std::cout << p->name << "\\n";
}   // memory freed automatically here — no delete needed
\`\`\`

A \`unique_ptr\` cannot be copied (that would create two owners), only **moved**.

## shared_ptr — Shared Ownership

When multiple parts of a program need to share an object, \`std::shared_ptr\` keeps a **reference count** and frees the object only when the last owner is gone:

\`\`\`cpp
auto a = std::make_shared<Player>();
auto b = a;            // both share ownership; count is now 2
\`\`\`

## RAII: The Big Idea

Smart pointers embody **RAII** (Resource Acquisition Is Initialization): a resource is tied to an object's lifetime, so cleanup happens automatically when the object is destroyed. Prefer \`make_unique\` and \`make_shared\`, and reach for raw \`new\`/\`delete\` almost never in modern C++. This eliminates the most common source of C++ bugs: manual memory management.`,
        exercisePrompt: "Use std::make_unique to create a unique_ptr to an int initialized to 42, print its value through the pointer, then explain (in a comment) why you do not need to call delete.",
        starterCode: `#include <iostream>
#include <memory>

int main() {
    // 1. Create a unique_ptr<int> to 42 with make_unique

    // 2. Print its value with *ptr

    // 3. Comment: why no delete is needed

    return 0;
}`,
        language: "cpp",
        learningObjectives: JSON.stringify(["Explain the dangers of raw new/delete","Use unique_ptr for exclusive, auto-freed ownership","Use shared_ptr for reference-counted shared ownership","Prefer make_unique and make_shared","Describe RAII and automatic cleanup"]),
        quiz: JSON.stringify([{"question":"What problem do smart pointers solve?","options":["Slow loops","Manual memory management bugs (leaks, double-free)","String formatting","Compile errors"],"correctIndex":1},{"question":"Which header provides smart pointers?","options":["<memory>","<pointer>","<smart>","<new>"],"correctIndex":0},{"question":"A unique_ptr represents...","options":["Shared ownership","Exclusive (sole) ownership","No ownership","A raw pointer"],"correctIndex":1},{"question":"shared_ptr frees its object when...","options":["The program starts","The last owner is gone (count hits 0)","You call new","Immediately"],"correctIndex":1},{"question":"RAII ties a resource's cleanup to...","options":["A global flag","An object's lifetime","Manual delete calls","The compiler version"],"correctIndex":1}]),
      },
    }),
  ]);
}
