import { PrismaClient } from "@prisma/client";

export async function seedHtmlCssCourse(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { slug: "html-css" },
    update: {},
    create: {
      slug: "html-css",
      title: "HTML & CSS",
      description: "Master the building blocks of the web. From semantic HTML to modern CSS layouts, build beautiful, responsive websites.",
      language: "html",
      icon: "\u{1F310}",
      order: 1,
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
    slug: "introduction-web-development",
    title: "Introduction to Web Development",
    order: 1,
    level: "beginner",
    exerciseType: "code",
    theory: `# Introduction to Web Development

Welcome to the world of web development! By the end of this course, you will be able to build beautiful, responsive websites from scratch.

## What is the Web?

The World Wide Web is a system of interconnected documents and resources accessed via the Internet. When you visit a website, your browser sends a request to a server, which responds with HTML, CSS, and JavaScript files that your browser renders into a visual page.

## The Three Core Technologies

**HTML (HyperText Markup Language)** gives structure to web pages. It defines headings, paragraphs, links, images, and all the content you see on a page.

**CSS (Cascading Style Sheets)** controls the presentation. It handles colors, fonts, layouts, spacing, and responsive design -- making your pages look good on any device.

**JavaScript** adds interactivity. It handles user clicks, form submissions, animations, and dynamic content updates.

## Tools You Need

To start building websites, you need just two things:

1. **A text editor** -- VS Code is the most popular choice for web development
2. **A web browser** -- Chrome, Firefox, or Edge all have excellent developer tools

That is it! No special software required. You can write HTML and CSS in any text editor and open the file in any browser.

## Your First HTML Page

Every HTML page starts with a basic structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
\`\`\`

Save this as \`index.html\` and open it in your browser. You have just created a web page!

## How Browsers Work

When you open an HTML file, the browser parses the markup and constructs the Document Object Model (DOM) -- a tree representation of your page. It then applies any CSS styles and executes JavaScript to produce the final rendered output.

## Why Learn HTML & CSS First?

HTML and CSS are the foundation of everything on the web. Before you can build web apps, games, or full-stack applications, you need to understand how to structure content and present it visually. These two languages are also the easiest to get started with -- you see immediate results in the browser.`,
    exercisePrompt: "Create a complete HTML page with a title, a main heading that says 'Welcome to Web Development', and a paragraph explaining what you want to learn.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
</head>
<body>
  <!-- Add your content here -->

</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Explain what the World Wide Web is and how it works","Distinguish between HTML, CSS, and JavaScript","Create a basic HTML page with proper structure","Open and view an HTML file in a browser"]),
    quiz: JSON.stringify([{"question":"What does HTML stand for?","options":["HyperText Markup Language","High-Level Text Manipulation Language","HyperTransfer Markup Language","Home Tool Markup Language"],"correctIndex":0},{"question":"Which technology is responsible for the visual styling of a web page?","options":["HTML","CSS","JavaScript","Node.js"],"correctIndex":1},{"question":"What is the DOCTYPE declaration used for?","options":["To tell the browser which version of HTML to expect","To define the document title","To link a CSS file","To create a new document type"],"correctIndex":0},{"question":"Which tag contains the visible content of an HTML page?","options":["<head>","<body>","<html>","<title>"],"correctIndex":1},{"question":"What file extension should an HTML file have?","options":[".htm",".html",".txt",".web"],"correctIndex":1}]),
  },
  {
    slug: "html-basics",
    title: "HTML Basics",
    order: 2,
    level: "beginner",
    exerciseType: "code",
    theory: `# HTML Basics

HTML is built on a foundation of tags and elements. Every piece of content on a web page is wrapped in HTML tags that tell the browser what kind of content it is.

## Document Structure

Every HTML document follows this basic skeleton:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
</head>
<body>
  <!-- Visible content goes here -->
</body>
</html>
\`\`\`

The \`<head>\` contains metadata -- information about the page that is not displayed directly. The \`<body>\` contains everything visible to users.

## Tags and Elements

An **element** consists of an opening tag, content, and a closing tag:

\`\`\`html
<p>This is a paragraph element.</p>
\`\`\`

Some elements are **self-closing** -- they have no content:

\`\`\`html
<img src="photo.jpg" alt="Description">
<br>
<hr>
\`\`\`

## Attributes

Attributes provide additional information about elements. They go inside the opening tag:

\`\`\`html
<a href="https://example.com" target="_blank">Visit Example</a>
<img src="logo.png" alt="Company Logo" width="200">
\`\`\`

Common attributes include \`class\`, \`id\`, \`src\`, \`href\`, \`alt\`, and \`style\`.

## Headings

HTML provides six levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):

\`\`\`html
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h4>Minor Heading</h4>
<h5>Small Heading</h5>
<h6>Tiny Heading</h6>
\`\`\`

Search engines use headings to understand your content structure. Always use them in hierarchical order and never skip levels.

## Paragraphs

The \`<p>\` tag defines a paragraph. Browsers automatically add margin space between paragraphs:

\`\`\`html
<p>This is a paragraph of text. Browsers will wrap the text automatically based on the container width.</p>
<p>This is another paragraph. Notice the space between them.</p>
\`\`\`

## Comments

Comments help you document your code and are not displayed in the browser:

\`\`\`html
<!-- This is an HTML comment -->
<!--
  Multi-line
  comments
  work too
-->
\`\`\`

## Whitespace in HTML

HTML collapses multiple spaces and line breaks into a single space. If you want to preserve whitespace, use the \`<pre>\` tag or CSS.`,
    exercisePrompt: "Create a complete HTML page with a proper document structure, an h1 heading with your name, an h2 section titled 'About Me', and two paragraphs describing yourself.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Me</title>
</head>
<body>
  <!-- Add your content here -->

</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Write a complete HTML document structure","Use heading tags (h1-h6) appropriately","Create paragraphs with the p tag","Add comments to HTML code","Use attributes on HTML elements"]),
    quiz: JSON.stringify([{"question":"Which tag pair wraps the visible content of an HTML page?","options":["<head></head>","<body></body>","<main></main>","<content></content>"],"correctIndex":1},{"question":"Which heading tag represents the most important heading?","options":["<heading>","<h1>","<h6>","<header>"],"correctIndex":1},{"question":"How do you write an HTML comment?","options":["// comment","/* comment */","<!-- comment -->","# comment"],"correctIndex":2},{"question":"What does the `lang` attribute on the `<html>` tag specify?","options":["The programming language used","The natural language of the document","The length of the document","The language of the browser"],"correctIndex":1},{"question":"Which meta tag is essential for responsive design?","options":["<meta charset=\"UTF-8\">","<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">","<meta name=\"description\" content=\"...\">","<meta http-equiv=\"refresh\" content=\"30\">"],"correctIndex":1}]),
  },
  {
    slug: "html-elements",
    title: "HTML Elements",
    order: 3,
    level: "beginner",
    exerciseType: "code",
    theory: `# HTML Elements

Now that you understand the basics, let us explore the most commonly used HTML elements for building rich web pages.

## Text Formatting

HTML provides tags to give text semantic meaning and visual styling:

\`\`\`html
<strong>Bold text with importance</strong>
<b>Bold text only</b>
<em>Italic text with emphasis</em>
<i>Italic text only</i>
<u>Underlined text</u>
<mark>Highlighted text</mark>
<small>Smaller text</small>
<del>Deleted text (strikethrough)</del>
<ins>Inserted text</ins>
<sub>Subscript</sub>
<sup>Superscript</sup>
<code>Inline code</code>
\`\`\`

Use \`<strong>\` and \`<em>\` over \`<b>\` and \`<i>\` because they add semantic meaning for accessibility and SEO.

## Links

The anchor tag \`<a>\` creates hyperlinks to other pages or resources:

\`\`\`html
<a href="https://example.com">Absolute link</a>
<a href="/about">Relative link</a>
<a href="#section-id">Link to a section on this page</a>
<a href="mailto:hello@example.com">Email link</a>
<a href="file.pdf" download>Download link</a>
<a href="page.html" target="_blank">Open in new tab</a>
\`\`\`

The \`href\` attribute specifies the destination URL. Always add \`target="_blank"\` for external links that should open in a new tab.

## Images

The \`<img>\` tag embeds images. It is a self-closing tag:

\`\`\`html
<img src="photo.jpg" alt="A beautiful sunset over the ocean" width="800" height="600">
<img src="icon.svg" alt="Settings icon" class="icon">
\`\`\`

The \`alt\` attribute is crucial for accessibility -- it describes the image for screen readers and appears when the image fails to load.

## Lists

**Unordered lists** display items with bullet points:

\`\`\`html
<ul>
  <li>Apples</li>
  <li>Bananas</li>
  <li>Cherries</li>
</ul>
\`\`\`

**Ordered lists** display items with numbers:

\`\`\`html
<ol>
  <li>Preheat oven to 350°F</li>
  <li>Mix dry ingredients</li>
  <li>Bake for 30 minutes</li>
</ol>
\`\`\`

You can change the numbering style with the \`type\` attribute: \`A\`, \`a\`, \`I\`, \`i\`, \`1\`.

**Nested lists** are lists inside list items:

\`\`\`html
<ul>
  <li>Fruits
    <ul>
      <li>Tropical</li>
      <li>Citrus</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>
\`\`\`

## Divs and Spans

\`<div>\` is a block-level container used for grouping and layout. \`<span>\` is an inline container for styling small portions of text:

\`\`\`html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here. <span class="highlight">This text is highlighted</span> within the paragraph.</p>
</div>
\`\`\`

Divs are essential for CSS layouts, while spans are perfect for inline styling without breaking the text flow.`,
    exercisePrompt: "Create an HTML page with a recipe. Include an h1 title, an image of the dish, an unordered list of ingredients, an ordered list of steps, a link to the original recipe, and use at least two text formatting tags.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Recipe</title>
</head>
<body>
  <!-- Build your recipe page here -->

</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Use text formatting tags (strong, em, mark, etc.)","Create links with the anchor tag","Embed images with proper attributes","Build ordered and unordered lists","Use div and span for grouping content"]),
    quiz: JSON.stringify([{"question":"Which attribute specifies the destination URL for a link?","options":["src","href","link","ref"],"correctIndex":1},{"question":"What does the `alt` attribute on an image provide?","options":["Alternative text for accessibility","The image file path","The image width","The image alignment"],"correctIndex":0},{"question":"Which tag creates an ordered (numbered) list?","options":["<ul>","<ol>","<li>","<list>"],"correctIndex":1},{"question":"What is the difference between <div> and <span>?","options":["<div> is block-level, <span> is inline","<div> is inline, <span> is block-level","They are identical","<div> is for text, <span> is for images"],"correctIndex":0},{"question":"How do you open a link in a new browser tab?","options":["target=\"_new\"","target=\"_blank\"","rel=\"external\"","new=\"tab\""],"correctIndex":1}]),
  },
  {
    slug: "forms",
    title: "Forms & Input",
    order: 4,
    level: "beginner",
    exerciseType: "code",
    theory: `# Forms & Input

Forms are how users interact with web pages -- submitting data, signing up, searching, and more. Understanding forms is essential for building any interactive website.

## The Form Element

The \`<form>\` tag wraps all input elements and defines how data is submitted:

\`\`\`html
<form action="/submit" method="POST">
  <!-- Input elements go here -->
  <button type="submit">Submit</button>
</form>
\`\`\`

- \`action\`: URL where the form data is sent
- \`method\`: HTTP method (\`GET\` or \`POST\`)

## Input Types

The \`<input>\` element is the most versatile form control. Its behavior changes based on the \`type\` attribute:

\`\`\`html
<!-- Text input -->
<input type="text" name="username" placeholder="Enter your username">

<!-- Password -->
<input type="password" name="password">

<!-- Email (validates email format) -->
<input type="email" name="email">

<!-- Number -->
<input type="number" name="age" min="0" max="150">

<!-- Date -->
<input type="date" name="birthday">

<!-- Checkbox -->
<input type="checkbox" name="subscribe" id="subscribe">
<label for="subscribe">Subscribe to newsletter</label>

<!-- Radio buttons -->
<input type="radio" name="gender" value="male" id="male">
<label for="male">Male</label>
<input type="radio" name="gender" value="female" id="female">
<label for="female">Female</label>

<!-- File upload -->
<input type="file" name="avatar" accept="image/*">

<!-- Range slider -->
<input type="range" name="volume" min="0" max="100">

<!-- Color picker -->
<input type="color" name="accent">

<!-- Hidden field -->
<input type="hidden" name="userId" value="123">
\`\`\`

## Labels

Labels make forms accessible. Clicking a label focuses its associated input:

\`\`\`html
<!-- Method 1: for attribute -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Method 2: Wrap the input -->
<label>
  <input type="checkbox" name="terms">
  I agree to the terms
</label>
\`\`\`

## Buttons

\`\`\`html
<button type="submit">Submit Form</button>
<button type="reset">Reset Form</button>
<button type="button" onclick="alert('Clicked!')">Click Me</button>
\`\`\`

## Textarea

For multi-line text input:

\`\`\`html
<textarea name="message" rows="5" cols="40" placeholder="Write your message here..."></textarea>
\`\`\`

## Select Menus

Dropdown menus allow users to choose from options:

\`\`\`html
<label for="country">Country:</label>
<select id="country" name="country">
  <option value="">-- Select a country --</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
  <option value="au">Australia</option>
</select>
\`\`\`

For multi-select, add the \`multiple\` attribute.

## Form Validation

HTML5 provides built-in validation without JavaScript:

\`\`\`html
<input type="text" required minlength="3" maxlength="20" pattern="[A-Za-z]+">
\`\`\`

- \`required\`: field must be filled
- \`minlength\` / \`maxlength\`: character limits
- \`min\` / \`max\`: value range for numbers and dates
- \`pattern\`: regex pattern for validation

## Form Submission

When a user submits a form, the browser collects all named inputs and sends them to the \`action\` URL as key-value pairs (name=value).`,
    exercisePrompt: "Create a sign-up form with fields for: full name (text), email (email), password (password), date of birth (date), country (select with at least 3 options), and a submit button. All required fields must use the required attribute.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up</title>
</head>
<body>
  <h1>Create an Account</h1>

  <form action="#" method="POST">
    <!-- Add your form fields here -->

  </form>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Build a form with various input types","Connect labels to inputs using the for attribute","Create select menus and textareas","Use HTML5 validation attributes","Understand form submission and HTTP methods"]),
    quiz: JSON.stringify([{"question":"Which attribute on a form specifies where to send the data?","options":["method","action","target","enctype"],"correctIndex":1},{"question":"What input type creates a checkbox?","options":["type='check'","type='checkbox'","type='toggle'","type='option'"],"correctIndex":1},{"question":"How do you make a form field mandatory?","options":["mandatory","required","obligatory","required='true'"],"correctIndex":1},{"question":"What is the purpose of the <label> element?","options":["To display a heading for the form","To associate text with an input for accessibility","To create a button","To display error messages"],"correctIndex":1},{"question":"Which element is used for selecting from a dropdown?","options":["<input type='radio'>","<input type='checkbox'>","<select>","<input type='option'>"],"correctIndex":2}]),
  },
  {
    slug: "tables",
    title: "Tables",
    order: 5,
    level: "intermediate",
    exerciseType: "code",
    theory: `# HTML Tables

Tables display data in rows and columns. While they were once used for page layout, modern HTML uses tables only for tabular data -- like spreadsheets in the browser.

## Basic Table Structure

\`\`\`html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>25</td>
      <td>New York</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>30</td>
      <td>London</td>
    </tr>
  </tbody>
</table>
\`\`\`

- \`<table>\`: the container
- \`<tr>\`: table row
- \`<th>\`: table header cell (bold and centered by default)
- \`<td>\`: table data cell
- \`<thead>\`: groups the header rows
- \`<tbody>\`: groups the body rows
- \`<tfoot>\`: groups footer rows

## Colspan and Rowspan

Cells can span multiple columns or rows:

\`\`\`html
<table>
  <tr>
    <th>Name</th>
    <th colspan="2">Contact</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>alice@email.com</td>
    <td>+1 555-0100</td>
  </tr>
  <tr>
    <td rowspan="2">Bob</td>
    <td>bob@email.com</td>
    <td>+1 555-0101</td>
  </tr>
  <tr>
    <td>bob.work@email.com</td>
    <td>+1 555-0102</td>
  </tr>
</table>
\`\`\`

## Styling Tables with CSS

Tables look plain by default. Add CSS for visual polish:

\`\`\`css
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
  font-weight: bold;
}
tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr:hover {
  background-color: #f1f1f1;
}
caption {
  font-weight: bold;
  margin-bottom: 8px;
}
\`\`\`

## Caption and Summary

Add a caption to describe the table purpose:

\`\`\`html
<table>
  <caption>Employee Contact Directory</caption>
  <!-- rows here -->
</table>
\`\`\`

## Accessibility in Tables

Use the \`scope\` attribute on \`<th>\` elements to clarify whether they apply to a column or row:

\`\`\`html
<th scope="col">Name</th>
<th scope="row">Alice</th>
\`\`\`

For complex tables, use the \`headers\` attribute to associate data cells with their header cells explicitly.

## When to Use Tables

Use tables for: financial data, schedules, comparison charts, pricing grids, and any data that belongs in rows and columns. Do NOT use tables for: page layouts, navigation bars, or visual alignment. CSS Grid and Flexbox handle those much better.`,
    exercisePrompt: "Create a table showing a weekly class schedule. Include columns for Day, Time, Subject, and Room. Use colspan to merge cells where a class spans multiple time slots, and add alternating row colors with CSS.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Schedule</title>
  <style>
    /* Add your table styles here */
  </style>
</head>
<body>
  <h1>Weekly Class Schedule</h1>
  <table>
    <!-- Build your table here -->
  </table>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Create tables with proper structural elements (thead, tbody, tfoot)","Use colspan and rowspan to merge cells","Style tables with CSS for readability","Apply accessibility best practices to tables"]),
    quiz: JSON.stringify([{"question":"Which element wraps the main content rows of a table?","options":["<thead>","<tbody>","<tfoot>","<tgroup>"],"correctIndex":1},{"question":"What does `colspan=\"2\"` do?","options":["Merges 2 columns into one cell","Merges 2 rows into one cell","Creates 2 columns","Sets the column width to 2 pixels"],"correctIndex":0},{"question":"Which CSS property removes the gap between table cell borders?","options":["border-spacing: 0","border-collapse: collapse","cell-spacing: 0","table-gap: 0"],"correctIndex":1},{"question":"What is the <caption> element used for?","options":["To describe the table purpose for accessibility","To create a title row in the table","To add a footer to the table","To caption images inside the table"],"correctIndex":0},{"question":"What does the `scope` attribute on <th> specify?","options":["Whether the header applies to a column or row","The width of the header cell","The scope of the table","The visibility of the header"],"correctIndex":0}]),
  },
  {
    slug: "semantic-html",
    title: "Semantic HTML",
    order: 6,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Semantic HTML

Semantic HTML means using HTML elements that describe their meaning -- both to the browser and to the developer. Instead of wrapping everything in \`<div>\`, semantic elements tell a story about your content.

## Why Semantics Matter

**Accessibility**: Screen readers and assistive technologies rely on semantic structure to navigate pages. A user can jump from the \`<nav>\` to the \`<main>\` content to the \`<footer>\` using keyboard shortcuts.

**SEO**: Search engines give higher ranking to pages with clear semantic structure. A \`<nav>\` element tells Google "this is navigation" much better than a \`<div class="nav">\`.

**Maintainability**: Code with semantic elements is easier to read, understand, and modify. The structure communicates intent.

## Key Semantic Elements

### Header

\`<header>\` represents introductory content -- typically a logo, navigation, and heading:

\`\`\`html
<header>
  <h1>My Website</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
\`\`\`

### Navigation

\`<nav>\` wraps the primary navigation links. Use it for main menus, not for every group of links.

### Main

\`<main>\` contains the primary content of the page. There should be only one \`<main>\` per page:

\`\`\`html
<main>
  <h1>Welcome to Our Site</h1>
  <p>This is the main content area.</p>
</main>
\`\`\`

### Section

\`<section>\` groups related content together. Each section should have a heading:

\`\`\`html
<section>
  <h2>Our Services</h2>
  <p>We offer web design, development, and consulting.</p>
</section>
\`\`\`

### Article

\`<article>\` represents a self-contained piece of content -- a blog post, news article, forum post, or product card:

\`\`\`html
<article>
  <h2>How to Learn HTML</h2>
  <p>Published on May 1, 2026</p>
  <p>HTML is the foundation of web development...</p>
</article>
\`\`\`

### Aside

\`<aside>\` contains content indirectly related to the main content -- sidebars, pull quotes, related links:

\`\`\`html
<aside>
  <h3>Related Articles</h3>
  <ul>
    <li><a href="#">CSS Flexbox Guide</a></li>
    <li><a href="#">JavaScript Basics</a></li>
  </ul>
</aside>
\`\`\`

### Footer

\`<footer>\` contains closing information -- copyright, contact info, sitemap links:

\`\`\`html
<footer>
  <p>&copy; 2026 My Website. All rights reserved.</p>
</footer>
\`\`\`

### Figure and Figcaption

\`<figure>\` wraps media (images, diagrams, code snippets) with an optional caption:

\`\`\`html
<figure>
  <img src="diagram.png" alt="Architecture diagram">
  <figcaption>Figure 1: System Architecture Overview</figcaption>
</figure>
\`\`\`

## Building a Semantic Page

Combine these elements into a meaningful document outline. The structure should make sense even without CSS -- that is how you know your semantics are correct.`,
    exercisePrompt: "Build a complete blog page layout using semantic HTML. Include a header with site title and nav, a main area with two articles (each with a heading and paragraph), an aside with related links, and a footer with copyright. Do NOT use any div elements.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
</head>
<body>
  <!-- Build your semantic layout here -->

</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Use semantic HTML5 elements (header, nav, main, section, article, aside, footer)","Explain the accessibility and SEO benefits of semantic HTML","Create a meaningful document outline without divs","Use figure and figcaption for media content"]),
    quiz: JSON.stringify([{"question":"Which element represents self-contained content that could be independently distributed?","options":["<section>","<article>","<div>","<content>"],"correctIndex":1},{"question":"How many <main> elements should a page have?","options":["None","One","One per section","As many as needed"],"correctIndex":1},{"question":"What is the benefit of using semantic HTML over divs?","options":["Better accessibility, SEO, and code readability","Faster page load times","More styling options","Smaller file sizes"],"correctIndex":0},{"question":"Which element is best for a sidebar with related content?","options":["<sidebar>","<aside>","<nav>","<section>"],"correctIndex":1},{"question":"What is the <figcaption> element used for?","options":["To add a caption to a <figure> element","To create a figure number","To style a figure","To link to the figure source"],"correctIndex":0}]),
  },
  {
    slug: "css-basics",
    title: "CSS Basics",
    order: 7,
    level: "intermediate",
    exerciseType: "code",
    theory: `# CSS Basics

CSS (Cascading Style Sheets) is the language that brings your HTML to life. With CSS, you control colors, fonts, spacing, layout, and visual design.

## How CSS Works

CSS uses **selectors** to target HTML elements and **declarations** to style them:

\`\`\`css
selector {
  property: value;
}
\`\`\`

You can add CSS to your page three ways:
- **Inline**: \`style="color: red;"\` on an HTML element
- **Internal**: \`<style>\` tag in the \`<head>\`
- **External**: a separate \`.css\` file linked via \`<link>\`

## Colors

CSS supports several color formats:

\`\`\`css
p { color: red; }                 /* Named colors */
h1 { color: #ff5733; }           /* Hex codes */
h2 { color: rgb(255, 87, 51); }  /* RGB */
h3 { color: rgba(255, 87, 51, 0.5); } /* RGB with opacity */
h4 { color: hsl(9, 100%, 60%); } /* HSL */
\`\`\`

Hex codes are the most common. They start with \`#\` followed by 6 hexadecimal digits (RRGGBB).

## Fonts

Control typography with font properties:

\`\`\`css
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.6;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
}
\`\`\`

## CSS Units

\`\`\`css
.px-unit    { font-size: 16px; }    /* Pixels - absolute */
.em-unit    { padding: 2em; }       /* Relative to parent font-size */
.rem-unit   { margin: 1.5rem; }     /* Relative to root font-size (html) */
.percent    { width: 50%; }         /* Percentage of parent */
.vw-unit    { width: 100vw; }       /* 1% of viewport width */
.vh-unit    { height: 100vh; }      /* 1% of viewport height */
\`\`\`

Use \`rem\` for font sizes (respects user preferences), \`em\` for padding and margin (scales with the element), and \`%\` for fluid layouts.

## Inheritance

Some CSS properties are **inherited** -- child elements automatically get the value from their parent:

\`\`\`css
body {
  color: #333;            /* Inherited - all text will be #333 */
  font-family: sans-serif; /* Inherited */
  padding: 20px;          /* NOT inherited - only the body gets padding */
}
\`\`\`

Typography properties (color, font-*, line-height, text-*) are typically inherited. Layout properties (margin, padding, border, width, height) are not.

## The Cascade

CSS stands for Cascading Style Sheets because styles cascade from multiple sources. The order of priority (highest to lowest) is:

1. Inline styles
2. Internal styles (in order of appearance)
3. External stylesheets (in order of appearance)

When two rules have the same specificity, the one that appears last wins.`,
    exercisePrompt: "Create an HTML page about your favorite hobby. Use an internal <style> tag to set: a custom font family, heading colors using hex values, a background color for the body, and styled paragraphs with proper font-size, line-height, and text alignment.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Hobby</title>
  <style>
    /* Add your CSS here */
  </style>
</head>
<body>
  <h1>My Favorite Hobby</h1>
  <h2>Why I Love It</h2>
  <p>Write about your hobby here...</p>
  <h2>How to Get Started</h2>
  <p>Tips for beginners...</p>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Apply CSS using inline, internal, and external methods","Use color values (hex, rgb, named colors)","Style text with font properties","Understand CSS units (px, em, rem, %)","Explain inheritance and the cascade"]),
    quiz: JSON.stringify([{"question":"Which CSS property changes the text color?","options":["font-color","color","text-color","foreground"],"correctIndex":1},{"question":"What does the `rem` unit base itself on?","options":["The parent element font size","The root (html) element font size","The viewport height","The pixel density of the screen"],"correctIndex":1},{"question":"Which of these CSS properties is inherited?","options":["margin","padding","color","border"],"correctIndex":2},{"question":"What happens when two CSS rules have the same specificity?","options":["The first one wins","The last one wins","Both are applied","The browser chooses randomly"],"correctIndex":1},{"question":"What is the correct syntax for a CSS rule?","options":["selector { property: value; }","selector = { property: value; }","selector: { property -> value; }","{ selector: property: value; }"],"correctIndex":0}]),
  },
  {
    slug: "selectors",
    title: "CSS Selectors",
    order: 8,
    level: "intermediate",
    exerciseType: "code",
    theory: `# CSS Selectors

Selectors are the most powerful part of CSS. They determine which elements get styled. Mastering selectors means writing cleaner, more maintainable stylesheets.

## Basic Selectors

\`\`\`css
/* Type selector - targets all <p> elements */
p { color: blue; }

/* Class selector - targets elements with class="highlight" */
.highlight { background: yellow; }

/* ID selector - targets the element with id="header" */
#header { font-size: 2rem; }

/* Universal selector - targets everything */
* { box-sizing: border-box; }
\`\`\`

## Attribute Selectors

Target elements based on their attributes:

\`\`\`css
/* Exact attribute match */
[type="text"] { border: 1px solid gray; }

/* Attribute contains value */
[class*="btn"] { cursor: pointer; }

/* Attribute starts with value */
[href^="https"] { color: green; }

/* Attribute ends with value */
[src$=".svg"] { padding: 5px; }

/* Attribute is in a space-separated list */
[rel~="external"] { font-style: italic; }
\`\`\`

## Pseudo-classes

Pseudo-classes style elements based on state or position:

\`\`\`css
/* Dynamic states */
a:hover { color: red; }
a:active { color: darkred; }
a:focus { outline: 2px solid blue; }
input:disabled { opacity: 0.5; }
input:checked { box-shadow: 0 0 3px green; }

/* Structural pseudo-classes */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(odd) { background: #f5f5f5; }
li:nth-child(3n) { color: red; }
p:empty { display: none; }
\`\`\`

## Pseudo-elements

Pseudo-elements style specific parts of an element:

\`\`\`css
/* First line or letter */
p::first-line { font-variant: small-caps; }
p::first-letter { font-size: 3em; float: left; }

/* Before and after - great for decoration */
.note::before { content: "\\01F4DD"; }
.link::after { content: " \\2197"; }

/* Selection highlight */
::selection { background: #ffb7b7; }
\`\`\`

## Combinators

Combinators define relationships between elements:

\`\`\`css
/* Descendant - any <span> inside a <div> */
div span { color: red; }

/* Child - direct child only */
div > p { margin: 0; }

/* Adjacent sibling - immediately after */
h2 + p { font-style: italic; }

/* General sibling - any after */
h2 ~ p { color: gray; }
\`\`\`

## Specificity

Specificity determines which rule wins when multiple rules target the same element:

1. **Inline styles** -- highest priority
2. **IDs** -- 1-0-0
3. **Classes, attributes, pseudo-classes** -- 0-1-0
4. **Elements, pseudo-elements** -- 0-0-1

\`\`\`css
#nav { }                  /* specificity: 1-0-0 */
.highlight { }            /* specificity: 0-1-0 */
p { }                     /* specificity: 0-0-1 */
p.highlight { }           /* specificity: 0-1-1 */
#nav p.highlight { }      /* specificity: 1-1-1 */
\`\`\`

Use the \`!important\` flag only as a last resort -- it breaks the cascade and makes debugging difficult.`,
    exercisePrompt: "Create an HTML page with a navigation menu (ul with 4 links) and a content section with 3 paragraphs. Use at least: one class selector, one attribute selector, one pseudo-class (:hover or :nth-child), one pseudo-element (::before or ::after), and one combinator (descendant or child).",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Selectors Demo</title>
  <style>
    /* Add your selector-based CSS here */
  </style>
</head>
<body>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
  <main>
    <h2>Welcome</h2>
    <p>First paragraph about our site.</p>
    <p>Second paragraph with more details.</p>
    <p>Third paragraph to wrap up.</p>
  </main>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Use class, ID, and attribute selectors","Apply pseudo-classes for dynamic states (hover, focus, nth-child)","Use pseudo-elements (::before, ::after) for decoration","Combine selectors with combinators","Calculate and manage CSS specificity"]),
    quiz: JSON.stringify([{"question":"What is the specificity of the selector `#nav a.highlight`?","options":["0-1-1","1-1-1","1-0-1","1-1-0"],"correctIndex":2},{"question":"Which pseudo-class selects every third element?","options":[":nth-child(3)",":nth-child(3n)",":nth-of-type(3)",":every(3)"],"correctIndex":1},{"question":"What does `p::first-line` style?","options":["The first <p> element on the page","The first line of text in each <p>","The first letter of each <p>","The first <p> in each container"],"correctIndex":1},{"question":"Which combinator selects only direct children?","options":["space",">","+","~"],"correctIndex":1},{"question":"What does the `[href^=\"https\"]` selector target?","options":["Links ending with https","Links where the href starts with https","Links containing https","Links with the https class"],"correctIndex":1}]),
  },
  {
    slug: "box-model",
    title: "The Box Model",
    order: 9,
    level: "intermediate",
    exerciseType: "code",
    theory: `# The Box Model

Every element in CSS is a rectangular box. Understanding the box model is essential for controlling layout, spacing, and sizing.

## The Four Layers

From inside to outside, every box has:

\`\`\`css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 30px;
}
\`\`\`

**Content**: the actual content (text, images, child elements)
**Padding**: transparent space around the content, inside the border
**Border**: the visible edge of the box
**Margin**: invisible space outside the border, separating elements

## Box-Sizing

By default, \`width\` and \`height\` only apply to the content box. This means adding padding or border increases the total element size:

\`\`\`css
/* Default: content-box */
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* Total width: 200 + 20*2 + 2*2 = 244px */
}

/* Better: border-box */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* Total width: 200px (padding and border are inside) */
}
\`\`\`

Always use \`border-box\` globally -- it makes sizing predictable:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

## Display Types

The \`display\` property determines how a box behaves:

\`\`\`css
/* Block - takes full width, starts on new line */
h1 { display: block; }

/* Inline - flows within text, no width/height */
span { display: inline; }

/* Inline-block - flows inline but respects box properties */
.btn { display: inline-block; }

/* None - removes element from layout */
.hidden { display: none; }
\`\`\`

## Width and Height Calculation

\`\`\`css
.element {
  box-sizing: border-box;
  width: 300px;
  padding: 15px 20px;
  border: 3px solid teal;
  margin: 10px auto;
}
\`\`\`
- Content width: 300 - (20*2) - (3*2) = 254px (with border-box)
- Total width on page: 300 + (10*2) = 320px (including margin)

## Margin Collapse

Vertical margins collapse -- adjacent margins combine into the larger one:

\`\`\`css
h1 { margin-bottom: 30px; }
h2 { margin-top: 20px; }
/* The gap between h1 and h2 is 30px, not 50px */
\`\`\`

Margin collapse only affects vertical margins on block elements. Flex and Grid items do not collapse.`,
    exercisePrompt: "Create a page with three cards side by side. Each card has a heading, a paragraph, and a button. Use the box model to: give cards consistent sizing with border-box, add padding inside cards, separate cards with margin, and add a visible border. Style the button as inline-block so padding works correctly.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Box Model Demo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
  </style>
</head>
<body>
  <h1>Our Services</h1>
  <div class="card"><h2>Web Design</h2><p>Beautiful, responsive websites.</p><button>Learn More</button></div>
  <div class="card"><h2>Development</h2><p>Full-stack web applications.</p><button>Learn More</button></div>
  <div class="card"><h2>Consulting</h2><p>Expert advice on architecture.</p><button>Learn More</button></div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Explain the four layers of the box model (content, padding, border, margin)","Use box-sizing border-box for predictable sizing","Distinguish between block, inline, and inline-block display","Understand margin collapse and how to prevent it"]),
    quiz: JSON.stringify([{"question":"What does `box-sizing: border-box` do?","options":["Includes padding and border in the element total width/height","Adds a visible border around the box","Makes the box size based on its parent","Removes padding from the box"],"correctIndex":0},{"question":"Which display type allows setting width and height while staying inline?","options":["block","inline","inline-block","flex"],"correctIndex":2},{"question":"What is margin collapse?","options":["Adjacent vertical margins combine into the larger value","Horizontal margins add together","Padding disappears when margins are present","Borders merge when elements touch"],"correctIndex":0},{"question":"With content-box, if width is 200px, padding 10px, border 2px, what is the total width?","options":["200px","210px","212px","224px"],"correctIndex":3},{"question":"Which property creates space inside an element, between content and border?","options":["margin","padding","gap","spacing"],"correctIndex":1}]),
  },
  {
    slug: "flexbox",
    title: "Flexbox",
    order: 10,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Flexbox

Flexbox is a one-dimensional layout system that distributes space and aligns content within a container. It is the go-to tool for navigation bars, card grids, centering, and responsive components.

## The Flex Container

Activate flexbox by setting \`display: flex\` on a container. Its children become **flex items**:

\`\`\`html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
\`\`\`

\`\`\`css
.container { display: flex; }
\`\`\`

## Main Axis and Cross Axis

Flexbox works along two axes:
- **Main axis** -- direction of \`flex-direction\`
- **Cross axis** -- perpendicular to main axis

\`\`\`css
.container { flex-direction: row; }      /* default: left to right */
.container { flex-direction: column; }   /* top to bottom */
.container { flex-direction: row-reverse; }
.container { flex-direction: column-reverse; }
\`\`\`

## Justify Content (main axis)

\`\`\`css
.container {
  justify-content: flex-start;    /* default */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
}
\`\`\`

## Align Items (cross axis)

\`\`\`css
.container {
  align-items: stretch;    /* default */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline;
}
\`\`\`

## Flex Wrap

\`\`\`css
.container {
  flex-wrap: nowrap;    /* default */
  flex-wrap: wrap;      /* items wrap to new lines */
  flex-wrap: wrap-reverse;
}
\`\`\`

## Gap

\`\`\`css
.container { display: flex; gap: 16px; row-gap: 10px; column-gap: 20px; }
\`\`\`

## Flex Grow, Shrink, and Basis

\`\`\`css
.item {
  flex-grow: 1;    /* can it grow? 0=no, 1=yes */
  flex-shrink: 1;  /* can it shrink? 0=no, 1=yes */
  flex-basis: auto; /* starting size */
}

/* Shorthand */
.item { flex: 1; }           /* grow:1, shrink:1, basis:0 */
.item { flex: 1 1 200px; }  /* grow:1, shrink:1, basis:200px */
.item { flex: 0 0 auto; }   /* original size */
\`\`\`

## Align Self

\`\`\`css
.item-special { align-self: flex-end; align-self: center; align-self: stretch; }
\`\`\`

## Order

\`\`\`css
.item:first-child { order: 2; }
.item:last-child { order: 1; }
/* Default order is 0. Lower order appears first. */
\`\`\``,
    exercisePrompt: "Create a navigation bar using flexbox. The nav should have: a logo on the left, 4 nav links centered, and a 'Sign Up' button on the right. Add a second row of 6 equally-sized cards that wrap responsively using flex-wrap.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexbox Demo</title>
  <style>
    .nav { display: flex; }
    .cards { display: flex; flex-wrap: wrap; gap: 16px; }
    .card { flex: 1 1 200px; }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="logo">Logo</div>
    <ul><li><a href="#">Home</a></li><li><a href="#">About</a></li><li><a href="#">Services</a></li><li><a href="#">Contact</a></li></ul>
    <button>Sign Up</button>
  </nav>
  <section class="cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
    <div class="card">Card 4</div>
    <div class="card">Card 5</div>
    <div class="card">Card 6</div>
  </section>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Create flex containers with display: flex","Control alignment with justify-content and align-items","Enable wrapping with flex-wrap","Use flex shorthand for grow, shrink, and basis","Reorder flex items and override alignment per item"]),
    quiz: JSON.stringify([{"question":"Which property distributes space along the main axis?","options":["align-items","justify-content","gap","flex-wrap"],"correctIndex":1},{"question":"What does `flex: 1` mean?","options":["flex-grow: 1, flex-shrink: 1, flex-basis: 0","flex-grow: 1, flex-shrink: 0, flex-basis: auto","flex-grow: 0, flex-shrink: 1, flex-basis: 100%","flex-grow: 1, flex-shrink: 1, flex-basis: auto"],"correctIndex":0},{"question":"How do you center content both horizontally and vertically with flexbox?","options":["justify-content: center, align-items: center","text-align: center, vertical-align: middle","margin: auto auto","align-self: center"],"correctIndex":0},{"question":"Which property allows flex items to wrap to multiple lines?","options":["flex-wrap: wrap","flex-flow: wrap","overflow: wrap","wrap: true"],"correctIndex":0},{"question":"What is the default value of flex-direction?","options":["column","row","row-reverse","column-reverse"],"correctIndex":1}]),
  },
  {
    slug: "grid",
    title: "CSS Grid",
    order: 11,
    level: "advanced",
    exerciseType: "code",
    theory: `# CSS Grid

CSS Grid is a two-dimensional layout system that handles both rows and columns simultaneously. While Flexbox excels at one-dimensional layouts, Grid is the tool for complex page structures and magazine-style layouts.

## The Grid Container

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: auto 300px auto;
  gap: 16px;
}
\`\`\`

## Defining Columns and Rows

\`\`\`css
/* Fixed columns */
grid-template-columns: 200px 200px 200px;

/* Fractional units - divide available space */
grid-template-columns: 1fr 2fr 1fr;

/* Mix fixed and fluid */
grid-template-columns: 250px 1fr 250px;

/* Repeat function */
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
\`\`\`

## Gap

\`\`\`css
.container { gap: 20px; row-gap: 16px; column-gap: 24px; }
\`\`\`

## Placing Items Explicitly

\`\`\`css
.header { grid-column: 1 / -1; grid-row: 1 / 2; }
.sidebar { grid-column: 1 / 2; grid-row: 2 / 4; }
.main { grid-column: 2 / 3; grid-row: 2 / 3; }
.item { grid-area: 2 / 1 / 4 / 3; } /* row-start / col-start / row-end / col-end */
\`\`\`

## Grid Template Areas

The most intuitive way to define layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
\`\`\`

Use dots for empty cells:
\`\`\`css
grid-template-areas:
  "header header header"
  ".      main   aside"
  "footer footer footer";
\`\`\`

## Auto-fit and Auto-fill

\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
/* auto-fill keeps empty tracks; auto-fit collapses them */
\`\`\`

## Minmax

\`\`\`css
grid-template-columns: repeat(3, minmax(200px, 400px));
grid-template-columns: minmax(200px, auto) 1fr;
\`\`\`

## Alignment

\`\`\`css
.container {
  justify-items: center;   /* Horizontal in cells */
  align-items: center;     /* Vertical in cells */
  justify-content: center; /* Horizontal grid */
  align-content: center;   /* Vertical grid */
}
.item { justify-self: stretch; align-self: center; }
\`\`\`

## Implicit Grid

\`\`\`css
.container {
  grid-auto-rows: 150px;
  grid-auto-columns: 200px;
  grid-auto-flow: dense;
}
\`\`\``,
    exercisePrompt: "Create a full-page magazine-style layout using CSS Grid. Include: a full-width header, a sidebar on the left, a main content area in the center, an aside on the right, and a full-width footer. The main area should contain a 3-column grid of article cards that use auto-fit with minmax to be responsive.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grid Magazine Layout</title>
  <style>
    body { margin: 0; min-height: 100vh; }
    .layout { display: grid; }
  </style>
</head>
<body>
  <div class="layout">
    <header class="header">Header</header>
    <nav class="sidebar">Sidebar</nav>
    <main class="main">
      <h1>Main Content</h1>
      <div class="articles">
        <article class="card">Article 1</article>
        <article class="card">Article 2</article>
        <article class="card">Article 3</article>
        <article class="card">Article 4</article>
        <article class="card">Article 5</article>
        <article class="card">Article 6</article>
      </div>
    </main>
    <aside class="aside">Aside</aside>
    <footer class="footer">Footer</footer>
  </div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Create grid containers with explicit column and row definitions","Use fractional units (fr), minmax, and repeat for flexible layouts","Place items with grid-template-areas","Use auto-fit/auto-fill for responsive grids","Align content within grid cells"]),
    quiz: JSON.stringify([{"question":"What does the `fr` unit represent in CSS Grid?","options":["A fraction of the available space","A fixed pixel value","A fraction of the parent width","A fractional viewport unit"],"correctIndex":0},{"question":"Which function creates flexible columns that repeat based on available space?","options":["repeat()","loop()","cycle()","flex()"],"correctIndex":0},{"question":"What does `grid-column: 1 / -1` do?","options":["Spans from the first to the last column line","Starts at column 1 and ends at column -1","Creates a negative column offset","Removes the grid column"],"correctIndex":0},{"question":"What is the difference between auto-fit and auto-fill?","options":["auto-fit collapses empty tracks; auto-fill keeps them","auto-fill collapses empty tracks; auto-fit keeps them","They are identical","auto-fit works with columns; auto-fill with rows"],"correctIndex":0},{"question":"Which property aligns items within their grid cell vertically?","options":["justify-items","align-items","justify-content","align-content"],"correctIndex":1}]),
  },
  {
    slug: "responsive-design",
    title: "Responsive Design",
    order: 12,
    level: "advanced",
    exerciseType: "code",
    theory: `# Responsive Design

Responsive design ensures your website looks great on every device -- phones, tablets, laptops, and desktops.

## The Viewport Meta Tag

Without this tag, mobile browsers render pages at a desktop width and zoom out:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## Media Queries

\`\`\`css
/* Mobile first */
.container { display: flex; flex-direction: column; }

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container { flex-direction: row; flex-wrap: wrap; }
  .item { flex: 1 1 50%; }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .item { flex: 1 1 33.333%; }
}

/* Large: 1440px+ */
@media (min-width: 1440px) {
  .container { max-width: 1400px; }
}
\`\`\`

## Mobile-First Approach

Start with the smallest screen and add complexity as space allows. This approach loads less CSS on mobile and forces you to prioritize essential content.

## Responsive Units

\`\`\`css
.full-screen { height: 100vh; width: 100vw; }
.square { width: 50vmin; height: 50vmin; }
.fluid-text { font-size: clamp(16px, 4vw, 48px); }
\`\`\`

## Responsive Images

\`\`\`html
<img src="photo.jpg" style="max-width: 100%; height: auto;">
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>
\`\`\`

## Common Breakpoints

- Mobile: 0 - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

Use content-based breakpoints (where your design breaks) rather than device-specific ones.`,
    exercisePrompt: "Create a responsive landing page with a hero section (full viewport height), a features grid (1 column on mobile, 2 on tablet, 3 on desktop), and a footer. Use a mobile-first approach with min-width media queries. Use clamp() for fluid typography.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Landing Page</title>
  <style>
    @media (min-width: 768px) { }
    @media (min-width: 1024px) { }
  </style>
</head>
<body>
  <header class="hero"><h1>Welcome</h1><p>Built for everyone.</p><button>Get Started</button></header>
  <section class="features"><div class="feature">Feature 1</div><div class="feature">Feature 2</div><div class="feature">Feature 3</div></section>
  <footer>&copy; 2026</footer>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Implement media queries with a mobile-first approach","Use responsive units (vw, vh, vmin, vmax, clamp)","Create responsive images with the picture element","Apply viewport meta tag correctly"]),
    quiz: JSON.stringify([{"question":"What does the viewport meta tag do?","options":["Sets the viewport to device width and initial scale","Defines the visible area of the browser","Creates a responsive image","Sets the page zoom level"],"correctIndex":0},{"question":"What is the mobile-first approach?","options":["Start with mobile styles, add complexity at larger breakpoints","Start with desktop styles, simplify at smaller breakpoints","Build separate pages for mobile and desktop","Use only mobile styles everywhere"],"correctIndex":0},{"question":"Which CSS function creates fluid values between a min and max?","options":["fluid()","range()","clamp()","between()"],"correctIndex":2},{"question":"What does `100vh` represent?","options":["100% of the viewport height","100 pixels high","100% of the parent height","100 vertical pixels"],"correctIndex":0},{"question":"Which HTML element allows serving different images based on screen size?","options":["<img>","<picture>","<source>","<responsive-img>"],"correctIndex":1}]),
  },
  {
    slug: "animations",
    title: "CSS Animations",
    order: 13,
    level: "advanced",
    exerciseType: "code",
    theory: `# CSS Animations

CSS animations bring your pages to life with motion.

## Transitions

\`\`\`css
.button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.button:hover { background-color: darkblue; transform: scale(1.05); }
.button:active { transform: scale(0.97); }
\`\`\`

Transition properties:
- \`transition-property\`: which properties to animate
- \`transition-duration\`: how long (0.3s, 300ms)
- \`transition-timing-function\`: ease, linear, ease-in, ease-out, cubic-bezier()
- \`transition-delay\`: delay before starting

## @keyframes

\`\`\`css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}
\`\`\`

## Animation Properties

\`\`\`css
.element {
  animation: slideIn 0.5s ease-out forwards;
  animation-iteration-count: 1;  /* or infinite */
  animation-direction: normal;   /* normal, reverse, alternate */
  animation-play-state: running; /* or paused */
}
\`\`\`

## Transforms

\`\`\`css
.element {
  transform: translateX(50px);
  transform: translateY(-20px);
  transform: scale(1.5);
  transform: rotate(45deg);
  transform: skew(10deg, 5deg);
  transform-origin: top left;
}
\`\`\`

## Performance Tips

- Animate only \`transform\` and \`opacity\` (GPU accelerated)
- Avoid animating \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\`
- Use \`will-change\` sparingly

## Accessibility

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\``,
    exercisePrompt: "Create a page with: (1) a button that scales up on hover and scales down on active, (2) a loading spinner using @keyframes, (3) a card that fades and slides in on page load, and (4) a bouncing ball animation. Include prefers-reduced-motion support.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Animations Demo</title>
  <style>
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>
  <button class="btn">Hover Me</button>
  <div class="spinner">Loading...</div>
  <div class="card">Animated Card</div>
  <div class="ball">Bouncing Ball</div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Create CSS transitions with appropriate timing functions","Define and use @keyframes for multi-step animations","Apply transforms for movement, scaling, and rotation","Optimize animation performance by animating transform and opacity","Respect reduced motion preferences"]),
    quiz: JSON.stringify([{"question":"Which CSS properties should you animate for best performance?","options":["transform and opacity","width and height","margin and padding","top and left"],"correctIndex":0},{"question":"What does `@keyframes slideIn { from { opacity: 0; } to { opacity: 1; } }` define?","options":["A multi-step animation from transparent to visible","A CSS transition","A hover effect","A transform function"],"correctIndex":0},{"question":"Which timing function creates a deceleration effect (fast start, slow end)?","options":["ease-in","ease-out","linear","step-start"],"correctIndex":1},{"question":"How do you make an animation loop forever?","options":["animation-iteration-count: infinite","animation-loop: forever","animation-repeat: always","animation-direction: loop"],"correctIndex":0},{"question":"Which media query respects user motion preferences?","options":["@media (prefers-motion: reduce)","@media (prefers-reduced-motion: reduce)","@media (motion: reduced)","@media (user-motion: off)"],"correctIndex":1}]),
  },
  {
    slug: "modern-layouts",
    title: "Modern Layout Systems",
    order: 14,
    level: "advanced",
    exerciseType: "code",
    theory: `# Modern Layout Systems

Modern CSS offers powerful layout tools beyond basic flexbox and grid.

## Combining Flexbox and Grid

Use Grid for page layout and Flexbox for components:

\`\`\`css
.page { display: grid; grid-template-areas: "header header" "sidebar main" "footer footer"; grid-template-columns: 250px 1fr; }
.card-row { display: flex; gap: 20px; flex-wrap: wrap; }
.card { flex: 1 1 300px; display: flex; flex-direction: column; }
.card-footer { margin-top: auto; }
\`\`\`

## CSS Columns

Multi-column layout for newspaper-style content:

\`\`\`css
.article { column-count: 3; column-gap: 2rem; column-rule: 1px solid #ddd; }
.article h2 { column-span: all; }
\`\`\`

## Container Queries

Elements respond to their container size, not the viewport:

\`\`\`css
.card-grid { container-type: inline-size; container-name: cards; }

@container cards (min-width: 600px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}

@container cards (min-width: 900px) {
  .card { grid-template-columns: 300px 1fr; }
}
\`\`\`

## Logical Properties

Instead of \`left\`/\`right\`, use properties that respect writing direction:

\`\`\`css
.new { margin-inline-start: 10px; }     /* Adapts to RTL */
.element {
  border-inline: 2px solid black;
  padding-block: 1rem;
  inset-inline-end: 0;
}
\`\`\`

## Putting It All Together

\`\`\`css
.page { display: grid; grid-template-columns: 250px 1fr; }
.content { container-type: inline-size; }

@container (min-width: 700px) {
  .gallery { display: grid; grid-template-columns: repeat(3, 1fr); }
}

@container (max-width: 699px) {
  .gallery { display: flex; flex-direction: column; }
}
\`\`\``,
    exercisePrompt: "Create a page that uses: Grid for the overall layout (sidebar + main), Flexbox for a card gallery, multi-column layout for a blog article, and a container query that changes the card layout at a certain container width. Use logical properties for spacing.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Layouts Demo</title>
  <style>
    .page { display: grid; }
  </style>
</head>
<body>
  <div class="page">
    <nav class="sidebar">Sidebar</nav>
    <main class="main">
      <section class="gallery"><div class="card">Card 1</div><div class="card">Card 2</div><div class="card">Card 3</div></section>
      <article class="article"><h2>Article</h2><p>Long-form content here...</p></article>
    </main>
  </div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Combine flexbox and grid for page and component layouts","Use multi-column layout for long-form content","Implement container queries for component-level responsiveness","Apply logical properties for internationalization"]),
    quiz: JSON.stringify([{"question":"What do container queries respond to?","options":["The container element size","The viewport size","The device screen size","The parent font size"],"correctIndex":0},{"question":"Which property defines an element as a container for container queries?","options":["container-type: inline-size","display: container","contain: layout","isolation: contain"],"correctIndex":0},{"question":"When would you use multi-column layout?","options":["For long-form reading content like articles","For navigation menus","For image galleries","For form layouts"],"correctIndex":0},{"question":"What do logical properties like `margin-inline-start` do?","options":["Adapt to the writing direction (LTR/RTL)","Create inline margins only","Apply margins to the start of the element","Override all other margin properties"],"correctIndex":0},{"question":"Which layout system is best for the overall page structure?","options":["CSS Grid","Flexbox","Multi-column","Float-based layout"],"correctIndex":0}]),
  },
  {
    slug: "final-project",
    title: "Final Project: Portfolio Website",
    order: 25,
    level: "advanced",
    exerciseType: "code",
    theory: `# Final Project: Portfolio Website

Congratulations on making it to the final project! You will now apply everything you have learned to build a complete, responsive portfolio website.

## Project Overview

Build a personal portfolio website with these sections:

1. **Hero** -- Full-viewport landing with your name, title, and call-to-action
2. **About** -- Bio section with your background and skills
3. **Projects** -- Grid of project cards with descriptions and links
4. **Contact** -- Contact form with validation
5. **Footer** -- Social links and copyright

## Requirements

### HTML Structure
- Use semantic HTML throughout (\`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`)
- Proper document outline with heading hierarchy
- Accessible forms with labels
- ARIA attributes where appropriate

### CSS Styling
- Custom properties (CSS variables) for colors and spacing
- Mobile-first responsive design with media queries
- Flexbox for component-level layouts
- CSS Grid for the overall page structure
- Smooth scroll behavior
- Active states on all interactive elements

### Design Guidelines

\`\`\`css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #64748b;
  --accent: #f59e0b;
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --text: #1e293b;
  --text-light: #64748b;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --max-width: 1200px;
}
\`\`\`

## Tips for Success

1. Start with the HTML structure before adding CSS
2. Sketch your layout on paper first
3. Build mobile-first, then add complexity
4. Use CSS Grid for the overall layout, Flexbox for components
5. Add animations as the final polish
6. Test on multiple screen sizes
7. Validate your HTML at validator.w3.org

Good luck! This project brings together everything you have learned.`,
    exercisePrompt: "Build a complete responsive portfolio website with hero, about, projects, contact, and footer sections. Use semantic HTML, CSS Grid, Flexbox, custom properties, mobile-first design, and at least one CSS animation or transition.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <style>
    :root {
      --primary: #2563eb; --bg: #ffffff; --text: #1e293b;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <header><nav></nav></header>
  <main>
    <section id="hero"></section>
    <section id="about"></section>
    <section id="projects"></section>
    <section id="contact"></section>
  </main>
  <footer></footer>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Build a complete multi-section portfolio from scratch","Apply all HTML and CSS concepts covered in the course","Implement responsive design with mobile-first approach","Create a polished, production-ready web page"]),
    quiz: JSON.stringify([{"question":"What is the best way to approach building a large project like this?","options":["Start with HTML structure, then CSS, then polish","Write all CSS first, then add HTML","Build for desktop first, then adapt for mobile","Add animations before any layout"],"correctIndex":0},{"question":"Which CSS feature is best for managing a consistent color palette?","options":["CSS custom properties (variables)","Sass variables","Hardcoded hex values","Inheritance"],"correctIndex":0},{"question":"What layout technique should you use for the overall page structure?","options":["CSS Grid","Flexbox","Float-based layout","Table layout"],"correctIndex":0},{"question":"How should you implement a mobile hamburger menu without JavaScript?","options":["Using the :target pseudo-class or checkbox hack","It requires JavaScript","Using @media queries","Using the <details> element"],"correctIndex":0},{"question":"What is the final step before considering a project complete?","options":["Testing on multiple screen sizes and validating HTML","Adding more animations","Adding more colors","Rearranging the layout"],"correctIndex":0}]),
  },
  {
    slug: "text-typography",
    title: "Text & Typography",
    order: 15,
    level: "beginner",
    exerciseType: "code",
    theory: `# Text & Typography

Most of the web is text, so controlling how it looks is a core skill. CSS gives you precise control over fonts, size, weight, spacing, and alignment.

## Font Family

The \`font-family\` property sets the typeface. Always provide fallbacks ending in a generic family:

\`\`\`css
body {
  font-family: "Georgia", "Times New Roman", serif;
}
\`\`\`

The browser tries each in order until it finds one that's available.

## Size, Weight, and Style

\`\`\`css
h1 {
  font-size: 2rem;       /* 2x the root font size */
  font-weight: 700;      /* bold (100-900) */
  font-style: italic;
}
\`\`\`

## Spacing and Alignment

\`\`\`css
p {
  line-height: 1.6;        /* space between lines — key for readability */
  letter-spacing: 0.02em;  /* space between letters */
  text-align: center;      /* left | right | center | justify */
}
\`\`\`

A \`line-height\` of about 1.5–1.7 makes paragraphs far easier to read.

## Web Fonts

To use a custom font like those from Google Fonts, link it in your HTML \`<head>\`, then reference it:

\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
\`\`\`
\`\`\`css
body { font-family: "Inter", sans-serif; }
\`\`\`

Good typography — readable size, comfortable line-height, a sensible type scale — instantly makes a page feel professional.`,
    exercisePrompt: "Style the page so the heading uses a serif font at 2.5rem bold, and the paragraph uses a line-height of 1.6 and is center-aligned. Edit the CSS inside the <style> tag and watch the live preview.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  h1 {
    /* serif font, 2.5rem, bold */
  }
  p {
    /* line-height 1.6, centered */
  }
</style>
</head>
<body>
  <h1>Typography Matters</h1>
  <p>Readable text keeps visitors on the page. Adjust the styles and watch this change.</p>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Set typefaces with font-family and fallbacks","Control font-size, font-weight, and font-style","Improve readability with line-height and letter-spacing","Align text with text-align","Load and use a web font"]),
    quiz: JSON.stringify([{"question":"Why list multiple fonts in font-family?","options":["For decoration","As fallbacks if earlier fonts are unavailable","To use them all at once","It is required syntax"],"correctIndex":1},{"question":"Which property controls space between lines of text?","options":["letter-spacing","line-height","word-gap","text-space"],"correctIndex":1},{"question":"What does font-weight: 700 mean?","options":["Italic","Bold","Underlined","Tiny"],"correctIndex":1},{"question":"A good line-height for body paragraphs is around...","options":["0.5","1.0","1.6","4.0"],"correctIndex":2},{"question":"Which centers text?","options":["text-align: center","align: middle","text-center: true","center-text"],"correctIndex":0}]),
  },
  {
    slug: "links-images",
    title: "Links & Images",
    order: 16,
    level: "beginner",
    exerciseType: "code",
    theory: `# Links & Images

Links and images are what make the web *the web* — connected and visual.

## Links

The anchor element \`<a>\` creates a hyperlink. The \`href\` attribute sets the destination:

\`\`\`html
<a href="https://example.com">Visit Example</a>
<a href="about.html">About page</a>      <!-- relative link -->
<a href="#section2">Jump to section</a>   <!-- link to an id on the page -->
\`\`\`

Open links in a new tab with \`target="_blank"\` (add \`rel="noopener"\` for security):

\`\`\`html
<a href="https://example.com" target="_blank" rel="noopener">New tab</a>
\`\`\`

## Images

The \`<img>\` element embeds an image. The \`src\` gives the file, and the \`alt\` text describes it:

\`\`\`html
<img src="cat.jpg" alt="A sleeping orange cat" width="300">
\`\`\`

**Always write meaningful \`alt\` text.** Screen readers read it aloud, and it shows if the image fails to load. For purely decorative images, use \`alt=""\`.

## Responsive Images

Let images scale to their container instead of overflowing:

\`\`\`css
img {
  max-width: 100%;
  height: auto;
}
\`\`\`

## Images as Links

Wrap an \`<img>\` in an \`<a>\` to make it clickable:

\`\`\`html
<a href="profile.html"><img src="avatar.png" alt="View profile"></a>
\`\`\`

Together, links and images turn flat documents into rich, navigable experiences.`,
    exercisePrompt: "Add a link that opens https://developer.mozilla.org in a new tab, and an image with a descriptive alt text. Then add CSS so the image never exceeds its container width.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  img {
    /* make images responsive */
  }
