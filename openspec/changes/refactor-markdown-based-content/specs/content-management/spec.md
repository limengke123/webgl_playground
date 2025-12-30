# Content Management Specification

## ADDED Requirements

### Requirement: Markdown-based Content Storage
The system SHALL store all chapter content in Markdown format files, separate from React component code.

#### Scenario: Content file structure
- **WHEN** a user creates a new chapter
- **THEN** the content SHALL be stored in `content/chapters/chapter-{id}.md`
- **AND** the file SHALL contain Markdown-formatted text with support for custom React components

#### Scenario: Content separation
- **WHEN** viewing the project structure
- **THEN** content files SHALL be located in `content/` directory
- **AND** React components SHALL be located in `src/` directory
- **AND** these directories SHALL be clearly separated

### Requirement: Custom Component Support in Markdown
The system SHALL support embedding React components within Markdown content using a custom syntax.

#### Scenario: CodeBlock component in Markdown
- **WHEN** a Markdown file contains `<CodeBlock title="..." language="...">code content</CodeBlock>`
- **THEN** the converter SHALL render it as a CodeBlock React component with the specified props
- **AND** the code content SHALL be properly formatted and syntax-highlighted

#### Scenario: FlipCard component in Markdown with WebGL code
- **WHEN** a Markdown file contains:
  ```markdown
  <FlipCard width={400} height={300}>
    <onInit>
      {(gl, canvas) => {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0.1, 0.2, 0.3, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }}
    </onInit>
    <codeBlock title="JavaScript 代码" language="javascript">
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    </codeBlock>
  </FlipCard>
  ```
- **THEN** the converter SHALL render it as a FlipCard React component
- **AND** the onInit function SHALL be properly converted to a TypeScript arrow function
- **AND** the WebGL canvas SHALL render correctly with the provided initialization code
- **AND** users SHALL be able to flip between the demo view (WebGL canvas) and code view
- **AND** the code blocks SHALL display with proper syntax highlighting

#### Scenario: WebGLCanvas component in Markdown
- **WHEN** a Markdown file contains `<WebGLCanvas>...</WebGLCanvas>`
- **THEN** the converter SHALL render it as a WebGLCanvas React component

### Requirement: Markdown to React Component Conversion
The system SHALL automatically convert Markdown files to React component files during the build process.

#### Scenario: Build-time conversion
- **WHEN** running `pnpm build`
- **THEN** all Markdown files in `content/chapters/` SHALL be converted to React components
- **AND** the generated components SHALL be placed in `src/pages/chapters/`
- **AND** the conversion SHALL happen before the Vite build process

#### Scenario: Development watch mode
- **WHEN** running `pnpm dev:convert` or development server with watch mode
- **THEN** the converter SHALL watch for changes in Markdown files
- **AND** SHALL automatically regenerate React components when Markdown files are modified
- **AND** the development server SHALL hot-reload the updated components

#### Scenario: Generated component structure
- **WHEN** a Markdown file is converted
- **THEN** the generated React component SHALL:
  - Export a default function component
  - Import necessary React components (CodeBlock, FlipCard, WebGLCanvas, ChapterNavigation)
  - Render the Markdown content as JSX
  - Maintain the same structure and functionality as manually written components

### Requirement: Content File Naming Convention
The system SHALL use a consistent naming convention for content files.

#### Scenario: Chapter file naming
- **WHEN** creating a new chapter file
- **THEN** the file SHALL be named `chapter-{id}.md` where `{id}` is the chapter number (0, 1, 2, etc.)
- **AND** the file SHALL be located in `content/chapters/` directory

#### Scenario: Home page content file
- **WHEN** creating the home page content
- **THEN** the file SHALL be named `home.md`
- **AND** the file SHALL be located in `content/` directory
- **AND** the file SHALL contain Markdown content for the home page

#### Scenario: Site configuration file
- **WHEN** configuring site-wide settings
- **THEN** the configuration SHALL be stored in `content/config.yaml`
- **AND** the file SHALL contain YAML-formatted site metadata (title, description, etc.)

### Requirement: Dynamic Chapter List Generation
The system SHALL automatically generate chapter list from Markdown Front Matter, eliminating the need to manually maintain chapter arrays in React components.

#### Scenario: Chapter list generation
- **WHEN** running the conversion script
- **THEN** it SHALL scan all Markdown files in `content/chapters/` directory
- **AND** SHALL extract Front Matter from each file (title, description, order, etc.)
- **AND** SHALL generate `src/utils/chaptersMetadata.ts` file containing an array of chapter metadata
- **AND** chapters SHALL be sorted by the `order` field from Front Matter

