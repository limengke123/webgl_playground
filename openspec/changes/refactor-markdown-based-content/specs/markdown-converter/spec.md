# Markdown Converter Specification

## ADDED Requirements

### Requirement: Markdown Conversion Script
The system SHALL provide a Node.js script that converts Markdown files to React component files.

#### Scenario: Script execution
- **WHEN** the conversion script is executed
- **THEN** it SHALL read all Markdown files from `content/chapters/` directory
- **AND** SHALL convert each file to a corresponding React component
- **AND** SHALL write the generated components to `src/pages/chapters/` directory
- **AND** SHALL handle errors gracefully with clear error messages

#### Scenario: File conversion
- **WHEN** converting a Markdown file `chapter-0.md`
- **THEN** the script SHALL generate a React component file `Chapter0.tsx`
- **AND** the component name SHALL follow the pattern `Chapter{id}` where `{id}` is the chapter number
- **AND** the component SHALL be a valid TypeScript React component

### Requirement: Markdown Parsing
The converter SHALL parse standard Markdown syntax and convert it to React JSX.

#### Scenario: Paragraph conversion
- **WHEN** a Markdown file contains a paragraph
- **THEN** it SHALL be converted to a `<p>` JSX element
- **AND** the text content SHALL be preserved

#### Scenario: Heading conversion
- **WHEN** a Markdown file contains headings (`#`, `##`, `###`, etc.)
- **THEN** they SHALL be converted to `<h1>`, `<h2>`, `<h3>` JSX elements respectively
- **AND** the heading text SHALL be preserved
- **AND** appropriate CSS classes SHALL be applied

#### Scenario: List conversion
- **WHEN** a Markdown file contains ordered or unordered lists
- **THEN** they SHALL be converted to `<ol>` or `<ul>` JSX elements
- **AND** list items SHALL be converted to `<li>` elements
- **AND** nested lists SHALL be properly handled

#### Scenario: Code block conversion
- **WHEN** a Markdown file contains a standard code block (triple backticks)
- **THEN** it SHALL be converted to a CodeBlock React component
- **AND** the language identifier SHALL be extracted and passed as a prop
- **AND** the code content SHALL be preserved

### Requirement: Custom Component Syntax Parsing
The converter SHALL parse custom component syntax embedded in Markdown.

#### Scenario: CodeBlock component syntax
- **WHEN** a Markdown file contains `<CodeBlock title="..." language="...">code</CodeBlock>`
- **THEN** the converter SHALL parse the component tag and attributes
- **AND** SHALL generate JSX code that renders the CodeBlock component with the specified props
- **AND** SHALL handle nested content correctly

#### Scenario: FlipCard component syntax with onInit function
- **WHEN** a Markdown file contains:
  ```markdown
  <FlipCard width={400} height={300}>
    <onInit>
      {(gl, canvas) => {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0.1, 0.2, 0.3, 1.0)
      }}
    </onInit>
    <codeBlock title="Code" language="javascript">
      gl.viewport(0, 0, canvas.width, canvas.height)
    </codeBlock>
  </FlipCard>
  ```
- **THEN** the converter SHALL parse the `<onInit>` child tag and extract the function code
- **AND** SHALL parse all `<codeBlock>` child tags and convert them to a `codeBlocks` array
- **AND** SHALL generate JSX code:
  ```tsx
  <FlipCard 
    width={400} 
    height={300}
    onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
    }}
    codeBlocks={[
      { title: "Code", code: "gl.viewport(0, 0, canvas.width, canvas.height)", language: "javascript" }
    ]}
  />
  ```
- **AND** SHALL add proper TypeScript type annotations for the `onInit` function parameters

#### Scenario: Component attribute parsing
- **WHEN** parsing component attributes
- **THEN** string attributes SHALL be handled: `title="value"`
- **AND** numeric attributes SHALL be handled: `width={400}`
- **AND** boolean attributes SHALL be handled: `showLineNumbers={true}`
- **AND** function attributes SHALL be handled via nested tags: `<onInit>{(gl, canvas) => {...}}</onInit>`