</style>
</head>
<body>
  <!-- 1. Add a link that opens MDN in a new tab -->

  <!-- 2. Add an image with alt text -->
  <img src="https://via.placeholder.com/600x200" alt="">
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Create links with the <a> element and href","Use relative, absolute, and in-page (#id) links","Open links in a new tab safely with target and rel","Embed images with <img>, src, and meaningful alt text","Make images responsive with max-width: 100%"]),
    quiz: JSON.stringify([{"question":"Which attribute sets a link's destination?","options":["src","href","link","to"],"correctIndex":1},{"question":"What does alt text on an image do?","options":["Sets the size","Describes the image for screen readers and load failures","Changes the color","Adds a border"],"correctIndex":1},{"question":"How do you open a link in a new tab?","options":["new=\"true\"","target=\"_blank\"","tab=\"new\"","open=\"blank\""],"correctIndex":1},{"question":"Which CSS makes an image scale to its container?","options":["width: auto","max-width: 100%","size: fit","scale: 1"],"correctIndex":1},{"question":"An in-page link to id=\"top\" uses href...","options":["\"top\"","\"#top\"","\".top\"","\"/top\""],"correctIndex":1}]),
  },
  {
    slug: "lists",
    title: "Lists",
    order: 17,
    level: "beginner",
    exerciseType: "code",
    theory: `# Lists

Lists organize related items — navigation menus, steps, features, and more. HTML has three list types.

## Unordered Lists

Use \`<ul>\` for items with no particular order; each item is an \`<li>\`:

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
\`\`\`

By default these show bullet points.

## Ordered Lists

Use \`<ol>\` when sequence matters — the browser numbers each item automatically:

\`\`\`html
<ol>
  <li>Plan the layout</li>
  <li>Write the HTML</li>
  <li>Add the CSS</li>
</ol>
\`\`\`

## Description Lists

\`<dl>\` pairs terms (\`<dt>\`) with descriptions (\`<dd>\`):

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>Structures the content of a page.</dd>
</dl>
\`\`\`

## Styling Lists

Control the marker and spacing with CSS:

\`\`\`css
ul {
  list-style-type: square;   /* disc | circle | square | none */
}
li {
  margin-bottom: 0.5rem;
}
\`\`\`

Setting \`list-style: none\` and adding flexbox is the standard way to build horizontal navigation bars from a \`<ul>\` — lists are the semantic backbone of menus.`,
    exercisePrompt: "Create an ordered list of three steps to make tea, and an unordered list of two ingredients. Then use CSS to remove the bullets from the unordered list with list-style-type: none.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  ul {
    /* remove the bullets */
  }