#### Scenario: Chapter list usage in Home page
- **WHEN** the Home component renders
- **THEN** it SHALL import `chaptersMetadata` from `src/utils/chaptersMetadata.ts`
- **AND** SHALL use this metadata to render the chapter list
- **AND** SHALL NOT contain hardcoded chapter arrays

#### Scenario: Adding a new chapter
- **WHEN** a user creates a new Markdown file `content/chapters/chapter-11.md` with Front Matter
- **THEN** running the conversion script SHALL automatically include it in the generated chapter list
- **AND** the new chapter SHALL appear in the home page chapter list
- **AND** no manual code changes SHALL be required

### Requirement: Dynamic Search Index Generation
The system SHALL automatically generate search index from Markdown metadata and site configuration.

#### Scenario: Search index generation
- **WHEN** running the conversion script
- **THEN** it SHALL read all chapter Markdown files and extract Front Matter
- **AND** SHALL read site configuration from `content/config.yaml`
- **AND** SHALL generate `src/utils/searchIndex.ts` file containing search items
- **AND** each search item SHALL include: id, title, description, path, keywords, type

#### Scenario: Search index structure
- **WHEN** viewing the generated search index
- **THEN** it SHALL contain entries for:
  - Home page (from config.yaml)
  - Playground page (from config.yaml)
  - All chapters (from chapter Front Matter)
- **AND** keywords SHALL be extracted from Front Matter or generated from content

### Requirement: File Metadata Support
The system SHALL support file metadata (creation date, modification date, etc.) and make it available in generated pages.

#### Scenario: Metadata display in chapter page
- **WHEN** viewing a chapter page generated from Markdown
- **THEN** the page SHALL display the last modification date
- **AND** the date SHALL be formatted in a user-friendly way (e.g., "最后更新：2024年1月20日")
- **AND** the date SHALL be displayed at the bottom of the page or in a metadata section

#### Scenario: Metadata in chapter list
- **WHEN** viewing the home page with chapter list
- **THEN** each chapter card SHALL optionally display metadata (last updated date)
- **AND** chapters SHALL be sortable by modification date (if sorting feature is implemented)

#### Scenario: Metadata source priority
- **WHEN** a Markdown file has both Front Matter metadata and file system metadata
- **THEN** Front Matter values SHALL take precedence
- **AND** file system metadata SHALL be used as fallback when Front Matter is not available
- **AND** modification date SHALL always reflect the actual file modification time (from file system)

#### Scenario: Metadata format
- **WHEN** metadata is displayed
- **THEN** dates SHALL be formatted according to locale (Chinese locale: "YYYY年MM月DD日")
- **AND** dates SHALL be human-readable
- **AND** relative dates MAY be used (e.g., "3天前更新") if appropriate

### Requirement: Preserve Existing Functionality
The system SHALL maintain all existing features and functionality after migration to Markdown-based content.

#### Scenario: Identical page rendering
- **WHEN** viewing a page generated from Markdown
- **THEN** the page SHALL look and function identically to the original React component
- **AND** all visual elements SHALL be in the same positions
- **AND** all styling SHALL match exactly
- **AND** all interactive features SHALL work the same way

#### Scenario: Component behavior preservation
- **WHEN** using interactive components in generated pages
- **THEN** CodeBlock components SHALL have the same copy functionality
- **AND** FlipCard components SHALL flip between demo and code views identically
- **AND** WebGLCanvas components SHALL render WebGL content correctly
- **AND** ChapterNavigation SHALL navigate correctly

#### Scenario: Content accuracy
- **WHEN** comparing original and generated content
- **THEN** all text content SHALL be identical (character-by-character)
- **AND** all code examples SHALL be preserved exactly
- **AND** all formatting SHALL be maintained
- **AND** no content SHALL be lost or altered during conversion

#### Scenario: Code block functionality
- **WHEN** viewing a chapter page
- **THEN** code blocks SHALL display with syntax highlighting
- **AND** code blocks SHALL support copy-to-clipboard functionality
- **AND** code blocks SHALL support line numbers for long code

#### Scenario: Interactive WebGL examples
- **WHEN** viewing a chapter with FlipCard components containing WebGL code
- **THEN** the WebGL canvas SHALL render correctly with the specified initialization code
- **AND** the onInit function SHALL execute when the canvas is mounted
- **AND** users SHALL be able to flip between demo view (showing WebGL canvas) and code view (showing code blocks)
- **AND** the WebGL rendering SHALL match the behavior of the original React component implementation
- **AND** all WebGL API calls in the onInit function SHALL work correctly (gl.viewport, gl.clearColor, gl.clear, etc.)

#### Scenario: Navigation
- **WHEN** viewing any chapter page
- **THEN** the ChapterNavigation component SHALL display correctly
- **AND** users SHALL be able to navigate to previous/next chapters