#### Scenario: FlipCard codeBlock parsing
- **WHEN** a FlipCard component contains multiple `<codeBlock>` tags
- **THEN** the converter SHALL collect all codeBlock tags
- **AND** SHALL convert them to an array of objects with `title`, `code`, and `language` properties
- **AND** SHALL preserve the order of code blocks as they appear in the Markdown

### Requirement: Component Import Generation
The converter SHALL automatically generate import statements for required React components.

#### Scenario: Import generation
- **WHEN** a Markdown file uses CodeBlock, FlipCard, and WebGLCanvas components
- **THEN** the generated React component SHALL include import statements for all used components
- **AND** imports SHALL use relative paths from the generated component location
- **AND** React SHALL be imported if not already present

### Requirement: Content Consistency
The converter SHALL ensure that generated pages have identical content, structure, and functionality as the original React components.

#### Scenario: Visual consistency
- **WHEN** comparing the original React component with the generated component
- **THEN** the rendered HTML structure SHALL be identical
- **AND** all CSS classes SHALL be preserved
- **AND** all styling SHALL match exactly

#### Scenario: Component functionality consistency
- **WHEN** the generated component is rendered
- **THEN** all interactive components (CodeBlock, FlipCard, WebGLCanvas) SHALL work identically to the original
- **AND** all event handlers SHALL function correctly
- **AND** all WebGL code SHALL render and execute correctly

#### Scenario: Content structure consistency
- **WHEN** converting Markdown to React component
- **THEN** all headings, paragraphs, lists, and other content elements SHALL maintain the same hierarchy and structure
- **AND** all text content SHALL be preserved exactly (including whitespace where significant)
- **AND** all code blocks SHALL preserve formatting and syntax highlighting

#### Scenario: Navigation consistency
- **WHEN** the generated chapter component is rendered
- **THEN** the ChapterNavigation component SHALL work identically
- **AND** all links and routes SHALL function correctly
- **AND** the page structure (header, content, footer) SHALL match the original

#### Scenario: Metadata display consistency
- **WHEN** metadata is added to generated components
- **THEN** the metadata display SHALL not interfere with existing content
- **AND** the layout SHALL remain unchanged
- **AND** existing functionality SHALL not be affected

### Requirement: Validation and Testing
The converter SHALL provide mechanisms to validate that generated components match the original components.

#### Scenario: Content comparison
- **WHEN** running the converter
- **THEN** it SHALL provide an option to compare generated components with original components
- **AND** SHALL report any structural differences
- **AND** SHALL warn about potential content mismatches

#### Scenario: Functional testing
- **WHEN** generated components are tested
- **THEN** all interactive features SHALL be verified to work correctly
- **AND** WebGL examples SHALL be tested to ensure they render properly
- **AND** all links and navigation SHALL be verified

### Requirement: Error Handling
The converter SHALL handle errors gracefully and provide useful error messages.

#### Scenario: Invalid Markdown syntax
- **WHEN** a Markdown file contains invalid syntax
- **THEN** the converter SHALL log an error message indicating the file and line number
- **AND** SHALL continue processing other files (if processing multiple files)
- **AND** SHALL exit with a non-zero status code

#### Scenario: Missing component
- **WHEN** a Markdown file references a component that doesn't exist
- **THEN** the converter SHALL log a warning
- **AND** SHALL still generate the component file (with the invalid component reference)
- **AND** SHALL allow the build to continue (runtime error will occur)

#### Scenario: File I/O errors
- **WHEN** the converter cannot read a Markdown file
- **THEN** it SHALL log an error with the file path
- **AND** SHALL continue processing other files
- **AND** SHALL exit with a non-zero status code

### Requirement: Watch Mode
The converter SHALL support a watch mode for development that automatically re-converts files when they change.

#### Scenario: Watch mode activation
- **WHEN** the converter is run with `--watch` flag or in watch mode
- **THEN** it SHALL monitor `content/chapters/` directory for file changes
- **AND** SHALL automatically re-convert files when they are modified, created, or deleted
- **AND** SHALL log conversion activity