</style>
</head>
<body>
  <h2>Steps</h2>
  <!-- 1. Ordered list of three steps -->

  <h2>Ingredients</h2>
  <!-- 2. Unordered list of two items -->
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Build unordered lists with <ul> and <li>","Build ordered lists with <ol>","Use description lists with <dl>, <dt>, <dd>","Change list markers with list-style-type","Understand lists as the basis for navigation menus"]),
    quiz: JSON.stringify([{"question":"Which element creates a bulleted list?","options":["<ol>","<ul>","<list>","<dl>"],"correctIndex":1},{"question":"Which list automatically numbers its items?","options":["<ul>","<ol>","<nl>","<dl>"],"correctIndex":1},{"question":"What tag holds a single list item?","options":["<item>","<li>","<dd>","<p>"],"correctIndex":1},{"question":"How do you remove bullets from a list?","options":["list-style-type: none","bullets: off","marker: hidden","list: clear"],"correctIndex":0},{"question":"A description list pairs which two tags?","options":["<dt> and <dd>","<li> and <ul>","<term> and <desc>","<dl> and <li>"],"correctIndex":0}]),
  },
  {
    slug: "colors-backgrounds",
    title: "Colors & Backgrounds",
    order: 18,
    level: "beginner",
    exerciseType: "code",
    theory: `# Colors & Backgrounds

Color sets the mood of a page. CSS offers several ways to specify it and rich control over backgrounds.

## Color Formats

\`\`\`css
color: red;                  /* named color */
color: #3498db;              /* hex */
color: rgb(52, 152, 219);    /* red, green, blue (0-255) */
color: rgba(52, 152, 219, 0.5);  /* with 50% opacity */
color: hsl(204, 70%, 53%);   /* hue, saturation, lightness */
\`\`\`

\`hsl\` is intuitive for adjusting shades — change only the lightness to get lighter or darker variants of the same color.

## Backgrounds

\`\`\`css
.box {
  background-color: #f0f0f0;
  background-image: url("photo.jpg");
  background-size: cover;       /* fill the element */
  background-position: center;
  background-repeat: no-repeat;
}
\`\`\`

The shorthand \`background\` combines them all.

## Gradients

Gradients are images you create in CSS — no files needed:

\`\`\`css
.hero {
  background: linear-gradient(to right, #3498db, #9b59b6);
}
.circle {
  background: radial-gradient(circle, #fff, #333);
}
\`\`\`

## Contrast Matters

Always ensure enough contrast between text and background so everyone can read it. Light gray text on white may look elegant but fails for many users — accessibility and aesthetics go together.`,
    exercisePrompt: "Give the page a linear-gradient background from one color to another, and make the heading text a readable color with good contrast against it.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    /* add a linear-gradient background */
    min-height: 100vh;
    margin: 0;
  }
  h1 {
    /* a readable text color */
    text-align: center;
    padding-top: 2rem;
  }
