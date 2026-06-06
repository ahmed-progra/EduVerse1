import { PrismaClient } from "@prisma/client";

export async function seedPythonCourse(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { slug: "python-basics" },
    update: {},
    create: {
      slug: "python-basics",
      title: "Python Basics",
      description: "Learn Python from scratch — the most beginner-friendly programming language. Master variables, functions, OOP, and build real automation tools.",
      language: "python",
      icon: "\u{1F40D}",
      order: 3,
      published: true,
    },
  });

  await prisma.lesson.deleteMany({ where: { courseId: course.id } });

  await prisma.$transaction(async (tx) => {
    for (const lesson of lessons) {
      await tx.lesson.create({
        data: { ...lesson, courseId: course.id },
      });
    }
  });

  return course;
}

interface LessonInput {
  slug: string;
  title: string;
  order: number;
  level: string;
  exerciseType: string;
  theory: string;
  exercisePrompt: string;
  starterCode: string;
  language: string;
  learningObjectives: string;
  quiz: string;
}

const lessons: Omit<LessonInput, "courseId">[] = [
  {
    slug: "py-introduction",
    title: "Introduction to Python",
    order: 1,
    level: "beginner",
    exerciseType: "code",
    theory: `# Introduction to Python

Welcome to Python, one of the most popular and beginner-friendly programming languages in the world. Python was created by Guido van Rossum and first released in 1991. Its design philosophy emphasizes code readability and simplicity, making it an excellent choice for newcomers to programming.

## Why Learn Python?

Python is everywhere. It powers web applications (Django, Flask), drives data science and machine learning (NumPy, Pandas, TensorFlow), automates repetitive tasks, and even runs on NASA's Mars rovers. Companies like Google, Netflix, and Spotify use Python extensively. The language consistently ranks among the top three most popular programming languages globally.

What makes Python special is its clean syntax. Python code reads almost like plain English. Instead of curly braces and semicolons, Python uses indentation to define blocks of code. This forces you to write clean, readable code from day one.

## Installing Python

Before writing Python code, you need to install it. Visit python.org and download the latest version for your operating system. During installation on Windows, check "Add Python to PATH" — this lets you run Python from the command line. On macOS, you can use Homebrew with \`brew install python3\`. Linux users typically have Python pre-installed; verify with \`python3 --version\`.

After installation, open a terminal or command prompt and type \`python\` (or \`python3\` on macOS/Linux). You should see the Python REPL prompt (\`>>>\`) appear.

## The Python REPL

REPL stands for Read-Eval-Print-Loop. It is an interactive environment where you type Python code and see results immediately. Think of it as a playground where you can experiment without creating files. Try typing \`2 + 2\` and pressing Enter. Python instantly responds with \`4\`. Type \`print("Hello, World!")\` and watch it output the text.

## Your First Python Program

While the REPL is great for testing small snippets, real programs live in files. Create a file named \`hello.py\` and add the following line:

\`\`\`python
print("Hello, World!")
\`\`\`

Save the file, then run it in the terminal: \`python hello.py\`. Congratulations — you have written and executed your first Python program!

## The print() Function

\`print()\` is one of Python's built-in functions. It outputs text to the console. You can print multiple items by separating them with commas:

\`\`\`python
print("Hello", "World", 2026)
\`\`\`

Python automatically adds a space between items. You can change the separator with the \`sep\` parameter and the line ending with the \`end\` parameter:

\`\`\`python
print("apple", "banana", "cherry", sep=", ")
print("Loading", end="...")
\`\`\`

## Comments

Comments are notes in your code that Python ignores. They start with \`#\` and extend to the end of the line:

\`\`\`python
# This is a comment
print("Hello")  # This is also a comment
\`\`\`

Comments help you document your code for yourself and others. Use them to explain why you did something, not what you did — the code itself should show what it does.

## Python's Philosophy

Python follows a set of guiding principles called "The Zen of Python," which you can read by typing \`import this\` in the REPL. Key principles include: "Simple is better than complex," "Readability counts," and "There should be one — and preferably only one — obvious way to do it." These principles guide Python's design and should guide your coding style too.`,
    exercisePrompt: "Write a Python program that prints your name, your age, and your favorite hobby on three separate lines using the print() function. Then add comments explaining what each line does.",
    starterCode: `# My first Python program
# Add your code below

print("")  # Print your name
print("")  # Print your age
print("")  # Print your favorite hobby`,
    language: "python",
    learningObjectives: JSON.stringify(["Explain what Python is and why it is widely used","Use the Python REPL for interactive coding","Write and run a Python script file","Use the print() function with multiple arguments","Add comments to Python code"]),
    quiz: JSON.stringify([{"question":"Who created Python?","options":["Guido van Rossum","Dennis Ritchie","Bjarne Stroustrup","James Gosling"],"correctIndex":0},{"question":"What does REPL stand for?","options":["Read-Execute-Parse-Loop","Read-Eval-Print-Loop","Run-Eval-Parse-Load","Read-Execute-Print-Load"],"correctIndex":1},{"question":"How do you add a comment in Python?","options":["// comment","/* comment */","# comment","<!-- comment -->"],"correctIndex":2},{"question":"What does the print() function do?","options":["Reads user input","Outputs text to the console","Creates a new file","Defines a variable"],"correctIndex":1},{"question":"Which symbol separates items in a print() function?","options":["Semicolon","Plus sign","Comma","Colon"],"correctIndex":2}]),
  },
  {
    slug: "py-variables",
    title: "Variables",
    order: 2,
    level: "beginner",
    exerciseType: "code",
    theory: `# Variables

Variables are containers for storing data in your program. In Python, variables are created the moment you assign a value to them — no declaration needed. This makes Python incredibly flexible and quick to work with.

## Dynamic Typing

Python is dynamically typed, meaning you do not have to declare what type of data a variable will hold. The interpreter figures it out automatically:

\`\`\`python
name = "Alice"       # Python knows this is a string
age = 25             # Python knows this is an integer
price = 19.99        # Python knows this is a float
is_active = True     # Python knows this is a boolean
\`\`\`

You can even change the type of a variable by reassigning it:

\`\`\`python
value = 42           # value is an int
value = "forty-two"  # now value is a str
\`\`\`

While this flexibility is powerful, it means you must be careful — changing a variable's type unexpectedly can lead to bugs.

## Naming Rules

Python has clear rules for variable names:

- Must start with a letter (a-z, A-Z) or underscore (\`_\`)
- Remaining characters can be letters, digits, or underscores
- Cannot be a reserved keyword (like \`if\`, \`for\`, \`while\`, \`class\`, etc.)
- Case-sensitive: \`name\`, \`Name\`, and \`NAME\` are three different variables

\`\`\`python
# Valid names
user_name = "Bob"
_user_id = 42
firstName = "Charlie"
data2 = [1, 2, 3]

# Invalid names
2nd_place = "Dave"   # Cannot start with a digit
my-var = 10          # Hyphens are not allowed
class = "math"       # 'class' is a reserved keyword
\`\`\`

By convention, Python uses \`snake_case\` for variable names — lowercase with underscores between words (\`user_age\`, \`total_price\`). This is not enforced by the language but is the standard in the Python community.

## Reassignment and Multiple Assignment

Variables change their values through reassignment:

\`\`\`python
score = 10
score = score + 5    # score is now 15
score += 5           # shorthand: score is now 20
\`\`\`

Python also supports multiple assignment — assigning values to multiple variables in one line:

\`\`\`python
x, y, z = 1, 2, 3
a = b = c = 0        # all three are 0
\`\`\`

You can also swap variables elegantly:

\`\`\`python
a, b = 5, 10
a, b = b, a          # a is now 10, b is now 5
\`\`\`

## Constants Convention

Python does not have true constants, but by convention, variables that should not change are written in UPPER_CASE:

\`\`\`python
PI = 3.14159
MAX_USERS = 1000
DEFAULT_COLOR = "blue"
\`\`\`

This is a convention only — nothing prevents you from changing these values, but other developers will know they are meant to stay constant.

## f-strings Basics

Python 3.6 introduced f-strings, the most readable way to combine text with variables:

\`\`\`python
name = "Alice"
age = 25
message = f"My name is {name} and I am {age} years old."
print(message)  # My name is Alice and I am 25 years old.
\`\`\`

The \`f\` before the opening quote tells Python to interpolate expressions inside curly braces. You can put any valid expression inside the braces:

\`\`\`python
print(f"Next year I will be {age + 1}.")
print(f"Pi rounded: {round(3.14159, 2)}")
\`\`\`

f-strings are faster and more readable than older formatting methods like \`%\` formatting or \`.format()\`. Use them whenever you need to include variables in strings.`,
    exercisePrompt: "Create variables to store your name, age, height (in meters), and whether you are a student (boolean). Then use an f-string to print a sentence that introduces yourself using all these variables. Finally, swap your age with a friend's age using Python's multiple assignment, and print both ages.",
    starterCode: `# Create your variables below
name = ""
age = 0
height = 0.0
is_student = True

# Print an introduction using f-strings
print("")

# Swap ages
# friend_age = 30
# Add swap code here`,
    language: "python",
    learningObjectives: JSON.stringify(["Create variables with meaningful names following Python conventions","Explain dynamic typing and how it differs from static typing","Use multiple assignment and variable swapping","Write formatted strings using f-strings","Follow Python naming conventions including constants"]),
    quiz: JSON.stringify([{"question":"Which of the following is a valid Python variable name?","options":["2nd_place","my-var","user_name","class"],"correctIndex":2},{"question":"What will print(f\"{5 + 3}\") output?","options":["{5 + 3}","5 + 3","8","Error"],"correctIndex":2},{"question":"What is the result of swapping a, b = b, a?","options":["Both variables become equal","The values of a and b are exchanged","a becomes b and b becomes undefined","Syntax error"],"correctIndex":1},{"question":"What does it mean that Python is dynamically typed?","options":["Variables must be declared with a type","Variable types are determined at runtime","Python does not have data types","Types must be converted manually"],"correctIndex":1},{"question":"Which naming convention does Python use for variables?","options":["camelCase","PascalCase","snake_case","kebab-case"],"correctIndex":2}]),
  },
  {
    slug: "py-data-types",
    title: "Data Types",
    order: 3,
    level: "beginner",
    exerciseType: "code",
    theory: `# Data Types

Every value in Python has a type that determines what operations you can perform on it. Understanding data types is fundamental to writing correct and efficient Python code.

## Basic Data Types

Python has four fundamental data types you will use every day:

\`\`\`python
# int — whole numbers
age = 25
temperature = -5
big_number = 1_000_000  # underscores improve readability

# float — decimal numbers
price = 19.99
pi = 3.14159
scientific = 1.5e10    # 1.5 × 10¹⁰

# str — text
name = "Alice"
message = 'Hello'       # single quotes work too
multiline = """This is
a multiline string"""

# bool — True or False
is_active = True
is_complete = False
\`\`\`

## The type() Function

To check the type of any value or variable, use the \`type()\` function:

\`\`\`python
print(type(42))         # <class 'int'>
print(type(3.14))       # <class 'float'>
print(type("Hello"))    # <class 'str'>
print(type(True))       # <class 'bool'>
print(type(None))       # <class 'NoneType'>
\`\`\`

## Type Conversion

Often you need to convert between types. Python provides built-in functions for this:

\`\`\`python
# String to number
age_str = "25"
age_int = int(age_str)       # 25 (int)
height = float("1.75")       # 1.75 (float)

# Number to string
score = 95
score_str = str(score)       # "95" (str)

# To boolean — most values are True
bool(1)       # True
bool(0)       # False
bool("")      # False
bool("text")  # True
bool([])      # False (empty collections are False)
\`\`\`

Be careful — converting invalid strings raises errors:

\`\`\`python
int("hello")  # ValueError: invalid literal for int()
\`\`\`

## The None Type

\`None\` represents the absence of a value. It is Python's null value:

\`\`\`python
result = None          # no value yet
result = compute()     # later assigned a real value
print(result is None)  # check for None
\`\`\`

Use \`is None\` to check for \`None\`, never \`== None\`.

## String Methods

Strings have many built-in methods that make text manipulation easy:

\`\`\`python
text = "  Python Programming  "

text.lower()             # "  python programming  "
text.upper()             # "  PYTHON PROGRAMMING  "
text.strip()             # "Python Programming"
text.replace("Python", "Java")  # "  Java Programming  "
text.split()             # ["Python", "Programming"]
" ".join(["a", "b", "c"])  # "a b c"
text.startswith("Py")    # True
text.endswith("ing")     # True
text.find("Pro")         # 10 (index where found)
text.count("m")          # 2
len(text)                # 22 (includes spaces)
\`\`\`

Methods like \`.strip()\`, \`.lower()\`, and \`.replace()\` return new strings — they do not modify the original because strings are immutable in Python.

## Type Annotations (Optional)

Python 3.5+ supports optional type hints:

\`\`\`python
name: str = "Alice"
age: int = 25
height: float = 1.75
\`\`\`

These annotations are not enforced at runtime but help tools and other developers understand your code.`,
    exercisePrompt: "Create variables of different types: an integer, a float, a string, and a boolean. Convert a string containing a number into an integer and add 10 to it. Use at least 4 different string methods on a sentence you create. Finally, print the type of each variable using the type() function.",
    starterCode: `# Create variables of different types
my_int =
my_float =
my_str =
my_bool =

# Convert string to int and add 10

# Use string methods (lower, upper, strip, replace, etc.)

# Print types using type()`,
    language: "python",
    learningObjectives: JSON.stringify(["Distinguish between int, float, str, bool, and None types","Use the type() function to inspect values","Convert between types using int(), float(), str(), and bool()","Apply string methods for text manipulation","Check for None using the is operator"]),
    quiz: JSON.stringify([{"question":"What is the result of int(\"42\")?","options":["\"42\"","42","Error","42.0"],"correctIndex":1},{"question":"Which string method removes whitespace from both ends?","options":["trim()","strip()","clean()","remove()"],"correctIndex":1},{"question":"What type does bool([]) return?","options":["True","False","None","Error"],"correctIndex":1},{"question":"How should you check if a variable is None?","options":["x == None","x is None","x.equals(None)","typeof x == None"],"correctIndex":1},{"question":"What is the length of len(\"Hello\")?","options":["4","5","6","7"],"correctIndex":1}]),
  },
  {
    slug: "py-conditions",
    title: "Conditionals",
    order: 4,
    level: "beginner",
    exerciseType: "code",
    theory: `# Conditionals

Conditionals let your program make decisions. Instead of running the same code every time, you can execute different branches based on conditions — this is what makes programs intelligent.

## if Statements

The simplest conditional checks whether a condition is true:

\`\`\`python
age = 18

if age >= 18:
    print("You are an adult")
\`\`\`

Notice the colon (\`:\`) at the end of the \`if\` line and the indented block below it. Python uses indentation (typically 4 spaces) to define which statements belong to the condition. This is not optional — incorrect indentation causes errors.

## Comparison Operators

These operators compare values and return \`True\` or \`False\`:

\`\`\`python
==    # Equal to
!=    # Not equal to
>     # Greater than
<     # Less than
>=    # Greater than or equal to
<=    # Less than or equal to

x = 10
print(x == 10)  # True
print(x != 5)   # True
print(x > 20)   # False
\`\`\`

Be careful: \`=\` is assignment, \`==\` is comparison. Mixing them up is a common beginner mistake.

## if/elif/else Chains

For multiple conditions, chain \`if\`, \`elif\` (short for "else if"), and \`else\`:

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")
\`\`\`

Python checks conditions from top to bottom. The first one that evaluates to \`True\` executes its block, and the rest are skipped. The \`else\` block runs if none of the conditions match.

## Logical Operators

Combine multiple conditions with \`and\`, \`or\`, and \`not\`:

\`\`\`python
age = 25
has_license = True

# and — both must be True
if age >= 18 and has_license:
    print("You can drive")

# or — at least one must be True
if age < 12 or age > 80:
    print("Special ticket required")

# not — inverts the condition
if not has_license:
    print("You need a license to drive")
\`\`\`

Python uses short-circuit evaluation — if the first condition in an \`and\` is \`False\`, it does not evaluate the second because the result is already known.

## Truthiness and Falsiness

In Python, every value can be used in a boolean context. Values that evaluate to \`False\` are called "falsy":

\`\`\`python
# Falsy values
False
0, 0.0
"" (empty string)
None
[] (empty list)
{} (empty dict)
() (empty tuple)

# Everything else is truthy
\`\`\`

This means you can write concise checks:

\`\`\`python
name = input("Enter your name: ")
if name:              # True if name is not empty
    print(f"Hello, {name}")
else:
    print("No name entered")
\`\`\`

## The pass Statement

Sometimes you need a block that does nothing. Use \`pass\` as a placeholder:

\`\`\`python
if condition:
    pass  # TODO: handle this later
\`\`\`

Without \`pass\`, Python would raise an error for an empty block. Use it during development when you are planning your structure but have not implemented the logic yet.`,
    exercisePrompt: "Write a program that asks the user for a number and classifies it. If the number is positive and even, print 'Positive even number'. If positive and odd, print 'Positive odd number'. If negative, print 'Negative number'. If zero, print 'Zero'. Use if/elif/else with logical operators (and, or, not).",
    starterCode: `# Get input from user
number = int(input("Enter a number: "))

# Classify the number using conditionals
if number > 0 and number % 2 == 0:
    print("Positive even number")
elif:
    # Add more conditions
else:
    `,
    language: "python",
    learningObjectives: JSON.stringify(["Write if/elif/else conditional statements","Use comparison operators (==, !=, <, >, <=, >=)","Combine conditions with and/or/not","Evaluate truthiness of different values","Use pass as a placeholder in empty blocks"]),
    quiz: JSON.stringify([{"question":"What keyword starts an alternative condition in Python?","options":["elseif","elif","else if","elsif"],"correctIndex":1},{"question":"What is the result of not (10 > 5)?","options":["True","False","None","Error"],"correctIndex":1},{"question":"Which value is considered falsy in Python?","options":["\"False\"","0","1","[0]"],"correctIndex":1},{"question":"What does if name: check for?","options":["If name contains the word 'True'","If name is not empty","If name equals True","If name is defined"],"correctIndex":1},{"question":"What is the purpose of pass in Python?","options":["To exit a loop","To do nothing as a placeholder","To pass a value to a function","To skip the next iteration"],"correctIndex":1}]),
  },
  {
    slug: "py-loops",
    title: "Loops",
    order: 5,
    level: "beginner",
    exerciseType: "code",
    theory: `# Loops

Loops let you repeat code multiple times. They are essential for processing collections, automating repetitive tasks, and implementing algorithms.

## for Loops with range()

The \`for\` loop iterates over a sequence. The \`range()\` function generates sequences of numbers:

\`\`\`python
# Count from 0 to 4
for i in range(5):
    print(i)          # 0, 1, 2, 3, 4

# Count from 2 to 8 (step by 2)
for i in range(2, 9, 2):
    print(i)          # 2, 4, 6, 8

# Count backwards
for i in range(10, 0, -1):
    print(i)          # 10, 9, 8, ..., 1
\`\`\`

\`range(stop)\` generates 0 to stop-1. \`range(start, stop, step)\` gives you full control.

## Iterating Over Collections

\`for\` loops work with any iterable — strings, lists, dictionaries, and more:

\`\`\`python
# String
for char in "Python":
    print(char)       # P, y, t, h, o, n

# List
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Dictionary
person = {"name": "Alice", "age": 30}
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## while Loops

\`while\` loops run as long as a condition remains true:

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1

# Be careful — infinite loops happen when the condition never becomes False
# while True:      # runs forever
#     print("help")
\`\`\`

Always ensure the condition will eventually become false. If you write an infinite loop, press Ctrl+C to stop it.

## break and continue

\`break\` exits the loop entirely. \`continue\` skips to the next iteration:

\`\`\`python
# break — stop when we find what we want
for i in range(1, 100):
    if i % 23 == 0:
        print(f"Found: {i}")
        break

# continue — skip even numbers
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)          # 1, 3, 5, 7, 9
\`\`\`

## for...else

Python has a unique feature — the \`else\` block after a \`for\` loop runs only if the loop completed normally (no \`break\` was hit):

\`\`\`python
numbers = [1, 3, 5, 7, 9]
for n in numbers:
    if n % 2 == 0:
        print("Found even:", n)
        break
else:
    print("No even numbers found")
\`\`\`

## enumerate()

When you need both the index and the value, use \`enumerate()\`:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple, 1: banana, 2: cherry

# Start from a different number
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}. {fruit}")
# 1. apple, 2. banana, 3. cherry
\`\`\`

## Nested Loops

Loops inside loops create combinations:

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})", end=" ")
    print()
# (0,0) (0,1) (0,2)
# (1,0) (1,1) (1,2)
# (2,0) (2,1) (2,2)
\`\`\`

Nested loops multiply the work. A loop that runs 100 times inside another that runs 100 times = 10,000 iterations. Be mindful of performance.`,
    exercisePrompt: "Write a program that prints a multiplication table from 1 to 5 using nested loops. Then, create a list of numbers from 1 to 20 and use a for loop with enumerate() to print only the numbers that are divisible by 3, along with their indices. Finally, use a while loop to keep asking the user to guess a number until they get it right, with a maximum of 5 attempts.",
    starterCode: `# Multiplication table (1 to 5)
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i * j:4}", end="")
    print()

# Numbers divisible by 3 with their indices
numbers = list(range(1, 21))


# Guess the number game
secret = 7
attempts = 0
while True:
    guess = int(input("Guess the number (1-10): "))
    # Add logic here`,
    language: "python",
    learningObjectives: JSON.stringify(["Use for loops with range() to iterate sequences","Use while loops with proper exit conditions","Control loop flow with break and continue","Use the for...else pattern","Access indices with enumerate()","Build and use nested loops"]),
    quiz: JSON.stringify([{"question":"What does range(5) generate?","options":["1, 2, 3, 4, 5","0, 1, 2, 3, 4","0, 1, 2, 3, 4, 5","1, 2, 3, 4"],"correctIndex":1},{"question":"What does break do inside a loop?","options":["Skips the current iteration","Exits the loop entirely","Restarts the loop","Pauses the loop"],"correctIndex":1},{"question":"When does the else block after a for loop execute?","options":["When the loop completes without breaking","When the loop breaks","After every iteration","When the loop encounters an error"],"correctIndex":0},{"question":"What does enumerate(['a', 'b', 'c']) return?","options":["Indices only","Values only","(index, value) pairs","(value, index) pairs"],"correctIndex":2},{"question":"What happens if a while condition never becomes False?","options":["The loop runs once","The loop never runs","The loop runs infinitely","Python stops the loop automatically"],"correctIndex":2}]),
  },
  {
    slug: "py-functions",
    title: "Functions",
    order: 6,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Functions

Functions are reusable blocks of code that perform a specific task. They help you organize code, avoid repetition, and build complex programs from simple building blocks.

## Defining and Calling Functions

Use the \`def\` keyword to define a function, followed by the function name, parentheses, and a colon:

\`\`\`python
def greet():
    print("Hello, World!")

greet()  # Call the function
\`\`\`

A function should do one thing and do it well. Short, focused functions are easier to test, debug, and understand.

## Parameters vs Arguments

**Parameters** are the variables listed in the function definition. **Arguments** are the values you pass when calling the function:

\`\`\`python
def greet(name):          # name is a parameter
    print(f"Hello, {name}!")

greet("Alice")            # "Alice" is an argument
greet("Bob")              # "Bob" is an argument
\`\`\`

## return Statements

Functions can send values back to the caller using \`return\`:

\`\`\`python
def add(a, b):
    result = a + b
    return result

sum = add(5, 3)           # sum = 8
\`\`\`

A function without a \`return\` statement returns \`None\`. You can return multiple values as a tuple:

\`\`\`python
def divide(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide(17, 5)      # q=3, r=2
\`\`\`

## Default Values

Parameters can have default values, making them optional when calling:

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")            # Hello, Alice!
greet("Bob", "Hi")        # Hi, Bob!
\`\`\`

Default parameters are evaluated once at function definition time. This matters for mutable defaults like lists:

\`\`\`python
# Bad — all calls share the same list
def add_item(item, items=[]):
    items.append(item)
    return items

# Good — use None and create a new list each time
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
\`\`\`

## Keyword Arguments

You can pass arguments by name, which makes calls more readable and allows you to skip defaults:

\`\`\`python
def create_user(name, age=18, country="Unknown"):
    print(f"{name}, {age}, from {country}")

create_user("Alice")                    # Alice, 18, from Unknown
create_user("Bob", country="Canada")   # Bob, 18, from Canada
create_user(age=25, name="Charlie")    # Charlie, 25, from Unknown
\`\`\`

Positional arguments must come before keyword arguments in a function call.

## *args and **kwargs

\`*args\` captures any number of positional arguments as a tuple. \`**kwargs\` captures any number of keyword arguments as a dictionary:

\`\`\`python
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30, job="Engineer")
\`\`\`

The names \`args\` and \`kwargs\` are conventions. The important parts are the single asterisk (\`*\`) and double asterisk (\`**\`).

## Lambda Basics

Lambda functions are small, anonymous functions defined in one line:

\`\`\`python
# Regular function
def double(x):
    return x * 2

# Lambda equivalent
double = lambda x: x * 2

print(double(5))  # 10
\`\`\`

Lambdas are useful with functions like \`map()\`, \`filter()\`, and \`sorted()\`:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
\`\`\`

Keep lambdas simple — if the logic is complex, use a regular function.

## Docstrings

Document your functions with docstrings — triple-quoted strings right after the definition:

\`\`\`python
def calculate_bmi(weight: float, height: float) -> float:
    """Calculate Body Mass Index given weight (kg) and height (m)."""
    return weight / (height ** 2)
\`\`\`

Docstrings can be accessed with \`help(function_name)\` or \`function_name.__doc__\`.`,
    exercisePrompt: "Create a function called calculate_statistics that accepts any number of numbers (*args) and returns a dictionary with the sum, average, maximum, minimum, and count. Then create a lambda function that checks if a number is a perfect square, and use it with filter() on a list from 1 to 50.",
    starterCode: `def calculate_statistics(*args):
    """Calculate statistics for given numbers."""
    # Implement the function

    return {
        "sum": 0,
        "average": 0,
        "max": 0,
        "min": 0,
        "count": 0
    }

# Test the function
print(calculate_statistics(10, 20, 30, 40, 50))

# Lambda for perfect squares
is_perfect_square =

# Use with filter on numbers 1-50`,
    language: "python",
    learningObjectives: JSON.stringify(["Define functions with def and use return statements","Distinguish between parameters and arguments","Use default values and keyword arguments","Collect variable arguments with *args and **kwargs","Write lambda functions for simple operations","Document functions with docstrings"]),
    quiz: JSON.stringify([{"question":"What does a function return if it has no return statement?","options":["0","False","None","undefined"],"correctIndex":2},{"question":"What does *args capture?","options":["Keyword arguments as a dict","Positional arguments as a tuple","Only the first argument","No arguments"],"correctIndex":1},{"question":"What is a lambda function?","options":["A named function with multiple statements","An anonymous one-line function","A recursive function","A function that returns a lambda"],"correctIndex":1},{"question":"Which calling style is correct for keyword arguments?","options":["greet(\"Alice\", 25)","greet(name=\"Alice\", age=25)","greet(\"Alice\", age=25)","Both B and C"],"correctIndex":3},{"question":"Why should mutable defaults like [] be avoided?","options":["They cause syntax errors","The same list is shared across all calls","They are slower","They cannot be modified"],"correctIndex":1}]),
  },
  {
    slug: "py-lists",
    title: "Lists",
    order: 7,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Lists

Lists are ordered, mutable collections that can hold items of any type. They are one of the most versatile data structures in Python.

## Creating Lists

\`\`\`python
# Empty list
empty = []

# List with items
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]  # different types allowed
nested = [[1, 2], [3, 4]]          # lists inside lists

# Using list() constructor
chars = list("Python")             # ['P', 'y', 't', 'h', 'o', 'n']
\`\`\`

## Indexing and Slicing

Indexing accesses individual elements. Python uses zero-based indexing:

\`\`\`python
fruits = ["apple", "banana", "cherry", "date", "elderberry"]

fruits[0]    # "apple"  (first)
fruits[-1]   # "elderberry"  (last)
fruits[-2]   # "date"  (second from last)

# Slicing — [start:stop:step]
fruits[1:3]      # ["banana", "cherry"]
fruits[:3]       # ["apple", "banana", "cherry"]
fruits[2:]       # ["cherry", "date", "elderberry"]
fruits[::2]      # ["apple", "cherry", "elderberry"]
fruits[::-1]     # reverse: ["elderberry", "date", "cherry", "banana", "apple"]
\`\`\`

Slicing returns a new list and never raises an IndexError — out-of-range slices return empty lists.

## List Methods

\`\`\`python
items = [1, 2, 3]

items.append(4)          # [1, 2, 3, 4] — add to end
items.extend([5, 6])     # [1, 2, 3, 4, 5, 6] — add multiple
items.insert(0, 0)       # [0, 1, 2, 3, 4, 5, 6] — insert at index
items.remove(3)          # [0, 1, 2, 4, 5, 6] — remove first match
popped = items.pop()     # 6 — remove and return last
items.pop(0)             # 0 — remove and return at index
items.clear()            # [] — remove everything

# Searching
nums = [1, 2, 3, 2, 1]
nums.index(2)            # 1 (first occurrence)
nums.count(2)            # 2 (how many times)
\`\`\`

## List Comprehension

List comprehensions provide a concise way to create lists:

\`\`\`python
# Squares
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Nested comprehension
matrix = [[i * j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]

# With transformation
words = ["hello", "world", "python"]
upper_words = [word.upper() for word in words]
# ["HELLO", "WORLD", "PYTHON"]
\`\`\`

List comprehensions are more Pythonic and faster than manual \`for\` loops with \`.append()\`. However, if the logic is complex, a regular loop is more readable.

## Sorting

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Sort in place (modifies original)
numbers.sort()           # [1, 1, 2, 3, 4, 5, 6, 9]
numbers.sort(reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Sorted copy (keeps original)
original = [3, 1, 4]
sorted_copy = sorted(original)  # [1, 3, 4]

# Sort with key
words = ["banana", "apple", "cherry", "date"]
words.sort(key=len)      # sort by length
words.sort(key=lambda x: x[-1])  # sort by last letter
\`\`\`

## Nested Lists

Lists can contain other lists, creating matrices or grids:

\`\`\`python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Accessing
matrix[0]      # [1, 2, 3]
matrix[0][1]   # 2

# Flattening with comprehension
flat = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\`

Lists are the workhorse of Python. Mastering them unlocks efficient data processing in every Python program.`,
    exercisePrompt: "Create a list of 10 random numbers. Using list comprehension, generate a new list of only the even numbers, each squared. Then sort the original list in descending order. Remove the smallest and largest values using pop() with appropriate indices, and print the remaining list. Finally, flatten this nested list: nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]] using a list comprehension.",
    starterCode: `import random

# Create list of 10 random numbers
numbers = [random.randint(1, 100) for _ in range(10)]
print("Original:", numbers)

# List comprehension: even numbers squared
even_squares =

# Sort descending

# Remove smallest and largest (after sorting)

# Flatten nested list
nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat = `,
    language: "python",
    learningObjectives: JSON.stringify(["Create and manipulate lists using indexing and slicing","Use list methods (append, extend, insert, remove, pop)","Write list comprehensions with conditions","Sort lists with key functions","Work with nested lists and flatten them"]),
    quiz: JSON.stringify([{"question":"What does fruits[-1] return from ['a', 'b', 'c']?","options":["'a'","'b'","'c'","IndexError"],"correctIndex":2},{"question":"How do you add multiple elements to the end of a list?","options":["append()","extend()","insert()","add()"],"correctIndex":1},{"question":"What is the result of [x*2 for x in range(3)]?","options":["[0, 1, 2]","[0, 2, 4]","[2, 4, 6]","[1, 2, 3]"],"correctIndex":1},{"question":"What does numbers.sort() do?","options":["Returns a new sorted list","Sorts the list in place","Reverses the list","Removes duplicates"],"correctIndex":1},{"question":"What is the result of [1, 2, 3][::-1]?","options":["[1, 2, 3]","[3, 2, 1]","[1, 2]","Error"],"correctIndex":1}]),
  },
  {
    slug: "py-dictionaries",
    title: "Dictionaries",
    order: 8,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Dictionaries

Dictionaries store data in key-value pairs. They are Python's built-in mapping type, perfect for representing structured data, configuration, and lookup tables.

## Creating Dictionaries

\`\`\`python
# Using curly braces
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Using dict() constructor
person = dict(name="Alice", age=30, city="New York")

# Keys can be any immutable type (strings, numbers, tuples)
scores = {1: "Alice", 2: "Bob", 3: "Charlie"}
mixed = {1: "number", (1, 2): "tuple", "key": "string"}
\`\`\`

Dictionary keys must be immutable (strings, numbers, tuples). Lists and other dictionaries cannot be keys. Values can be any type.

## Accessing Values

\`\`\`python
person = {"name": "Alice", "age": 30}

# Direct access — raises KeyError if missing
print(person["name"])   # Alice

# Using get() — returns None (or default) if missing
print(person.get("age"))           # 30
print(person.get("country"))       # None
print(person.get("country", "N/A"))  # "N/A"
\`\`\`

Always use \`.get()\` when you are not sure a key exists. It prevents KeyError crashes.

## Dictionary Methods

\`\`\`python
person = {"name": "Alice", "age": 30, "city": "New York"}

# View collections
person.keys()      # dict_keys(['name', 'age', 'city'])
person.values()    # dict_values(['Alice', 30, 'New York'])
person.items()     # dict_items([('name', 'Alice'), ('age', 30), ('city', 'New York')])

# Update
person["job"] = "Engineer"          # add new key
person["age"] = 31                   # update existing
person.update({"city": "Boston", "phone": "555-0100"})  # multiple updates

# Remove
age = person.pop("age")              # remove and return value
last = person.popitem()              # remove and return last inserted (Python 3.7+)
del person["phone"]                  # delete without returning
person.clear()                       # remove everything
\`\`\`

## Iterating Dictionaries

\`\`\`python
person = {"name": "Alice", "age": 30, "city": "New York"}

# Keys only
for key in person:
    print(key)

# Keys and values
for key, value in person.items():
    print(f"{key}: {value}")

# Values only
for value in person.values():
    print(value)
\`\`\`

Since Python 3.7, dictionaries maintain insertion order. Iterating yields items in the order they were added.

## Dictionary Comprehension

Like list comprehensions, but for dictionaries:

\`\`\`python
# Squares
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Filtering
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Transforming keys/values
words = ["hello", "world", "python"]
word_lengths = {word: len(word) for word in words}
# {"hello": 5, "world": 5, "python": 6}

# Swapping keys and values
original = {"a": 1, "b": 2, "c": 3}
swapped = {value: key for key, value in original.items()}
# {1: "a", 2: "b", 3: "c"}
\`\`\`

## Nested Dictionaries

Dictionaries can contain other dictionaries, lists, or any other type:

\`\`\`python
users = {
    "alice": {
        "age": 30,
        "skills": ["Python", "JavaScript"],
        "active": True
    },
    "bob": {
        "age": 25,
        "skills": ["Java", "C++"],
        "active": False
    }
}

# Accessing nested values
print(users["alice"]["skills"][0])  # "Python"

# Safe access with get()
skill = users.get("bob", {}).get("skills", [])
\`\`\`

## defaultdict

\`collections.defaultdict\` automatically provides default values for missing keys, eliminating the need to check for key existence:

\`\`\`python
from collections import defaultdict

# Default value is an empty list
groups = defaultdict(list)
groups["fruits"].append("apple")
groups["fruits"].append("banana")
groups["veggies"].append("carrot")

print(groups)
# defaultdict(<class 'list'>, {'fruits': ['apple', 'banana'], 'veggies': ['carrot']})

# With int for counting
counter = defaultdict(int)
for letter in "mississippi":
    counter[letter] += 1
print(counter)  # defaultdict(<class 'int'>, {'m': 1, 'i': 4, 's': 4, 'p': 2})
\`\`\`

Use \`defaultdict\` when you are building collections in a loop — it saves multiple lines of key-checking boilerplate.`,
    exercisePrompt: "Create a nested dictionary representing 3 people, each with name, age, and a list of hobbies. Use a dictionary comprehension to create a mapping of names to ages for people who have more than 2 hobbies. Then use defaultdict to count the frequency of each word in the sentence: 'the quick brown fox jumps over the lazy dog the dog barks'. Finally, print the most common word.",
    starterCode: `from collections import defaultdict

# Nested dictionary of people
people = {
    # Add 3 people with name, age, and hobbies list
}

# Dictionary comprehension: name -> age for people with >2 hobbies

# defaultdict word frequency counter
sentence = "the quick brown fox jumps over the lazy dog the dog barks"
word_counts = defaultdict(int)



# Find most common word`,
    language: "python",
    learningObjectives: JSON.stringify(["Create dictionaries and access values safely with get()","Use dictionary methods (keys, values, items, update, pop)","Write dictionary comprehensions","Build and traverse nested dictionaries","Use defaultdict for automatic default values"]),
    quiz: JSON.stringify([{"question":"What happens when you access a missing key with square brackets?","options":["Returns None","Raises KeyError","Creates the key automatically","Returns an empty string"],"correctIndex":1},{"question":"How do you safely get a value that may not exist?","options":["dict.get(key, default)","dict[key] or default","dict.fetch(key)","dict.retrieve(key)"],"correctIndex":0},{"question":"What is the result of {x: x**2 for x in range(3)}?","options":["{0:0, 1:1, 2:4}","[0, 1, 4]","{0, 1, 4}","(0, 1, 4)"],"correctIndex":0},{"question":"What does defaultdict(int) do when accessing a missing key?","options":["Raises KeyError","Returns 0","Returns None","Creates an empty list"],"correctIndex":1},{"question":"Which type can be a dictionary key?","options":["List","Dictionary","Tuple","Set"],"correctIndex":2}]),
  },
  {
    slug: "py-modules",
    title: "Modules & Packages",
    order: 9,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Modules & Packages

Python's power comes from its vast ecosystem of modules and packages. Modules are Python files containing reusable code; packages are directories of modules. The Python standard library includes hundreds of modules for everything from math to web servers.

## Importing Modules

\`\`\`python
# Import the entire module
import math
print(math.pi)       # 3.141592653589793
print(math.sqrt(16)) # 4.0

# Import specific items
from random import randint, choice
print(randint(1, 10))  # random integer between 1 and 10
print(choice(["a", "b", "c"]))  # random element

# Import with alias
import datetime as dt
print(dt.date.today())

# Import all names (use sparingly)
from os import *  # pollutes the namespace
\`\`\`

Import statements should be at the top of your file, grouped in this order: standard library, third-party libraries, your own modules.

## The Standard Library

Python's standard library is famously comprehensive. Here are essential modules:

\`\`\`python
# math — mathematical functions
import math
print(math.floor(3.7))    # 3
print(math.ceil(3.2))     # 4
print(math.factorial(5))  # 120

# random — generate random values
import random
random.random()            # float between 0 and 1
random.randint(1, 100)     # integer between 1 and 100
random.choice(["a", "b"])  # random element
random.shuffle(items)      # shuffle in place

# datetime — dates and times
from datetime import datetime, timedelta
now = datetime.now()
tomorrow = now + timedelta(days=1)
formatted = now.strftime("%Y-%m-%d %H:%M:%S")

# os — operating system interface
import os
os.getcwd()         # current directory
os.listdir(".")     # list files
os.environ["PATH"]  # environment variables

# sys — system-specific parameters
import sys
print(sys.version)    # Python version
print(sys.argv)       # command line arguments
sys.exit(0)           # exit program
\`\`\`

## Installing Packages with pip

The Python Package Index (PyPI) hosts over 400,000 packages. Use \`pip\` to install them:

\`\`\`bash
pip install requests
pip install numpy pandas matplotlib
pip install flask django
pip install beautifulsoup4
\`\`\`

To install a specific version: \`pip install requests==2.31.0\`. To list installed packages: \`pip list\`. To save dependencies: \`pip freeze > requirements.txt\`.

## Creating Your Own Module

Any .py file is a module. Create \`my_utils.py\`:

\`\`\`python
# my_utils.py
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159
\`\`\`

Import it from another file:

\`\`\`python
import my_utils
print(my_utils.greet("Alice"))
print(my_utils.PI)
\`\`\`

## __name__ == '__main__'

This common pattern lets a file run as a script OR be imported as a module:

\`\`\`python
# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

if __name__ == "__main__":
    # This only runs when executed directly
    print("Testing calculator:")
    print(f"3 + 5 = {add(3, 5)}")
    print(f"10 - 4 = {subtract(10, 4)}")
\`\`\`

When you run \`python calculator.py\`, the test code runs. When you \`import calculator\` from another file, it does not. This allows modules to serve dual purposes without side effects.`,
    exercisePrompt: "Create a mini module system with two functions inside it: one that generates a random password (8-12 chars, mix of letters, digits, and symbols) using random, and another that calculates how many days until a given date using datetime. Then write the main guard (if __name__ == '__main__') that tests both functions. Use math to round pi to 5 decimal places for display.",
    starterCode: `import random
import string
from datetime import datetime
import math

def generate_password(length=10):
    """Generate a random password with letters, digits, and symbols."""
    # Use string.ascii_letters, string.digits, string.punctuation

def days_until(target_date_str):
    """Calculate days from today until a target date (format: YYYY-MM-DD)."""

if __name__ == "__main__":
    # Test your functions here
    print(f"Pi rounded: {round(math.pi, 5)}")
    print(f"Random password: {generate_password()}")
    print(f"Days until new year: {days_until('2027-01-01')}")`,
    language: "python",
    learningObjectives: JSON.stringify(["Import modules using import, from, and as syntax","Use standard library modules (math, random, datetime, os, sys)","Install third-party packages with pip","Create and import your own Python modules","Use the if __name__ == '__main__' pattern"]),
    quiz: JSON.stringify([{"question":"How do you import only the sqrt function from math?","options":["import sqrt from math","import math.sqrt","from math import sqrt","from math import *"],"correctIndex":2},{"question":"What does pip freeze do?","options":["Freezes Python execution","Lists installed packages in requirements format","Updates all packages","Uninstalls unused packages"],"correctIndex":1},{"question":"What is the purpose of if __name__ == '__main__'?","options":["It always runs when the module is imported","It only runs when the file is executed as a script","It prevents the module from being imported","It runs before any other code"],"correctIndex":1},{"question":"Which module provides mathematical functions like sqrt and factorial?","options":["maths","math","cmath","mathematics"],"correctIndex":1},{"question":"What does random.randint(1, 6) return?","options":["A random float between 1 and 6","A random integer between 1 and 6 inclusive","A random integer between 1 and 5","A random element from a list"],"correctIndex":1}]),
  },
  {
    slug: "py-file-handling",
    title: "File Handling",
    order: 10,
    level: "intermediate",
    exerciseType: "code",
    theory: `# File Handling

Reading from and writing to files is essential for data processing, logging, configuration management, and building real applications. Python provides clean, powerful tools for file operations.

## Opening and Closing Files

\`\`\`python
# Traditional approach
file = open("data.txt", "r")
content = file.read()
file.close()
\`\`\`

Always close files or they may leak resources. The \`with\` statement handles this automatically — it closes the file even if an error occurs.

## The with Statement

\`\`\`python
# Reading
with open("data.txt", "r") as file:
    content = file.read()
    print(content)

# Writing
with open("output.txt", "w") as file:
    file.write("Hello, World!")
\`\`\`

The \`with\` statement creates a context manager. When the block ends, the file is automatically closed. This is the preferred way to handle files in Python.

## File Modes

\`\`\`python
# Modes
"r"   # Read (default) — file must exist
"w"   # Write — creates new file or overwrites existing
"a"   # Append — adds to end of file
"x"   # Exclusive create — fails if file exists

# Binary modes
"rb"  # Read binary
"wb"  # Write binary
"ab"  # Append binary

# Read/Write modes
"r+"  # Read and write (file must exist)
"w+"  # Read and write (overwrites)
"a+"  # Read and append
\`\`\`

## Reading Files

\`\`\`python
with open("data.txt", "r") as file:
    # Read entire file
    content = file.read()

    # Read lines into a list
    lines = file.readlines()

    # Read one line at a time
    for line in file:
        print(line.strip())  # strip removes newline
\`\`\`

For large files, never use \`.read()\` — it loads the entire file into memory. Iterate line by line instead.

## Writing Files

\`\`\`python
# Write lines
with open("output.txt", "w") as file:
    file.write("First line\\n")
    file.write("Second line\\n")

# Write multiple lines from a list
lines = ["apple", "banana", "cherry"]
with open("fruits.txt", "w") as file:
    file.writelines(line + "\\n" for line in lines)

# Append to existing file
with open("log.txt", "a") as file:
    file.write("New log entry\\n")
\`\`\`

## Working with CSV

\`\`\`python
import csv

# Reading CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)  # each row is a list of strings

# Reading as dictionaries
with open("data.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["name"], row["age"])

# Writing CSV
with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Age", "City"])
    writer.writerow(["Alice", 30, "NYC"])
    writer.writerow(["Bob", 25, "LA"])
\`\`\`

The \`newline=""\` parameter prevents extra blank lines on Windows.

## JSON Module

\`\`\`python
import json

# Python dict to JSON string
data = {"name": "Alice", "age": 30, "skills": ["Python", "JS"]}
json_str = json.dumps(data, indent=2)
print(json_str)

# Write JSON to file
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Read JSON from file
with open("data.json", "r") as file:
    loaded = json.load(file)
    print(loaded["name"])

# JSON string to Python dict
parsed = json.loads(json_str)
\`\`\`

JSON is the most common data exchange format on the web. Python's \`json\` module makes it trivial to work with.

## pathlib

The \`pathlib\` module provides an object-oriented interface for filesystem paths:

\`\`\`python
from pathlib import Path

# Create path objects
path = Path("data/files/config.json")
folder = Path("data")

# Path properties
path.parent      # data/files
path.name        # config.json
path.stem        # config
path.suffix      # .json

# Directory operations
folder.mkdir(parents=True, exist_ok=True)
Path("new_file.txt").touch()
Path("old_file.txt").unlink()  # delete
Path("dir").rmdir()            # delete empty directory

# Globbing
for py_file in Path(".").glob("*.py"):
    print(py_file)

# Reading/writing with Path
Path("hello.txt").write_text("Hello, World!")
content = Path("hello.txt").read_text()
\`\`\`

\`pathlib\` is more readable and cross-platform than \`os.path\`. Prefer it for new code.`,
    exercisePrompt: "Create a program that writes a list of 5 students (name, grade, subject) to a CSV file, then reads it back and prints a formatted grade report. Also save the data as a JSON file using json.dump. Then use pathlib to create a 'reports' directory and move the JSON file there. For each file operation, use the with statement.",
    starterCode: `import csv
import json
from pathlib import Path

students = [
    {"name": "Alice", "grade": 92, "subject": "Math"},
    {"name": "Bob", "grade": 78, "subject": "Science"},
    {"name": "Charlie", "grade": 88, "subject": "History"},
    {"name": "Diana", "grade": 95, "subject": "Math"},
    {"name": "Eve", "grade": 70, "subject": "Art"},
]

# Write to CSV

# Read CSV and print report

# Write to JSON

# Create 'reports' dir with pathlib and move JSON there`,
    language: "python",
    learningObjectives: JSON.stringify(["Open and close files using the with statement","Read and write files in different modes (r, w, a)","Parse and create CSV files with the csv module","Serialize and deserialize JSON data","Use pathlib for cross-platform filesystem operations"]),
    quiz: JSON.stringify([{"question":"What does the 'w' mode do when opening a file?","options":["Reads the file","Writes — creates or overwrites the file","Appends to the file","Exclusive creation"],"correctIndex":1},{"question":"What is the benefit of the with statement for file handling?","options":["Makes code faster","Automatically closes the file","Prevents all errors","Encrypts the file"],"correctIndex":1},{"question":"Which json method converts a Python dict to a JSON string?","options":["json.load()","json.dump()","json.dumps()","json.loads()"],"correctIndex":2},{"question":"What does Path('file.txt').suffix return?","options":["file","file.txt",".txt","txt"],"correctIndex":2},{"question":"What is the purpose of newline='' in csv.writer?","options":["Writes each value on a new line","Prevents extra blank lines on Windows","Creates a newline-delimited format","Removes newlines from data"],"correctIndex":1}]),
  },
  {
    slug: "py-oop",
    title: "Object-Oriented Programming",
    order: 11,
    level: "advanced",
    exerciseType: "code",
    theory: `# Object-Oriented Programming

Object-Oriented Programming (OOP) is a paradigm that organizes code around objects — bundles of data and behavior. Python supports OOP fully, allowing you to create classes, inherit behavior, and encapsulate data.

## Classes and Objects

A class is a blueprint for creating objects. An object is an instance of a class:

\`\`\`python
class Dog:
    pass

# Create objects
my_dog = Dog()
your_dog = Dog()
\`\`\`

## __init__ and self

The \`__init__\` method initializes new objects. \`self\` refers to the instance being created:

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name  # instance attribute
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

my_dog = Dog("Rex", 3)
print(my_dog.name)     # Rex
print(my_dog.bark())   # Rex says Woof!
\`\`\`

\`self\` is always the first parameter of instance methods. You never pass it explicitly — Python passes it automatically.

## Attributes and Methods

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance  # public attribute

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            return "Insufficient funds"
        self.balance -= amount
        return self.balance

account = BankAccount("Alice", 1000)
account.deposit(500)     # 1500
account.withdraw(200)    # 1300
\`\`\`

## Inheritance

A class can inherit attributes and methods from another class:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass  # to be overridden

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

animals = [Dog("Rex"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())
\`\`\`

Inheritance models "is-a" relationships. A Dog is an Animal. Use it when subclasses share common behavior from a parent.

## super()

\`super()\` calls a method from the parent class. It is essential when overriding \`__init__\`:

\`\`\`python
class Vehicle:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year

class Car(Vehicle):
    def __init__(self, make, model, year, doors):
        super().__init__(make, model, year)  # call parent init
        self.doors = doors

class Motorcycle(Vehicle):
    def __init__(self, make, model, year, has_sidecar=False):
        super().__init__(make, model, year)
        self.has_sidecar = has_sidecar
\`\`\`

## Encapsulation and Name Mangling

Python uses naming conventions for access control:

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name      # public
        self._age = age       # "protected" by convention
        self.__ssn = "123-45-6789"  # name mangling

    def get_ssn(self):
        return f"***-**-{self.__ssn[-4:]}"

# Single underscore: internal use, not part of public API
# Double underscore: triggers name mangling to avoid conflicts
\`\`\`

Name mangling transforms \`__ssn\` to \`_Person__ssn\`. It does not make the attribute private, but it prevents accidental access from outside.

## @property Decorators

The \`@property\` decorator lets you define methods that look like attributes:

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

temp = Temperature(25)
print(temp.fahrenheit)  # 77.0 — looks like an attribute
temp.celsius = 30       # uses the setter
\`\`\`

Properties let you add logic to attribute access without breaking the interface.

## __str__ and __repr__

These special methods control string representations:

\`\`\`python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"'{self.title}' by {self.author}"

    def __repr__(self):
        return f"Book('{self.title}', '{self.author}')"

book = Book("1984", "George Orwell")
print(str(book))   # '1984' by George Orwell
print(repr(book))  # Book('1984', 'George Orwell')
\`\`\`

\`__str__\` is for users (readable). \`__repr__\` is for developers (unambiguous, ideally recreates the object).`,
    exercisePrompt: "Create a Library system with classes. Book has title, author, and is_checked_out. Member has name and member_id, and a list of checked-out books. The Library class manages the collection: add_book(), check_out_book(member, book_title), return_book(member, book_title). Use @property for book availability status, __str__ for readable output, and __repr__ for debugging. Implement a PremiumMember subclass that has a bonus of being able to check out 10 books instead of 5.",
    starterCode: `class Book:
    def __init__(self, title, author):
        pass

    @property
    def available(self):
        pass

    def __str__(self):
        pass

class Member:
    MAX_BOOKS = 5

    def __init__(self, name, member_id):
        pass

class PremiumMember(Member):
    MAX_BOOKS = 10

class Library:
    def __init__(self):
        self.books = []
        self.members = []

    def add_book(self, book):
        pass

    def check_out_book(self, member, title):
        pass

    def return_book(self, member, title):
        pass

# Test your library
library = Library()
library.add_book(Book("1984", "George Orwell"))
library.add_book(Book("To Kill a Mockingbird", "Harper Lee"))
alice = PremiumMember("Alice", "M001")
library.check_out_book(alice, "1984")
print(alice.checked_out_books)`,
    language: "python",
    learningObjectives: JSON.stringify(["Define classes with __init__ and instance methods","Use inheritance to extend class behavior","Call parent methods with super()","Use @property for computed attributes","Implement __str__ and __repr__ for string representations"]),
    quiz: JSON.stringify([{"question":"What does self refer to in a Python class method?","options":["The class itself","The current instance of the class","The parent class","None"],"correctIndex":1},{"question":"What is the purpose of super()?","options":["To create a new instance","To call a method from the parent class","To delete an instance","To increase the object's priority"],"correctIndex":1},{"question":"What does @property do?","options":["Makes a method private","Allows a method to be accessed like an attribute","Creates a class method","Defines a static method"],"correctIndex":1},{"question":"What is the difference between __str__ and __repr__?","options":["__str__ is for developers, __repr__ for users","__str__ is for users, __repr__ for developers","They are identical","__str__ is private, __repr__ is public"],"correctIndex":1},{"question":"What does double underscore __name do for an attribute?","options":["Makes it private","Triggers name mangling","Makes it a class variable","Prevents inheritance"],"correctIndex":1}]),
  },
  {
    slug: "py-error-handling",
    title: "Error Handling",
    order: 12,
    level: "advanced",
    exerciseType: "code",
    theory: `# Error Handling

Errors happen. Network requests fail, files are missing, user input is invalid. Robust programs anticipate and handle errors gracefully instead of crashing.

## try/except Blocks

The \`try\` block contains code that might raise an exception. The \`except\` block handles it:

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except:
    print("Something went wrong!")
\`\`\`

Bare \`except:\` catches everything, which is usually too broad. Always catch specific exceptions.

## Catching Specific Exceptions

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("That is not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except (TypeError, OverflowError) as e:
    print(f"Another error occurred: {e}")
\`\`\`

Order matters — Python checks \`except\` blocks in order and uses the first matching one. Put more specific exceptions before more general ones.

## Common Built-in Exceptions

\`\`\`python
# ValueError — wrong value type
int("abc")  # ValueError

# TypeError — wrong operation type
"2" + 2     # TypeError

# IndexError — list index out of range
[1, 2, 3][10]  # IndexError

# KeyError — dict key not found
{"a": 1}["b"]  # KeyError

# FileNotFoundError — file does not exist
open("nonexistent.txt")  # FileNotFoundError

# ZeroDivisionError — division by zero
1 / 0  # ZeroDivisionError

# AttributeError — attribute does not exist
"hello".nonexistent()  # AttributeError

# ImportError — module not found
import nonexistent_module  # ImportError
\`\`\`

## else and finally

\`else\` runs when no exception occurs. \`finally\` always runs, exception or not:

\`\`\`python
try:
    number = int(input("Enter a number: "))
except ValueError:
    print("Invalid input!")
else:
    print(f"Thanks! You entered {number}")
finally:
    print("This always runs — good for cleanup like closing files")

# finally is even used without except
try:
    file = open("data.txt", "r")
finally:
    file.close()  # always close the file
\`\`\`

## Raising Exceptions

You can raise exceptions yourself using the \`raise\` keyword:

\`\`\`python
def withdraw(balance, amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    new_balance = withdraw(100, 200)
except ValueError as e:
    print(f"Error: {e}")
\`\`\`

## Custom Exceptions

Create your own exception classes by inheriting from \`Exception\`:

\`\`\`python
class InsufficientFundsError(Exception):
    """Raised when an account has insufficient funds."""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Insufficient funds: need \${amount}, have \${balance}")

class NegativeAmountError(Exception):
    """Raised when a negative amount is provided."""
    pass

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        if amount < 0:
            raise NegativeAmountError("Amount cannot be negative")
        if amount > self.balance:
            raise InsufficientFundsError(self.balance, amount)
        self.balance -= amount
        return self.balance
\`\`\`

Custom exceptions make your code self-documenting and allow callers to catch specific error types.

## Logging Basics

For production applications, use the \`logging\` module instead of \`print()\`:

\`\`\`python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filename="app.log"  # log to file
)

# Different severity levels
logging.debug("Debug details")    # detailed info for debugging
logging.info("Operation started") # general information
logging.warning("Disk space low") # something unexpected
logging.error("File not found")   # a problem occurred
logging.critical("System crash")  # serious problem

# Log exceptions
try:
    1 / 0
except ZeroDivisionError:
    logging.exception("Division error occurred")
\`\`\`

Logging gives you timestamped, categorized, persistent records. In production, you can set \`level=logging.WARNING\` to suppress info and debug messages.`,
    exercisePrompt: "Write a program with a function divide_numbers(a, b) that handles: ValueError (non-numeric input), ZeroDivisionError, and any other unexpected errors. Create a custom exception called ValidationError and use it in a function validate_age(age) that checks age is between 0 and 150. Add logging to record all errors to 'errors.log'. The program should not crash on any input.",
    starterCode: `import logging

logging.basicConfig(
    level=logging.ERROR,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filename="errors.log"
)

class ValidationError(Exception):
    """Custom exception for validation failures."""
    pass

def divide_numbers(a, b):
    """Divide a by b with error handling."""
    pass

def validate_age(age):
    """Validate that age is between 0 and 150."""
    pass

# Test with various inputs
test_cases = [("10", "2"), ("abc", "2"), ("10", "0"), ("-5", "3"), ("200", "1")]

for a, b in test_cases:
    try:
        result = divide_numbers(a, b)
        print(f"{a} / {b} = {result}")
    except Exception as e:
        print(f"Error: {e}")
        logging.error(f"Failed to divide {a}/{b}: {e}")`,
    language: "python",
    learningObjectives: JSON.stringify(["Use try/except to catch and handle exceptions","Catch specific exception types (ValueError, TypeError, etc.)","Use else and finally clauses appropriately","Raise exceptions with the raise keyword","Create custom exception classes","Use the logging module for error logging"]),
    quiz: JSON.stringify([{"question":"What happens if a bare except: catches an exception?","options":["Only ValueError is caught","All exceptions are caught","No exceptions are caught","The program still crashes"],"correctIndex":1},{"question":"When does the else block in a try/except run?","options":["When an exception is raised","When no exception is raised","Always","When finally completes"],"correctIndex":1},{"question":"How do you create a custom exception?","options":["Create a new class inheriting from Exception","Define a function called exception","Use the @exception decorator","Set a global exception variable"],"correctIndex":0},{"question":"What is the purpose of the finally block?","options":["To handle specific exceptions","To run cleanup code regardless of exceptions","To log all errors","To retry failed operations"],"correctIndex":1},{"question":"What logging level represents the most severe problem?","options":["WARNING","ERROR","CRITICAL","FATAL"],"correctIndex":2}]),
  },
  {
    slug: "py-apis",
    title: "Working with APIs",
    order: 13,
    level: "advanced",
    exerciseType: "code",
    theory: `# Working with APIs

APIs (Application Programming Interfaces) allow programs to communicate over the internet. Most modern web services provide REST APIs that accept HTTP requests and return JSON data. Python makes working with APIs simple.

## The requests Library

The \`requests\` library is the de facto standard for HTTP in Python. Install it first:

\`\`\`bash
pip install requests
\`\`\`

\`\`\`python
import requests

# GET request
response = requests.get("https://api.github.com/users/octocat")
print(response.status_code)  # 200
print(response.ok)           # True (200-399 range)
\`\`\`

## Making GET Requests

\`\`\`python
import requests

# Basic GET
response = requests.get("https://jsonplaceholder.typicode.com/posts")

# Check status
if response.status_code == 200:
    data = response.json()  # parse JSON response
    print(f"Got {len(data)} posts")

# Query parameters
params = {"userId": 1, "_limit": 5}
response = requests.get("https://jsonplaceholder.typicode.com/posts", params=params)

# Headers
headers = {"Authorization": "Bearer your-token", "Accept": "application/json"}
response = requests.get("https://api.github.com/user", headers=headers)
\`\`\`

## Making POST Requests

\`\`\`python
import requests

# POST with JSON data
new_post = {
    "title": "My Post",
    "body": "This is the content",
    "userId": 1
}

response = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json=new_post  # automatically serializes to JSON
)

print(response.status_code)  # 201 (Created)
print(response.json())       # the created resource
\`\`\`

Use the \`json=\` parameter for JSON payloads. Use \`data=\` for form-encoded data.

## Parsing JSON Responses

\`\`\`python
import requests

response = requests.get("https://api.github.com/users/octocat")
data = response.json()

print(f"Login: {data['login']}")
print(f"Name: {data.get('name', 'No name')}")
print(f"Public repos: {data['public_repos']}")
print(f"Followers: {data['followers']}")
\`\`\`

Always use \`.get()\` for optional fields to avoid KeyError.

## API Keys and Authentication

Many APIs require authentication. Common methods:

\`\`\`python
# API key in headers
headers = {"X-API-Key": "your-api-key"}
response = requests.get("https://api.example.com/data", headers=headers)

# API key as query parameter
response = requests.get("https://api.example.com/data", params={"api_key": "your-key"})

# Basic auth
from requests.auth import HTTPBasicAuth
response = requests.get(
    "https://api.example.com/protected",
    auth=HTTPBasicAuth("username", "password")
)

# Token auth (Bearer)
headers = {"Authorization": "Bearer your-token"}
\`\`\`

Never hardcode API keys in your code. Use environment variables:

\`\`\`python
import os
API_KEY = os.environ.get("API_KEY")
\`\`\`

## Error Handling

\`\`\`python
import requests

try:
    response = requests.get("https://api.github.com/users/nonexistent-user-12345", timeout=10)

    if response.status_code == 404:
        print("User not found")
    elif response.status_code == 403:
        print("Rate limited or forbidden")
    elif response.status_code == 500:
        print("Server error")
    else:
        response.raise_for_status()  # raises for 4xx/5xx
        print(response.json())

except requests.exceptions.ConnectionError:
    print("Could not connect to server")
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
\`\`\`

Always set a timeout and handle network errors. Never assume the API is reachable.

## Rate Limiting

APIs often limit how many requests you can make. Be respectful:

\`\`\`python
import time
import requests

for repo in ["python/cpython", "rust-lang/rust"]:
    response = requests.get(f"https://api.github.com/repos/{repo}")
    if response.status_code == 403:
        print("Rate limited!")
        break

    # Check rate limit headers
    remaining = response.headers.get("X-RateLimit-Remaining", "unknown")
    print(f"Remaining requests: {remaining}")

    time.sleep(1)  # be polite — 1 second between requests
\`\`\`

## Building a CLI Weather App

Here is a complete example that ties everything together:

\`\`\`python
import requests
import os
import sys

API_KEY = os.environ.get("WEATHER_API_KEY", "demo-key")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather(city):
    try:
        params = {"q": city, "appid": API_KEY, "units": "metric"}
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        temp = data["main"]["temp"]
        feels_like = data["main"]["feels_like"]
        description = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]

        print(f"Weather in {city}:")
        print(f"  Temperature: {temp}°C (feels like {feels_like}°C)")
        print(f"  Conditions: {description}")
        print(f"  Humidity: {humidity}%")

    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            print(f"City '{city}' not found")
        else:
            print(f"HTTP error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    city = sys.argv[1] if len(sys.argv) > 1 else "London"
    get_weather(city)
\`\`\``,
    exercisePrompt: "Build a CLI program that fetches and displays information about a GitHub user. Accept a username as a command-line argument (or default to 'octocat'). Fetch: user info (name, bio, public repos, followers), list the names of their 5 most recent repos, and display the total number of stars across all public repos. Handle errors gracefully: 404 (user not found), network errors, rate limiting. Use os.environ for a potential GITHUB_TOKEN.",
    starterCode: `import requests
import os
import sys

GITHUB_API = "https://api.github.com"

def get_user_info(username):
    """Fetch GitHub user profile."""
    pass

def get_user_repos(username):
    """Fetch user repositories."""
    pass

def display_github_profile(username):
    """Display formatted GitHub profile."""
    pass

if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "octocat"
    display_github_profile(username)`,
    language: "python",
    learningObjectives: JSON.stringify(["Send HTTP GET and POST requests with the requests library","Parse JSON responses from APIs","Handle API authentication with keys and tokens","Manage rate limiting and API errors gracefully","Build a CLI application that consumes a real API"]),
    quiz: JSON.stringify([{"question":"What does response.json() do?","options":["Returns the response as a string","Parses the response body as JSON","Converts the response to XML","Returns the response headers"],"correctIndex":1},{"question":"What status code indicates a resource was created?","options":["200","201","204","301"],"correctIndex":1},{"question":"How do you add query parameters to a GET request?","options":["params parameter","query parameter","args parameter","data parameter"],"correctIndex":0},{"question":"What should you always set on requests to avoid hanging?","options":["headers","timeout","cookies","auth"],"correctIndex":1},{"question":"What is the best practice for storing API keys?","options":["Hardcode them in the script","Store in environment variables","Ask the user each time","Store in a text file"],"correctIndex":1}]),
  },
  {
    slug: "py-automation",
    title: "Automation with Python",
    order: 14,
    level: "advanced",
    exerciseType: "code",
    theory: `# Automation with Python

Python excels at automating repetitive tasks. From renaming thousands of files to scraping websites and scheduling jobs, Python can handle it all. This lesson covers the essential tools for automation.

## os and shutil for File Operations

The \`os\` module provides low-level operating system operations. \`shutil\` offers higher-level file operations:

\`\`\`python
import os
import shutil

# Current directory
cwd = os.getcwd()

# List files and directories
items = os.listdir(".")
for item in items:
    print(item)

# Create and remove directories
os.mkdir("new_folder")              # create single directory
os.makedirs("a/b/c", exist_ok=True) # create nested directories
os.rmdir("empty_folder")            # remove empty directory
shutil.rmtree("a")                  # remove directory and contents

# File operations
os.rename("old.txt", "new.txt")     # rename/move file
shutil.copy("source.txt", "dest.txt")  # copy file
shutil.copytree("src", "dst")       # copy entire directory
os.remove("file.txt")               # delete file

# File info
size = os.path.getsize("file.txt")
modified = os.path.getmtime("file.txt")
exists = os.path.exists("file.txt")
is_file = os.path.isfile("file.txt")
is_dir = os.path.isdir("folder")
\`\`\`

## glob for File Patterns

The \`glob\` module finds files matching a pattern, like a simplified regex:

\`\`\`python
import glob

# All .txt files in current directory
txt_files = glob.glob("*.txt")

# Recursive search (Python 3.5+)
all_py_files = glob.glob("**/*.py", recursive=True)

# Wildcards work too
files = glob.glob("data_[0-9].csv")
images = glob.glob("images/*.{jpg,png,gif}")

for file in txt_files:
    print(file)
\`\`\`

\`glob\` is perfect for batch operations — find files matching a pattern, then process them all.

## Scheduling with time and schedule

For simple delays, use \`time.sleep()\`:

\`\`\`python
import time

print("Starting...")
time.sleep(5)  # wait 5 seconds
print("Done waiting")
\`\`\`

For recurring tasks, use the \`schedule\` library (install with \`pip install schedule\`):

\`\`\`python
import schedule
import time

def backup_files():
    print("Backing up files...")

def check_disk_space():
    print("Checking disk space...")

# Schedule tasks
schedule.every().day.at("02:00").do(backup_files)
schedule.every().hour.do(check_disk_space)
schedule.every(30).minutes.do(some_task)
schedule.every().monday.at("09:00").do(weekly_report)

while True:
    schedule.run_pending()
    time.sleep(1)
\`\`\`

## Web Scraping with requests and BeautifulSoup

Web scraping extracts data from websites. Combine \`requests\` with \`BeautifulSoup\` (install with \`pip install beautifulsoup4 lxml\`):

\`\`\`python
import requests
from bs4 import BeautifulSoup

# Fetch a page
url = "https://example.com/articles"
response = requests.get(url, timeout=10)
soup = BeautifulSoup(response.text, "lxml")

# Find elements
title = soup.find("h1").text
all_links = soup.find_all("a")
first_paragraph = soup.select("div.content p:first-child")

# Extract structured data
articles = soup.find_all("article")
for article in articles:
    title = article.find("h2").text
    link = article.find("a")["href"]
    summary = article.find("p").text
    print(f"{title}: {summary}")
\`\`\`

Always check a website's \`robots.txt\` before scraping and respect rate limits. Some sites prohibit scraping entirely.

## Environment Variables

Environment variables keep configuration out of your code:

\`\`\`python
import os

# Get a variable (returns None if missing)
db_url = os.environ.get("DATABASE_URL")

# Get with default
secret = os.environ.get("SECRET_KEY", "default-dev-key")

# Get and raise if missing
api_key = os.environ["API_KEY"]  # KeyError if missing

# Set a variable (only affects the current process)
os.environ["MY_VAR"] = "value"

# All environment variables
for key, value in os.environ.items():
    print(f"{key}={value}")
\`\`\`

Use a \`.env\` file with the \`python-dotenv\` library for local development:

\`\`\`python
from dotenv import load_dotenv
load_dotenv()  # loads variables from .env file
\`\`\`

## Practical Automation Example

Here is an automation script that organizes a Downloads folder:

\`\`\`python
import os
import shutil
import glob
from pathlib import Path

downloads = Path.home() / "Downloads"
folders = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
    "Documents": [".pdf", ".docx", ".txt", ".md"],
    "Spreadsheets": [".xlsx", ".csv"],
    "Archives": [".zip", ".tar", ".gz", ".rar"],
    "Code": [".py", ".js", ".ts", ".html", ".css", ".json"],
}

for folder, extensions in folders.items():
    folder_path = downloads / folder
    folder_path.mkdir(exist_ok=True)

    for ext in extensions:
        for file in downloads.glob(f"*{ext}"):
            shutil.move(str(file), str(folder_path / file.name))
            print(f"Moved {file.name} to {folder}")
\`\`\`

Run this script daily and your Downloads folder stays organized automatically.`,
    exercisePrompt: "Write an automation script that organizes files in a 'cluttered' directory. Create 3 subdirectories: 'Images' (jpg, png, gif), 'Documents' (pdf, docx, txt), and 'Others' (everything else). Use glob to find files matching each extension, os to create directories, and shutil to move files. After organizing, print a summary showing how many files were moved to each folder. The script should create the cluttered directory with some test files first if it does not exist.",
    starterCode: `import os
import shutil
import glob
from pathlib import Path

CLUTTERED_DIR = Path("cluttered")

def setup_test_files():
    """Create test files for the demo."""
    CLUTTERED_DIR.mkdir(exist_ok=True)
    for ext in [".jpg", ".png", ".gif", ".pdf", ".docx", ".txt", ".log", ".tmp"]:
        for i in range(3):
            (CLUTTERED_DIR / f"file_{i}{ext}").touch()

def organize_directory():
    """Organize files into categorized folders."""
    categories = {
        "Images": [".jpg", ".jpeg", ".png", ".gif"],
        "Documents": [".pdf", ".docx", ".txt", ".md"],
    }
    summary = {}

    # Implement the organization logic

    return summary

def print_summary(summary):
    """Print a summary of what was organized."""
    pass

if __name__ == "__main__":
    setup_test_files()
    print("Before:", os.listdir(CLUTTERED_DIR))
    summary = organize_directory()
    print_summary(summary)
    print("After:", os.listdir(CLUTTERED_DIR))`,
    language: "python",
    learningObjectives: JSON.stringify(["Use os and shutil for file and directory operations","Find files by pattern with the glob module","Schedule recurring tasks with time and schedule libraries","Perform web scraping with requests and BeautifulSoup","Manage configuration with environment variables"]),
    quiz: JSON.stringify([{"question":"Which function removes a non-empty directory and all its contents?","options":["os.rmdir()","os.remove()","shutil.rmtree()","os.unlink()"],"correctIndex":2},{"question":"What does glob.glob('**/*.py', recursive=True) do?","options":["Finds all .py files in the current directory","Finds all .py files recursively in all subdirectories","Finds Python files named '**'","Matches .py files with exactly two characters"],"correctIndex":1},{"question":"How do you get an environment variable with a default if missing?","options":["os.environ['VAR']","os.getenv('VAR', 'default')","os.environ.get('VAR', 'default')","os.get('VAR', 'default')"],"correctIndex":2},{"question":"What does schedule.every().day.at('09:00').do(job) do?","options":["Runs job every 9 seconds","Runs job every day at 9 AM","Runs job 9 times a day","Runs job on the 9th of each month"],"correctIndex":1},{"question":"Which library is used for parsing HTML in web scraping?","options":["htmlparser","BeautifulSoup","requests-html","scrapy"],"correctIndex":1}]),
  },
  {
    slug: "py-project",
    title: "Final Project: File Automation Tool",
    order: 25,
    level: "advanced",
    exerciseType: "code",
    theory: `# Final Project: File Automation Tool

This final project brings together everything you have learned: functions, file handling, error handling, modular programming, and automation. You will build a CLI tool that organizes files in a directory.

## Project Overview

Your task is to build a command-line tool that:

1. Accepts a directory path as an argument
2. Lists all files in the directory
3. Filters files by extension
4. Copies or renames files based on rules
5. Generates a summary report
6. Handles all errors gracefully

## Architecture

Structure your project into functions, each with a single responsibility:

\`\`\`python
# main.py
import sys
import os
import shutil
from pathlib import Path
import argparse
from datetime import datetime

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="File Automation Tool")
    parser.add_argument("directory", help="Directory to organize")
    parser.add_argument("--extension", "-e", help="Filter by extension (e.g., .txt)")
    parser.add_argument("--action", "-a", choices=["list", "copy", "rename", "organize"],
                        default="list", help="Action to perform")
    parser.add_argument("--output", "-o", help="Output directory for copy action")
    return parser.parse_args()

def list_files(directory, extension=None):
    """List files in directory, optionally filtering by extension."""
    path = Path(directory)
    files = sorted(path.iterdir())
    if extension:
        files = [f for f in files if f.suffix == extension]
    return files

def copy_files(files, output_dir):
    """Copy files to output directory."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    copied = []
    for file in files:
        try:
            shutil.copy2(str(file), str(output_path / file.name))
            copied.append(file.name)
        except (shutil.Error, OSError) as e:
            print(f"Error copying {file.name}: {e}")
    return copied

def rename_files(files, prefix="renamed_"):
    """Rename files with a prefix."""
    renamed = []
    for file in files:
        try:
            new_name = file.parent / f"{prefix}{file.name}"
            file.rename(new_name)
            renamed.append((file.name, new_name.name))
        except OSError as e:
            print(f"Error renaming {file.name}: {e}")
    return renamed

def organize_by_extension(directory):
    """Organize files into subdirectories by extension."""
    path = Path(directory)
    organized = {}
    for file in path.iterdir():
        if file.is_file():
            ext = file.suffix[1:] if file.suffix else "no_extension"
            ext_dir = path / ext.upper()
            ext_dir.mkdir(exist_ok=True)
            try:
                shutil.move(str(file), str(ext_dir / file.name))
                organized.setdefault(ext, []).append(file.name)
            except OSError as e:
                print(f"Error moving {file.name}: {e}")
    return organized

def generate_report(directory, action, results, start_time):
    """Generate and print a summary report."""
    elapsed = datetime.now() - start_time
    print("\\n" + "=" * 50)
    print(f"  FILE AUTOMATION REPORT")
    print("=" * 50)
    print(f"  Directory: {directory}")
    print(f"  Action: {action}")
    print(f"  Time: {elapsed.total_seconds():.2f}s")
    print("-" * 50)
    print(f"  Results: {results}")
    print("=" * 50 + "\\n")

def main():
    start_time = datetime.now()
    args = parse_arguments()

    try:
        # Validate directory
        directory = Path(args.directory)
        if not directory.exists():
            print(f"Error: Directory '{args.directory}' does not exist")
            sys.exit(1)
        if not directory.is_dir():
            print(f"Error: '{args.directory}' is not a directory")
            sys.exit(1)

        # Perform action
        if args.action == "list":
            files = list_files(directory, args.extension)
            print(f"\\nFound {len(files)} files:")
            for f in files:
                size = f.stat().st_size
                modified = datetime.fromtimestamp(f.stat().st_mtime)
                print(f"  {f.name:30} {size:>8} bytes  {modified:%Y-%m-%d %H:%M}")
            generate_report(directory, args.action, f"{len(files)} files listed", start_time)

        elif args.action == "copy":
            if not args.output:
                print("Error: --output is required for copy action")
                sys.exit(1)
            files = list_files(directory, args.extension)
            copied = copy_files(files, args.output)
            generate_report(directory, args.action, f"{len(copied)} files copied", start_time)

        elif args.action == "rename":
            files = list_files(directory, args.extension)
            renamed = rename_files(files)
            generate_report(directory, args.action, f"{len(renamed)} files renamed", start_time)

        elif args.action == "organize":
            organized = organize_by_extension(directory)
            summary = {ext: len(files) for ext, files in organized.items()}
            generate_report(directory, args.action, summary, start_time)

    except Exception as e:
        print(f"Unexpected error: {e}")
        logging.exception("Fatal error")
        sys.exit(1)

if __name__ == "__main__":
    main()
\`\`\`

## Project Requirements

Your submission must:
- Use at least 4 functions with docstrings
- Handle errors at every level (file not found, permission denied, invalid arguments)
- Use the \`argparse\` module for CLI arguments
- Generate a detailed summary report
- Use \`pathlib\` for all path operations
- Include a \`__main__\` guard

## Stretch Goals

If you want to push further:
- Add a \`--recursive\` flag to process subdirectories
- Add a \`--dry-run\` flag that shows what would happen without making changes
- Add logging to a file
- Add a progress bar with \`tqdm\` (\`pip install tqdm\`)

This project is your ticket to showing you can write production-quality Python. Take your time, test each function, and make sure error handling is comprehensive.`,
    exercisePrompt: "Build a complete file automation CLI tool. It must accept a directory path, support 4 actions (list, copy, rename, organize), filter by extension, handle all errors gracefully (permission denied, file not found, invalid args), and print a formatted summary report with timing. Use argparse, pathlib, at least 5 functions with docstrings, and comprehensive error handling. Test it by creating a test directory with various file types.",
    starterCode: `import sys
import shutil
from pathlib import Path
from datetime import datetime
import argparse

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="File Automation Tool")
    parser.add_argument("directory", help="Directory to process")
    parser.add_argument("--action", "-a", choices=["list", "copy", "rename", "organize"],
                        default="list", help="Action to perform")
    parser.add_argument("--extension", "-e", help="Filter by extension")
    parser.add_argument("--output", "-o", help="Output directory for copy action")
    return parser.parse_args()

def list_files(directory, extension=None):
    """List files in directory, optionally filtered by extension."""
    pass

def copy_files(files, output_dir):
    """Copy files to output directory."""
    pass

def rename_files(files, prefix="renamed_"):
    """Rename files by adding a prefix."""
    pass

def organize_by_extension(directory):
    """Organize files into subdirectories by file extension."""
    pass

def generate_report(directory, action, results, start_time):
    """Print a formatted summary report."""
    pass

def setup_test_directory():
    """Create a test directory with sample files."""
    test_dir = Path("test_files")
    test_dir.mkdir(exist_ok=True)
    for ext in [".txt", ".jpg", ".pdf", ".py", ".csv"]:
        for i in range(3):
            (test_dir / f"sample_{i}{ext}").write_text(f"This is file {i}")
    return test_dir

def main():
    start_time = datetime.now()
    args = parse_arguments()
    # Implement main logic

if __name__ == "__main__":
    print("Setting up test directory...")
    test_dir = setup_test_directory()
    print(f"Test files created in '{test_dir}/'")

    # Uncomment to test with the test directory:
    # import sys
    # sys.argv = ["main.py", str(test_dir), "--action", "list"]
    # main()

    # Run main with actual command-line args
    main()`,
    language: "python",
    learningObjectives: JSON.stringify(["Build a complete CLI tool with argparse","Process files using pathlib and shutil","Implement multiple actions with error handling","Generate formatted summary reports","Apply modular design with single-responsibility functions","Handle edge cases and errors gracefully at every level"]),
    quiz: JSON.stringify([{"question":"Which module is used for parsing command-line arguments?","options":["sys.argv","getopt","argparse","click"],"correctIndex":2},{"question":"What does pathlib.Path.iterdir() return?","options":["Only files","Only directories","All items in the directory","File contents"],"correctIndex":2},{"question":"Which shutil function copies a file while preserving metadata?","options":["shutil.copy()","shutil.copy2()","shutil.copytree()","shutil.move()"],"correctIndex":1},{"question":"What should a --dry-run flag do?","options":["Run faster","Show what would happen without making changes","Delete files instead","Skip error checking"],"correctIndex":1},{"question":"What does argparse.ArgumentParser.add_argument() return?","options":["The parsed value","Nothing (None)","The argument object","A string"],"correctIndex":2}]),
  },
  {
    slug: "py-strings",
    title: "Strings in Depth",
    order: 15,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Strings in Depth

You have used strings since lesson one. Now let's master them. A string is an **immutable ordered sequence of characters**, which means you can read any character by position but you can never change a string in place — every "modification" returns a brand-new string.

## Indexing and Slicing

Each character has an index starting at 0. Negative indexes count from the end.

\`\`\`python
word = "Python"
print(word[0])     # P
print(word[-1])    # n
print(word[0:3])   # Pyt   (slice: start inclusive, stop exclusive)
print(word[::-1])  # nohtyP (reverse with a step of -1)
\`\`\`

## Immutability

\`\`\`python
word[0] = "J"   # TypeError! strings cannot be changed in place
word = "J" + word[1:]   # instead, build a new string
\`\`\`

## Essential Methods

\`\`\`python
"  hi  ".strip()        # "hi"      remove surrounding whitespace
"hello".upper()         # "HELLO"
"HELLO".lower()         # "hello"
"a,b,c".split(",")      # ["a", "b", "c"]   string -> list
"-".join(["a", "b"])    # "a-b"             list -> string
"hello".replace("l", "L")  # "heLLo"
"hello".find("l")       # 2  (index of first match, -1 if absent)
"file.py".endswith(".py")  # True
\`\`\`

## f-strings

f-strings are the modern way to build text. Put an \`f\` before the quote and embed expressions in \`{}\`:

\`\`\`python
name, score = "Neo", 95
print(f"{name} scored {score}%")     # Neo scored 95%
print(f"{score / 3:.2f}")            # 31.67  (:.2f formats to 2 decimals)
\`\`\`

Because methods return new strings, you can **chain** them: \`text.strip().lower().replace(" ", "-")\`.`,
    exercisePrompt: "Given the string ' Hello, World! ', clean it up: strip the whitespace, convert it to lowercase, replace the comma with nothing, and print each word on its own line using split() and a loop.",
    starterCode: `text = "  Hello, World!  "

# 1. Strip whitespace and lowercase it
cleaned = text

# 2. Remove the comma

# 3. Split into words and print each one
`,
    language: "python",
    learningObjectives: JSON.stringify(["Index and slice strings, including negative indexes and steps","Explain why strings are immutable","Use core string methods: strip, split, join, replace, find","Format text cleanly with f-strings","Chain string methods together"]),
    quiz: JSON.stringify([{"question":"What does \"Python\"[-1] return?","options":["P","n","o","y"],"correctIndex":1},{"question":"Are Python strings mutable?","options":["Yes, you can change characters by index","No, every change returns a new string","Only if they are short","Only inside functions"],"correctIndex":1},{"question":"What does \"a,b,c\".split(\",\") return?","options":["\"abc\"","[\"a\", \"b\", \"c\"]","(\"a\", \"b\", \"c\")","\"a b c\""],"correctIndex":1},{"question":"How do you join the list [\"a\", \"b\"] with a dash?","options":["[\"a\",\"b\"].join(\"-\")","join(\"-\", [\"a\",\"b\"])","\"-\".join([\"a\", \"b\"])","\"a\" + \"-\" + \"b\" only"],"correctIndex":2},{"question":"What does \"Python\"[0:3] return?","options":["\"Pyt\"","\"Pyth\"","\"yth\"","\"Pytho\""],"correctIndex":0}]),
  },
  {
    slug: "py-tuples-sets",
    title: "Tuples & Sets",
    order: 16,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Tuples & Sets

Lists are not the only collections in Python. Two more are essential: **tuples** and **sets**.

## Tuples — Immutable Sequences

A tuple is like a list, but it **cannot be changed** after creation. Use tuples for fixed groups of related values (coordinates, RGB colors, database rows).

\`\`\`python
point = (3, 5)
print(point[0])    # 3  (index like a list)
point[0] = 9       # TypeError — tuples are immutable
\`\`\`

**Packing and unpacking** is the tuple superpower:

\`\`\`python
coords = 3, 5            # packing (parentheses optional)
x, y = coords            # unpacking
a, b = b, a              # swap two variables in one line!
\`\`\`

Watch out: a single-element tuple **needs a trailing comma**: \`(5,)\` is a tuple, \`(5)\` is just the number 5.

## Sets — Unique, Unordered

A set stores **unique** values with no order. It is perfect for removing duplicates and testing membership fast.

\`\`\`python
nums = {1, 2, 2, 3}
print(nums)            # {1, 2, 3}  duplicates removed
nums.add(4)
nums.remove(1)
print(3 in nums)       # True — membership is very fast
\`\`\`

Sets support mathematical operations:

\`\`\`python
a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # {1, 2, 3, 4}  union
print(a & b)   # {2, 3}        intersection
print(a - b)   # {1}           difference
\`\`\`

A quick way to remove duplicates from a list: \`list(set(my_list))\`.`,
    exercisePrompt: "You have a list of tags with duplicates: ['python', 'web', 'python', 'data', 'web']. Use a set to find the unique tags, then print how many unique tags there are and whether 'data' is among them.",
    starterCode: `tags = ["python", "web", "python", "data", "web"]

# 1. Get the unique tags using a set

# 2. Print the number of unique tags

# 3. Check if "data" is in the set
`,
    language: "python",
    learningObjectives: JSON.stringify(["Create tuples and explain their immutability","Use tuple packing, unpacking, and the one-line swap","Build sets and use them to remove duplicates","Apply set operations: union, intersection, difference","Choose the right collection for a task"]),
    quiz: JSON.stringify([{"question":"Tuples are best described as...","options":["Mutable ordered sequences","Immutable ordered sequences","Unordered unique collections","Key-value mappings"],"correctIndex":1},{"question":"What does a set store?","options":["Ordered duplicate values","Unique unordered values","Key-value pairs","Only numbers"],"correctIndex":1},{"question":"What is {1, 2, 3} & {2, 3, 4}?","options":["{1, 2, 3, 4}","{2, 3}","{1}","{1, 4}"],"correctIndex":1},{"question":"How do you write a tuple with one element, the number 5?","options":["(5)","(5,)","[5]","{5}"],"correctIndex":1},{"question":"What is the easiest way to remove duplicates from a list?","options":["list.sort()","list(set(my_list))","list.unique()","tuple(my_list)"],"correctIndex":1}]),
  },
  {
    slug: "py-comprehensions",
    title: "List & Dict Comprehensions",
    order: 17,
    level: "intermediate",
    exerciseType: "code",
    theory: `# List & Dict Comprehensions

Comprehensions are a concise, readable way to build a collection from another iterable in a single line. They are one of the most "Pythonic" features of the language.

## The Basic Pattern

A loop that builds a list:

\`\`\`python
squares = []
for x in range(5):
    squares.append(x * x)
\`\`\`

…becomes one expressive line:

\`\`\`python
squares = [x * x for x in range(5)]   # [0, 1, 4, 9, 16]
\`\`\`

Read it left to right: **expression**, then **for clause**.

## Adding a Condition

Filter items by adding an \`if\` at the end:

\`\`\`python
evens = [x for x in range(10) if x % 2 == 0]   # [0, 2, 4, 6, 8]
\`\`\`

## Dict and Set Comprehensions

The same idea works for dictionaries and sets:

\`\`\`python
squares_map = {x: x * x for x in range(4)}   # {0: 0, 1: 1, 2: 4, 3: 9}
unique_lengths = {len(w) for w in ["hi", "ok", "hey"]}  # {2, 3}
\`\`\`

## When to Use Them

Comprehensions shine for **simple transformations and filters**. If the logic gets complex (multiple conditions, side effects, nested branches), a regular loop is clearer. Favor readability over cleverness — a comprehension you cannot read at a glance defeats the purpose.`,
    exercisePrompt: "Given prices = [10, 25, 5, 40, 15], use a list comprehension to build a new list of prices that are above 12, then use a dict comprehension to map each original price to its price with 10% tax added.",
    starterCode: `prices = [10, 25, 5, 40, 15]

# 1. List comprehension: prices above 12
expensive = []

# 2. Dict comprehension: price -> price * 1.10
with_tax = {}

print(expensive)
print(with_tax)
`,
    language: "python",
    learningObjectives: JSON.stringify(["Write list comprehensions to transform iterables","Filter items with a condition inside a comprehension","Build dictionaries and sets with comprehensions","Decide when a comprehension is clearer than a loop"]),
    quiz: JSON.stringify([{"question":"What does [x * 2 for x in range(3)] produce?","options":["[0, 1, 2]","[0, 2, 4]","[2, 4, 6]","[1, 2, 3]"],"correctIndex":1},{"question":"How do you keep only even numbers in a comprehension?","options":["[x for x in nums while x % 2 == 0]","[x for x in nums if x % 2 == 0]","[x if x % 2 == 0 for x in nums]","[even x for x in nums]"],"correctIndex":1},{"question":"Which builds a dictionary?","options":["[k: v for k in items]","{k: v for k, v in pairs}","(k: v for k in items)","{k, v for k in items}"],"correctIndex":1},{"question":"When should you prefer a normal loop over a comprehension?","options":["Always","When the logic is complex or has side effects","When building a list","Never"],"correctIndex":1},{"question":"What does {x for x in [1, 1, 2, 3]} produce?","options":["[1, 1, 2, 3]","{1, 2, 3}","{1, 1, 2, 3}","(1, 2, 3)"],"correctIndex":1}]),
  },
  {
    slug: "py-lambda",
    title: "Lambdas & Functional Tools",
    order: 18,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Lambdas & Functional Tools

Sometimes you need a tiny throwaway function. Python's \`lambda\` lets you define one inline, and built-in tools like \`map\`, \`filter\`, and \`sorted\` use them to process data elegantly.

## Lambda Functions

A lambda is an **anonymous function** — a function without a name, written in one expression:

\`\`\`python
square = lambda x: x * x
print(square(5))        # 25

add = lambda a, b: a + b
print(add(2, 3))        # 5
\`\`\`

A lambda can only hold a single expression (no statements, no loops). For anything bigger, use a normal \`def\`.

## sorted() with a key

The most common use of lambdas is the \`key\` argument, which decides what to sort by:

\`\`\`python
words = ["banana", "kiwi", "apple"]
print(sorted(words, key=len))            # ['kiwi', 'apple', 'banana']
people = [("Sam", 30), ("Ada", 25)]
print(sorted(people, key=lambda p: p[1]))  # sort by age
\`\`\`

## map() and filter()

\`map\` applies a function to every item; \`filter\` keeps items where the function returns \`True\`:

\`\`\`python
nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))      # [2, 4, 6, 8]
evens = list(filter(lambda x: x % 2 == 0, nums)) # [2, 4]
\`\`\`

Both return lazy iterators, so wrap them in \`list()\` to see the result. Note: a comprehension often reads more clearly than \`map\`/\`filter\` — use whichever is more readable.`,
    exercisePrompt: "Given a list of (name, score) tuples, use sorted() with a lambda to sort players from highest to lowest score, then use filter() with a lambda to keep only players who scored 50 or more. Print both results.",
    starterCode: `players = [("Ada", 80), ("Sam", 45), ("Lee", 60), ("Mia", 30)]

# 1. Sort by score, highest first (hint: reverse=True)
ranked = players

# 2. Keep players with score >= 50
qualified = players

print(ranked)
print(qualified)
`,
    language: "python",
    learningObjectives: JSON.stringify(["Write lambda (anonymous) functions","Sort data with sorted() and a key function","Transform iterables with map()","Filter iterables with filter()","Know when a comprehension is clearer than map/filter"]),
    quiz: JSON.stringify([{"question":"What is a lambda?","options":["A loop construct","An anonymous single-expression function","A type of list","A module"],"correctIndex":1},{"question":"What does sorted(words, key=len) do?","options":["Sorts alphabetically","Sorts by string length","Reverses the list","Removes duplicates"],"correctIndex":1},{"question":"filter(fn, items) keeps items where fn returns...","options":["False","None","True","a number"],"correctIndex":2},{"question":"What does list(map(lambda x: x * 2, [1, 2])) return?","options":["[1, 2]","[2, 4]","[1, 4]","[2, 2]"],"correctIndex":1},{"question":"A lambda can contain...","options":["Multiple statements and loops","Only a single expression","Only print calls","Any amount of code"],"correctIndex":1}]),
  },
  {
    slug: "py-recursion",
    title: "Recursion",
    order: 19,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Recursion

Recursion is when a function **calls itself** to solve a smaller version of the same problem. It is a powerful way to express problems that are naturally self-similar, like traversing folders, walking trees, or computing factorials.

## The Two Rules

Every correct recursive function needs:

1. A **base case** — a condition that stops the recursion (the smallest, directly-solvable problem).
2. A **recursive case** — the function calls itself with input that moves toward the base case.

\`\`\`python
def factorial(n):
    if n <= 1:           # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))      # 120  (5 * 4 * 3 * 2 * 1)
\`\`\`

## How It Unfolds

\`factorial(3)\` pauses and calls \`factorial(2)\`, which pauses and calls \`factorial(1)\`, which returns 1. Then the paused calls resume and multiply back up: 1 → 2 → 6. Each call waits on the **call stack** until the one below it finishes.

## The Danger: Missing Base Case

If the base case never triggers, the function calls itself forever until Python stops it:

\`\`\`python
def boom(n):
    return boom(n + 1)   # no base case!
# RecursionError: maximum recursion depth exceeded
\`\`\`

## Recursion vs Loops

Anything recursive can be written with a loop, and vice versa. Recursion is clearest for **branching, self-similar structures** (trees, nested data). For simple repetition, a loop is usually faster and lighter.`,
    exercisePrompt: "Write a recursive function sum_to(n) that returns the sum of all integers from 1 to n (so sum_to(4) is 1+2+3+4 = 10). Identify your base case clearly, then print sum_to(5).",
    starterCode: `def sum_to(n):
    # base case: when n is 1 (or 0), return n
    # recursive case: n + sum_to(n - 1)
    pass

print(sum_to(5))   # should print 15
`,
    language: "python",
    learningObjectives: JSON.stringify(["Define recursion and identify self-similar problems","Write a base case and a recursive case","Trace how recursive calls unfold on the call stack","Recognize and avoid infinite recursion","Compare recursion with iteration"]),
    quiz: JSON.stringify([{"question":"Every recursive function must have a...","options":["Loop","Base case that stops recursion","Global variable","Lambda"],"correctIndex":1},{"question":"What happens if the base case is never reached?","options":["The function returns None","Infinite recursion until a RecursionError","It runs faster","Nothing, it works fine"],"correctIndex":1},{"question":"What does factorial(0) return in the lesson's definition (n <= 1)?","options":["0","1","None","Error"],"correctIndex":1},{"question":"Recursive calls are tracked using the...","options":["Heap","Call stack","Database","Cache"],"correctIndex":1},{"question":"Recursion is usually clearest for...","options":["Simple counting loops","Self-similar structures like trees","Reading user input","Printing text"],"correctIndex":1}]),
  },
  {
    slug: "py-generators",
    title: "Iterators & Generators",
    order: 20,
    level: "advanced",
    exerciseType: "code",
    theory: `# Iterators & Generators

How does a \`for\` loop actually walk through a list? Through the **iterator protocol**. Understanding it unlocks **generators** — a memory-efficient way to produce sequences on demand.

## Iterables vs Iterators

An **iterable** is anything you can loop over (lists, strings, dicts). Calling \`iter()\` on it returns an **iterator**, and \`next()\` pulls one item at a time until it raises \`StopIteration\`:

\`\`\`python
it = iter([10, 20])
print(next(it))   # 10
print(next(it))   # 20
print(next(it))   # StopIteration
\`\`\`

## Generators with yield

A generator function uses \`yield\` instead of \`return\`. Each \`yield\` produces a value and **pauses**, resuming where it left off on the next request:

\`\`\`python
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(3):
    print(num)        # 1, 2, 3
\`\`\`

## Why Generators Matter: Laziness

Generators are **lazy** — they compute one value at a time instead of building the whole sequence in memory. This lets you process huge or even infinite streams:

\`\`\`python
# A list of a billion squares would crash memory.
# A generator handles it one item at a time:
squares = (x * x for x in range(1_000_000_000))
print(next(squares))   # 0  — nothing else is computed yet
\`\`\`

That \`(x * x for x in ...)\` is a **generator expression** — like a list comprehension with parentheses. Reach for generators when data is large, streamed, or you only need items one at a time.`,
    exercisePrompt: "Write a generator function fibonacci(n) that yields the first n Fibonacci numbers (0, 1, 1, 2, 3, 5, ...). Then loop over fibonacci(7) and print each value.",
    starterCode: `def fibonacci(n):
    a, b = 0, 1
    # yield n values, advancing a and b each time
    pass

for num in fibonacci(7):
    print(num)
`,
    language: "python",
    learningObjectives: JSON.stringify(["Distinguish iterables from iterators","Use iter() and next() and handle StopIteration","Write generator functions with yield","Create generator expressions","Explain why generators are memory-efficient (lazy evaluation)"]),
    quiz: JSON.stringify([{"question":"Which keyword turns a function into a generator?","options":["return","yield","async","gen"],"correctIndex":1},{"question":"Generators produce their values...","options":["All at once up front","Lazily, one at a time","Only as a list","Randomly"],"correctIndex":1},{"question":"What is (x * x for x in range(3))?","options":["A list","A tuple","A generator expression","A set"],"correctIndex":2},{"question":"Calling next() on an exhausted generator raises...","options":["ValueError","StopIteration","IndexError","KeyError"],"correctIndex":1},{"question":"The main advantage of generators is...","options":["They are always faster","They use less memory by computing on demand","They sort data","They prevent errors"],"correctIndex":1}]),
  },
  {
    slug: "py-decorators",
    title: "Decorators",
    order: 21,
    level: "advanced",
    exerciseType: "code",
    theory: `# Decorators

A decorator is a function that **wraps another function** to add behavior — without changing the wrapped function's code. They power logging, timing, access control, and caching across real Python codebases.

## Functions Are First-Class

In Python, functions are objects: you can pass them around and return them from other functions.

\`\`\`python
def greet():
    return "hi"

f = greet       # assign the function (no parentheses)
print(f())      # "hi"
\`\`\`

## Building a Decorator

A decorator takes a function, defines an inner \`wrapper\` that runs extra code around it, and returns the wrapper:

\`\`\`python
def shout(func):
    def wrapper():
        result = func()
        return result.upper() + "!"
    return wrapper

def greet():
    return "hello"

greet = shout(greet)
print(greet())      # "HELLO!"
\`\`\`

## The @ Syntax

Python gives you clean shorthand. \`@shout\` above a definition means exactly \`greet = shout(greet)\`:

\`\`\`python
@shout
def greet():
    return "hello"
\`\`\`

## Handling Arguments

Real wrappers accept \`*args, **kwargs\` so they work with any function, and \`functools.wraps\` preserves the original function's name and docstring:

\`\`\`python
import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
\`\`\`

Decorators rely on **closures** — the inner \`wrapper\` remembers \`func\` from the enclosing scope.`,
    exercisePrompt: "Write a decorator called announce that prints 'Starting...' before the function runs and 'Done!' after. Apply it with @announce to a function add(a, b) that returns a + b, then call add(2, 3) and print the result.",
    starterCode: `def announce(func):
    def wrapper(*args, **kwargs):
        # print "Starting..." then call func, then print "Done!"
        pass
    return wrapper

@announce
def add(a, b):
    return a + b

print(add(2, 3))
`,
    language: "python",
    learningObjectives: JSON.stringify(["Explain that functions are first-class objects","Describe what a decorator does and why it is useful","Write a decorator using a wrapper function and closure","Use the @ syntax","Forward arguments with *args/**kwargs and preserve metadata with functools.wraps"]),
    quiz: JSON.stringify([{"question":"A decorator is a function that...","options":["Takes a function and returns a (usually wrapped) function","Deletes a function","Renames variables","Imports modules"],"correctIndex":0},{"question":"@timer above 'def work():' is shorthand for...","options":["work = timer","timer(work())","work = timer(work)","import timer"],"correctIndex":2},{"question":"What does functools.wraps preserve?","options":["The wrapper's speed","The original function's name and docstring","Global variables","The return value"],"correctIndex":1},{"question":"Decorators depend on which concept?","options":["Inheritance","Closures (functions remembering enclosing scope)","Recursion","Threads"],"correctIndex":1},{"question":"Why use *args, **kwargs in the wrapper?","options":["To make it faster","So the wrapper works with any function signature","To sort arguments","They are required syntax"],"correctIndex":1}]),
  },
  {
    slug: "py-type-hints",
    title: "Type Hints & Dataclasses",
    order: 22,
    level: "advanced",
    exerciseType: "code",
    theory: `# Type Hints & Dataclasses

As programs grow, **type hints** make your intent explicit and let editors catch bugs before you run the code. **Dataclasses** then remove the boilerplate of writing classes that mostly hold data.

## Type Hints

Annotate parameters and return values with \`: type\` and \`-> type\`:

\`\`\`python
def greet(name: str, times: int) -> str:
    return (name + " ") * times
\`\`\`

Hints are **not enforced at runtime** — Python will not stop you from passing the wrong type. They are documentation and a signal for tools like \`mypy\` and your IDE, which use them to flag mistakes.

## The typing Module

For collections and optional values, use built-in generics and \`Optional\`:

\`\`\`python
def total(prices: list[float]) -> float:
    return sum(prices)

from typing import Optional
def find_user(uid: int) -> Optional[str]:   # returns str OR None
    ...
\`\`\`

\`Optional[str]\` is shorthand for "a str or None".

## Dataclasses

Writing a class just to store fields means repetitive \`__init__\` and \`__repr__\` code. The \`@dataclass\` decorator generates them for you:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(3, 5)
print(p)          # Point(x=3, y=5)  — readable __repr__ for free
print(p.x)        # 3
\`\`\`

You get a constructor, a clean string representation, and equality comparison automatically — far less boilerplate, fewer bugs.`,
    exercisePrompt: "Create a dataclass called Book with fields title (str), author (str), and pages (int). Create a Book instance, print it (notice the auto-generated repr), and write a function summary(book: Book) -> str that returns a one-line description using type hints.",
    starterCode: `from dataclasses import dataclass

@dataclass
class Book:
    # add the three fields with type hints
    pass

def summary(book: Book) -> str:
    return ""

b = Book("Dune", "Herbert", 412)
print(b)
print(summary(b))
`,
    language: "python",
    learningObjectives: JSON.stringify(["Add type hints to parameters and return values","Explain that hints are not enforced at runtime","Use list[...] and Optional for richer hints","Reduce boilerplate with @dataclass","Read the auto-generated __init__ and __repr__"]),
    quiz: JSON.stringify([{"question":"In 'def f(x: int) -> str:', what is int?","options":["The return type","A type hint for the parameter x","A default value","A variable"],"correctIndex":1},{"question":"Are Python type hints enforced at runtime?","options":["Yes, always","No, they are not enforced by the interpreter","Only for integers","Only inside classes"],"correctIndex":1},{"question":"What does Optional[int] mean?","options":["A required int","An int or None","A list of ints","A positive int"],"correctIndex":1},{"question":"What does @dataclass auto-generate?","options":["A web server","__init__ and __repr__ methods","Type checking","A database table"],"correctIndex":1},{"question":"Which tool uses type hints to catch bugs before running?","options":["pip","mypy","venv","print"],"correctIndex":1}]),
  },
  {
    slug: "py-regex",
    title: "Regular Expressions",
    order: 23,
    level: "advanced",
    exerciseType: "code",
    theory: `# Regular Expressions

A regular expression (regex) is a pattern for matching text. With Python's built-in \`re\` module you can validate input, search, and extract data that simple string methods can't handle.

## Getting Started

Always write patterns as **raw strings** (\`r"..."\`) so backslashes are treated literally:

\`\`\`python
import re

text = "Order 1234 shipped on 2026-06-05"
match = re.search(r"\\d+", text)   # find the first run of digits
print(match.group())               # "1234"
\`\`\`

## Core Functions

\`\`\`python
re.search(pattern, text)    # first match anywhere (or None)
re.findall(pattern, text)   # list of ALL matches
re.sub(pattern, repl, text) # replace matches with repl
\`\`\`

## Common Metacharacters

| Pattern | Matches |
|---------|---------|
| \`\\d\`    | any digit (0-9) |
| \`\\w\`    | a word character (letter, digit, _) |
| \`\\s\`    | whitespace |
| \`.\`     | any character |
| \`+\`     | one or more of the previous |
| \`*\`     | zero or more |
| \`?\`     | optional (zero or one) |

\`\`\`python
emails = re.findall(r"\\w+@\\w+\\.\\w+", "a@x.com b@y.org")
print(emails)   # ['a@x.com', 'b@y.org']
\`\`\`

## Groups

Parentheses **capture** parts of a match so you can pull them out:

\`\`\`python
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "2026-06-05")
print(m.group(1))   # "2026"  — the first captured group
\`\`\`

Regex is powerful but easy to overuse — for simple cases, \`str\` methods like \`startswith\` are clearer.`,
    exercisePrompt: "Given the text 'Call 555-1234 or 555-9876 today', use re.findall with a pattern to extract all phone numbers in the form ###-####. Print the list of matches.",
    starterCode: `import re

text = "Call 555-1234 or 555-9876 today"

# Pattern: three digits, a dash, four digits
numbers = re.findall(r"", text)

print(numbers)
`,
    language: "python",
    learningObjectives: JSON.stringify(["Use the re module with raw-string patterns","Apply search, findall, and sub","Recognize common metacharacters (\\d, \\w, \\s, +, *, ?)","Capture parts of a match with groups","Know when plain string methods are clearer than regex"]),
    quiz: JSON.stringify([{"question":"What does \\d match?","options":["Any letter","Any digit","A space","Any character"],"correctIndex":1},{"question":"What does re.findall return?","options":["The first match only","A list of all matches","True or False","The match count"],"correctIndex":1},{"question":"Why write patterns as r\"...\" (raw strings)?","options":["They run faster","So backslashes are treated literally","They use less memory","It is required for all strings"],"correctIndex":1},{"question":"What does re.sub do?","options":["Splits text","Replaces matches with new text","Counts matches","Sorts text"],"correctIndex":1},{"question":"What does the + quantifier mean?","options":["Zero or one","Exactly one","One or more of the previous","Add numbers"],"correctIndex":2}]),
  },
  {
    slug: "py-testing",
    title: "Testing Your Code",
    order: 24,
    level: "advanced",
    exerciseType: "code",
    theory: `# Testing Your Code

Professional code is tested code. **Automated tests** verify your functions behave correctly and instantly catch regressions when you change something. This is what separates hobby scripts from production software.

## The Simplest Test: assert

\`assert\` checks that a condition is \`True\`; if it's \`False\`, it raises \`AssertionError\`:

\`\`\`python
def add(a, b):
    return a + b

assert add(2, 3) == 5      # passes silently
assert add(-1, 1) == 0     # passes
assert add(2, 2) == 5      # AssertionError!
\`\`\`

## The AAA Pattern

Good tests follow **Arrange–Act–Assert**: set up the inputs, run the code, then check the result.

\`\`\`python
def test_add():
    a, b = 2, 3            # Arrange
    result = add(a, b)     # Act
    assert result == 5     # Assert
\`\`\`

## pytest

\`pytest\` is the most popular testing tool. You write functions named \`test_*\`, use plain \`assert\`, and run \`pytest\` in the terminal — it discovers and runs every test, reporting pass/fail:

\`\`\`python
# test_math.py
def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-5, 2) == -3
\`\`\`

## unittest

Python's built-in framework groups tests in classes that subclass \`unittest.TestCase\`:

\`\`\`python
import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
\`\`\`

Write tests for the **normal case, edge cases, and error cases**. A function without a test is a function you only hope works.`,
    exercisePrompt: "You are given a function is_even(n). Write three assert-based tests following the AAA idea: check that is_even(4) is True, is_even(7) is False, and is_even(0) is True. If all asserts pass, print 'All tests passed!'.",
    starterCode: `def is_even(n):
    return n % 2 == 0

# Write three assert statements testing is_even

print("All tests passed!")
`,
    language: "python",
    learningObjectives: JSON.stringify(["Explain why automated testing matters","Use assert to verify conditions","Structure tests with the Arrange-Act-Assert pattern","Write pytest test_ functions","Recognize unittest.TestCase and assertEqual"]),
    quiz: JSON.stringify([{"question":"In pytest, test functions must start with...","options":["check_","test_","assert_","run_"],"correctIndex":1},{"question":"What does 'assert' do?","options":["Prints a value","Raises AssertionError if the condition is False","Defines a function","Imports a module"],"correctIndex":1},{"question":"unittest test classes subclass...","options":["object","unittest.TestCase","pytest.Test","TestRunner"],"correctIndex":1},{"question":"What does AAA stand for in testing?","options":["Add, Apply, Assert","Arrange, Act, Assert","Assert, Action, Answer","Allocate, Act, Assess"],"correctIndex":1},{"question":"A failing assert raises which error?","options":["ValueError","AssertionError","TypeError","SyntaxError"],"correctIndex":1}]),
  },
];