#### Scenario: Watch mode performance
- **WHEN** a file is changed in watch mode
- **THEN** only the changed file SHALL be re-converted
- **AND** the conversion SHALL complete within a reasonable time (< 1 second for typical files)

### Requirement: File Metadata Extraction
The converter SHALL extract file metadata from both the file system and Front Matter.

#### Scenario: File system metadata extraction
- **WHEN** converting a Markdown file
- **THEN** the converter SHALL use `fs.statSync()` to get file metadata
- **AND** SHALL extract:
  - `birthtime`: file creation time
  - `mtime`: file last modification time
  - `size`: file size in bytes
- **AND** SHALL convert these to JavaScript Date objects

#### Scenario: Front Matter metadata extraction
- **WHEN** a Markdown file contains YAML Front Matter at the top:
  ```yaml
  ---
  title: "Chapter Title"
  created: "2024-01-15"
  modified: "2024-01-20"
  order: 0
  ---
  ```
- **THEN** the converter SHALL parse the Front Matter using `remark-frontmatter` or similar
- **AND** SHALL extract all defined fields
- **AND** SHALL merge Front Matter metadata with file system metadata
- **AND** Front Matter values SHALL take precedence over file system metadata when both exist

#### Scenario: Metadata in generated component
- **WHEN** converting a Markdown file with metadata
- **THEN** the generated React component SHALL include a `metadata` constant:
  ```tsx
  export const metadata = {
    created: new Date('2024-01-15'),
    modified: new Date('2024-01-20'),
    size: 12345,
    // ... other Front Matter fields
  }
  ```
- **AND** the component SHALL be able to use this metadata for display purposes

#### Scenario: Date formatting
- **WHEN** metadata contains date values
- **THEN** dates from Front Matter SHALL be parsed as ISO date strings or Date objects
- **AND** file system dates SHALL be converted to Date objects
- **AND** dates SHALL be formatted consistently (e.g., ISO 8601 format)

### Requirement: Chapter List and Index Generation
The converter SHALL generate chapter metadata and search index files from Markdown Front Matter.

#### Scenario: Chapter metadata generation
- **WHEN** converting Markdown files
- **THEN** the converter SHALL scan all files in `content/chapters/` directory
- **AND** SHALL extract Front Matter from each file
- **AND** SHALL generate `src/utils/chaptersMetadata.ts` file:
  ```ts
  export const chaptersMetadata = [
    {
      id: 0,
      title: "从零开始创建项目",
      description: "手把手教你创建 canvas 元素...",
      path: "/chapter/0",
      order: 0,
      created: new Date('2024-01-15'),
      modified: new Date('2024-01-20'),
    },
    // ...
  ]
  ```
- **AND** chapters SHALL be sorted by `order` field

#### Scenario: Search index generation
- **WHEN** converting Markdown files
- **THEN** the converter SHALL read site configuration from `content/config.yaml`
- **AND** SHALL read all chapter Front Matter
- **AND** SHALL generate `src/utils/searchIndex.ts` file with search items
- **AND** each search item SHALL include: id, title, description, path, keywords, type

#### Scenario: Home page content conversion
- **WHEN** converting `content/home.md`
- **THEN** the converter SHALL parse the Markdown content
- **AND** SHALL generate or update Home component to use the converted content
- **OR** SHALL generate a data file that Home component imports

### Requirement: Build Integration
The converter SHALL integrate with the existing build process.

#### Scenario: Pre-build conversion
- **WHEN** running `pnpm build`
- **THEN** the converter SHALL run automatically before the Vite build
- **AND** SHALL ensure all Markdown files are converted before building
- **AND** SHALL generate chapter metadata and search index
- **AND** SHALL fail the build if conversion fails

#### Scenario: Development integration
- **WHEN** running `pnpm dev`
- **THEN** the converter SHALL run in watch mode (or a separate watch process)
- **AND** SHALL ensure converted components are available for the development server
- **AND** SHALL regenerate chapter metadata and search index when Markdown files change
- **AND** SHALL work seamlessly with Vite's HMR (Hot Module Replacement)