</style>
</head>
<body>
  <h1>Color Me Impressed</h1>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Specify colors with named, hex, rgb, rgba, and hsl formats","Add transparency with rgba and hsl alpha","Style backgrounds with color, image, size, and position","Create linear and radial gradients in CSS","Ensure sufficient text/background contrast"]),
    quiz: JSON.stringify([{"question":"Which format includes an alpha (opacity) channel?","options":["hex like #fff","rgb()","rgba()","named colors"],"correctIndex":2},{"question":"What does background-size: cover do?","options":["Repeats the image","Scales the image to fill the element","Centers the image","Hides the image"],"correctIndex":1},{"question":"Which creates a left-to-right color blend?","options":["radial-gradient(...)","linear-gradient(to right, ...)","background-repeat","color-blend()"],"correctIndex":1},{"question":"In hsl(), which value is easiest to change for lighter/darker shades?","options":["Hue","Saturation","Lightness","Alpha"],"correctIndex":2},{"question":"Why does text/background contrast matter?","options":["For faster loading","For readability and accessibility","To save colors","It does not matter"],"correctIndex":1}]),
  },
  {
    slug: "css-units",
    title: "CSS Units",
    order: 19,
    level: "intermediate",
    exerciseType: "code",
    theory: `# CSS Units

Sizes in CSS can be expressed in many units. Choosing the right one is the difference between a rigid layout and one that adapts gracefully.

## Absolute Units

\`px\` (pixels) is the most common absolute unit — fixed and predictable:

\`\`\`css
border: 1px solid black;
\`\`\`

Use pixels for things that should not scale, like thin borders.

## Relative Units

These scale relative to something else, which makes layouts flexible:

- \`em\` — relative to the **parent's** font size (\`2em\` = twice the parent).
- \`rem\` — relative to the **root** (\`<html>\`) font size. Predictable and the modern default for spacing and type.
- \`%\` — relative to the parent's size.

\`\`\`css
html { font-size: 16px; }
h1   { font-size: 2rem; }    /* 32px */
p    { padding: 1rem; }      /* 16px */
.col { width: 50%; }         /* half the parent */
\`\`\`

## Viewport Units

Relative to the browser window:

- \`vw\` — 1% of viewport **width**.
- \`vh\` — 1% of viewport **height**.

\`\`\`css
.hero { height: 100vh; }     /* full screen height */
.title { font-size: 5vw; }   /* scales with window width */
\`\`\`

## Rule of Thumb

Prefer \`rem\` for font sizes and spacing (consistent, respects user settings), \`%\` and \`vw/vh\` for responsive layout dimensions, and \`px\` for fine details like borders. Relative units are what make a single design work across phones, tablets, and desktops.`,
    exercisePrompt: "Make the .box use a width of 50% of its parent, a font-size of 1.5rem, and a height of 30vh. Observe how it responds as the preview size changes.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  .box {
    /* width 50%, font-size 1.5rem, height 30vh */
    background: #3498db;
    color: white;
    padding: 1rem;
  }
</style>
</head>
<body>
  <div class="box">Resize me with relative units</div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Distinguish absolute (px) from relative units","Use em and rem for scalable type and spacing","Use % for sizing relative to a parent","Use vw and vh for viewport-relative sizing","Choose appropriate units for responsive design"]),
    quiz: JSON.stringify([{"question":"Which unit is relative to the root (<html>) font size?","options":["em","rem","px","pt"],"correctIndex":1},{"question":"What does 100vh represent?","options":["100 pixels","Full viewport height","100% of parent width","100 rem"],"correctIndex":1},{"question":"em is relative to...","options":["The root element","The parent's font size","The viewport","Always 16px"],"correctIndex":1},{"question":"Which unit is best for a thin, fixed border?","options":["vw","%","px","rem"],"correctIndex":2},{"question":"For responsive design you should prefer...","options":["Only px everywhere","Relative units like rem, %, vw/vh","Only cm and in","Random units"],"correctIndex":1}]),
  },
  {
    slug: "positioning",
    title: "CSS Positioning",
    order: 20,
    level: "intermediate",
    exerciseType: "code",
    theory: `# CSS Positioning

The \`position\` property controls how an element is placed and how it responds to the \`top\`, \`right\`, \`bottom\`, and \`left\` offsets.

## static (the default)

Elements flow normally, top to bottom. Offsets have no effect.

## relative

The element stays in the normal flow but can be **nudged** from its original spot:

\`\`\`css
.badge { position: relative; top: -5px; left: 10px; }
\`\`\`

It also becomes a reference point for absolutely-positioned children.

## absolute

The element is **removed from normal flow** and positioned relative to its nearest *positioned* ancestor (one with \`position\` other than static):

\`\`\`css
.card { position: relative; }
.card .tag { position: absolute; top: 0; right: 0; }
\`\`\`

This is the classic pattern for placing a label in a corner of a card.

## fixed

Positioned relative to the **viewport** — it stays put when you scroll. Perfect for sticky headers and back-to-top buttons:

\`\`\`css
.navbar { position: fixed; top: 0; width: 100%; }
\`\`\`

## sticky

A hybrid: behaves like \`relative\` until you scroll to a threshold, then "sticks" like \`fixed\`:

\`\`\`css
.section-title { position: sticky; top: 0; }
\`\`\`

## z-index

When positioned elements overlap, \`z-index\` decides the stacking order — higher numbers sit on top. Mastering positioning lets you build overlays, tooltips, sticky bars, and badges.`,
    exercisePrompt: "Make the .card position:relative, then place the .tag in its top-right corner using position:absolute. Add a fixed-position .banner at the top of the viewport.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  .card { /* relative */ width: 200px; height: 120px; background: #eee; }
  .tag  { /* absolute, top-right */ background: crimson; color: white; padding: 4px; }
  .banner { /* fixed, top of viewport */ background: navy; color: white; padding: 8px; }
</style>
</head>
<body>
  <div class="banner">Fixed banner</div>
  <div class="card">
    <span class="tag">NEW</span>
  </div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Explain static, relative, absolute, fixed, and sticky positioning","Offset elements with top/right/bottom/left","Position a child absolutely within a relative parent","Create fixed headers and sticky elements","Control overlap order with z-index"]),
    quiz: JSON.stringify([{"question":"What is the default position value?","options":["relative","static","absolute","fixed"],"correctIndex":1},{"question":"absolute positions an element relative to...","options":["The viewport","Its nearest positioned ancestor","The body always","Its sibling"],"correctIndex":1},{"question":"Which keeps an element in place while scrolling?","options":["static","relative","fixed","inline"],"correctIndex":2},{"question":"sticky behaves like relative until...","options":["The page loads","You scroll to its threshold, then it sticks","You click it","Never"],"correctIndex":1},{"question":"What controls which overlapping element appears on top?","options":["order","z-index","layer","top"],"correctIndex":1}]),
  },
  {
    slug: "transitions-transforms",
    title: "Transitions & Transforms",
    order: 21,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Transitions & Transforms

These two properties add motion and depth — the polish that makes interfaces feel alive — using only CSS.

## Transforms

\`transform\` changes an element's shape or position without affecting the layout around it:

\`\`\`css
.box:hover {
  transform: scale(1.1);          /* grow to 110% */
}
.icon { transform: rotate(45deg); }
.card { transform: translateY(-8px); }   /* move up 8px */
\`\`\`

You can combine them: \`transform: translateX(10px) rotate(15deg) scale(1.2);\`. Transforms run on the GPU, so they're smooth and cheap to animate.

## Transitions

A \`transition\` smoothly animates a property change over time instead of snapping instantly:

\`\`\`css
.button {
  background: #3498db;
  transition: background 200ms ease, transform 200ms ease;
}
.button:hover {
  background: #2980b9;
  transform: translateY(-2px);
}
\`\`\`

The syntax is \`transition: <property> <duration> <timing-function>\`. Animate **specific properties**, not \`all\`, for better performance.

## Timing Functions

- \`ease\` — slow start and end (the default).
- \`linear\` — constant speed.
- \`ease-out\` — fast start, gentle stop (great for things appearing).

## Best Practice

For smooth 60fps motion, animate only \`transform\` and \`opacity\` — they don't trigger expensive layout recalculation. A subtle hover lift plus a color transition is often all a button needs to feel responsive and premium.`,
    exercisePrompt: "Give the button a transition on transform and background. On hover, lift it up with translateY(-4px) and darken its background. Keep the duration around 200ms.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  .button {
    background: #3498db; color: white; border: none;
    padding: 12px 24px; border-radius: 6px; font-size: 1rem;
    /* add a transition */
  }
  .button:hover {
    /* lift with translateY and darken background */
  }
</style>
</head>
<body>
  <button class="button">Hover me</button>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Move, scale, and rotate elements with transform","Combine multiple transforms","Animate property changes with transition","Choose timing functions like ease and ease-out","Animate transform/opacity for smooth performance"]),
    quiz: JSON.stringify([{"question":"Which property grows an element to 110% on hover?","options":["zoom: 110%","transform: scale(1.1)","size: 1.1","grow: 10%"],"correctIndex":1},{"question":"What does a transition do?","options":["Hides an element","Smoothly animates a property change over time","Changes the HTML","Loads a page"],"correctIndex":1},{"question":"For smooth 60fps motion, prefer animating...","options":["width and height","margin and padding","transform and opacity","top and left"],"correctIndex":2},{"question":"Correct transition syntax is...","options":["transition: 200ms","transition: background 200ms ease","transition: ease background","animate: background"],"correctIndex":1},{"question":"translateY(-8px) moves an element...","options":["Right 8px","Up 8px","Down 8px","Left 8px"],"correctIndex":1}]),
  },
  {
    slug: "pseudo-classes",
    title: "Pseudo-classes & Pseudo-elements",
    order: 22,
    level: "intermediate",
    exerciseType: "code",
    theory: `# Pseudo-classes & Pseudo-elements

These special selectors style elements based on **state** or style **parts** of an element you couldn't otherwise target — without adding extra HTML.

## Pseudo-classes (single colon)

They target an element in a particular state:

\`\`\`css
a:hover      { color: red; }       /* mouse over */
a:visited    { color: purple; }    /* already clicked */
input:focus  { outline: 2px solid blue; }  /* keyboard/click focus */
button:disabled { opacity: 0.5; }
\`\`\`

## Structural Pseudo-classes

Select elements by their position among siblings:

\`\`\`css
li:first-child  { font-weight: bold; }
li:last-child   { border: none; }
tr:nth-child(even) { background: #f5f5f5; }  /* zebra-striped rows */
\`\`\`

\`:nth-child(even)\` / \`:nth-child(odd)\` are perfect for striped tables and lists.

## Pseudo-elements (double colon)

They style a *part* of an element or insert generated content:

\`\`\`css
p::first-line  { font-weight: bold; }
p::first-letter { font-size: 2em; }

.quote::before { content: "\\201C"; }   /* insert an opening quote */
.required::after { content: " *"; color: red; }
\`\`\`

\`::before\` and \`::after\` create generated content — used for icons, decorative elements, and badges, all without touching the HTML.

Together these selectors let you respond to user interaction and decorate content purely in CSS, keeping your markup clean and semantic.`,
    exercisePrompt: "Make links turn orange on hover, give inputs a glowing outline on focus, and use li:nth-child(even) to give every other list item a light gray background.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  a:hover { /* orange */ }
  input:focus { /* glowing outline */ }
  li:nth-child(even) { /* light gray background */ }
</style>
</head>
<body>
  <a href="#">A link to hover</a>
  <br><br>
  <input placeholder="Focus me">
  <ul>
    <li>One</li><li>Two</li><li>Three</li><li>Four</li>
  </ul>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Style states with :hover, :focus, :visited, :disabled","Target positions with :first-child, :last-child, :nth-child","Use :nth-child(even/odd) for striping","Style parts of text with ::first-line and ::first-letter","Insert generated content with ::before and ::after"]),
    quiz: JSON.stringify([{"question":"Which selector styles an element when the mouse is over it?","options":[":focus",":hover",":active",":over"],"correctIndex":1},{"question":"Which targets every other row for zebra striping?","options":[":nth-child(even)",":every(2)",":alt",":second-child"],"correctIndex":0},{"question":"Which inserts generated content before an element?","options":[":hover","::before",":first-child","::content"],"correctIndex":1},{"question":"How many colons do pseudo-elements use (modern syntax)?","options":["One (:)","Two (::)","Three","None"],"correctIndex":1},{"question":"input:focus applies when the input is...","options":["Disabled","Focused (clicked or tabbed to)","Empty","Hidden"],"correctIndex":1}]),
  },
  {
    slug: "css-variables",
    title: "CSS Variables (Custom Properties)",
    order: 23,
    level: "intermediate",
    exerciseType: "code",
    theory: `# CSS Variables (Custom Properties)

CSS variables let you store a value once and reuse it everywhere. Change it in one place and every use updates — the foundation of themeable, maintainable stylesheets.

## Defining and Using

Define variables (they start with \`--\`) on a selector, usually \`:root\` so they're global, and read them with \`var()\`:

\`\`\`css
:root {
  --brand: #3498db;
  --gap: 16px;
  --radius: 8px;
}

.button {
  background: var(--brand);
  padding: var(--gap);
  border-radius: var(--radius);
}
\`\`\`

Now your brand color lives in one spot. Update \`--brand\` and every button, link, and badge changes instantly.

## Fallback Values

\`var()\` accepts a fallback used if the variable isn't defined:

\`\`\`css
color: var(--accent, gray);
\`\`\`

## Theming with Variables

Because variables cascade and can be overridden, they make dark mode trivial:

\`\`\`css
:root        { --bg: white; --text: black; }
.dark-theme  { --bg: #111;  --text: #eee; }

body { background: var(--bg); color: var(--text); }
\`\`\`

Add the \`dark-theme\` class to \`<body>\` and the whole page re-themes — no duplicated rules.

Unlike preprocessor variables (Sass), CSS variables are **live** in the browser: you can read and change them at runtime with JavaScript, which powers dynamic themes and interactive UIs.`,
    exercisePrompt: "Define CSS variables in :root for a primary color, text color, and spacing. Use var() to style a .card with them, then prove the power by changing one variable to restyle everything.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  :root {
    /* define --primary, --text, --space */
  }
  .card {
    /* use var() for background, color, padding */
    border-radius: 8px;
  }
</style>
</head>
<body>
  <div class="card">Styled entirely with CSS variables.</div>
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Define custom properties with -- on :root","Reuse values with var()","Provide fallback values in var()","Build themes by overriding variables in a class","Explain why CSS variables are live unlike Sass variables"]),
    quiz: JSON.stringify([{"question":"How do you define a CSS variable?","options":["$name: value","--name: value","var name = value","@name: value"],"correctIndex":1},{"question":"How do you use a CSS variable?","options":["use(--name)","var(--name)","$(--name)","get(--name)"],"correctIndex":1},{"question":"Where are global variables usually defined?","options":["body","\:root","html head","* selector"],"correctIndex":1},{"question":"What does var(--accent, gray) do?","options":["Always uses gray","Uses --accent, or gray if undefined","Defines two variables","Errors"],"correctIndex":1},{"question":"A key advantage over Sass variables is that CSS variables are...","options":["Faster to type","Live and changeable at runtime","Shorter","Required"],"correctIndex":1}]),
  },
  {
    slug: "accessibility",
    title: "Web Accessibility",
    order: 24,
    level: "advanced",
    exerciseType: "code",
    theory: `# Web Accessibility

Accessibility (often "a11y") means building sites everyone can use, including people who rely on screen readers, keyboards, or have low vision. It's both the right thing to do and, in many places, a legal requirement.

## Semantic HTML First

The single biggest a11y win is using the **right element for the job**. Screen readers understand \`<nav>\`, \`<button>\`, \`<main>\`, and \`<h1>\`–\`<h6>\` — a \`<div>\` styled to look like a button tells them nothing.

\`\`\`html
<button>Submit</button>          <!-- accessible by default -->
<div class="btn">Submit</div>    <!-- not focusable, not announced -->
\`\`\`

## Images and Labels

- Give every meaningful image \`alt\` text; decorative images get \`alt=""\`.
- Connect form inputs to labels so clicking the label focuses the input:

\`\`\`html
<label for="email">Email</label>
<input id="email" type="email">
\`\`\`

## Keyboard Navigation

Many users can't use a mouse. Ensure every interactive element is reachable with **Tab** and shows a visible **focus** outline. Never remove focus outlines without providing a clear alternative:

\`\`\`css
button:focus-visible { outline: 2px solid blue; }
\`\`\`

## ARIA — When HTML Isn't Enough

ARIA attributes add meaning that native HTML can't express, like \`aria-label\` for an icon-only button:

\`\`\`html
<button aria-label="Close menu">X</button>
\`\`\`

The first rule of ARIA: **use a real HTML element if one exists** — reach for ARIA only to fill gaps.

## Color Contrast

Ensure text has enough contrast against its background (WCAG recommends at least 4.5:1 for normal text). Accessible design helps *everyone*, not just users with disabilities.`,
    exercisePrompt: "Fix this inaccessible snippet: replace the clickable div with a real <button>, connect the input to a label using for/id, and add alt text to the image. Add a visible focus style.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  button:focus-visible { /* add a visible outline */ }
</style>
</head>
<body>
  <!-- 1. Make this a real button -->
  <div class="btn">Sign up</div>

  <!-- 2. Connect label and input with for/id -->
  <label>Email</label>
  <input type="email">

  <!-- 3. Add alt text -->
  <img src="https://via.placeholder.com/120" alt="">
</body>
</html>`,
    language: "html",
    learningObjectives: JSON.stringify(["Use semantic HTML elements for built-in accessibility","Provide alt text and label-input associations","Ensure full keyboard navigation and visible focus","Add ARIA attributes only to fill gaps","Meet color-contrast guidelines"]),
    quiz: JSON.stringify([{"question":"What is the biggest single accessibility win?","options":["Adding ARIA everywhere","Using semantic HTML elements","More colors","Smaller fonts"],"correctIndex":1},{"question":"How do you connect a label to an input?","options":["label's for matches the input's id","They auto-connect","Using class names","With a <link>"],"correctIndex":0},{"question":"Why keep a visible focus outline?","options":["Decoration","So keyboard users can see where they are","To slow scrolling","It is optional and useless"],"correctIndex":1},{"question":"The first rule of ARIA is...","options":["Use ARIA on everything","Use a real HTML element if one exists","Never use HTML","ARIA replaces HTML"],"correctIndex":1},{"question":"WCAG recommends a contrast ratio for normal text of at least...","options":["1:1","2:1","4.5:1","20:1"],"correctIndex":2}]),
  },
];
