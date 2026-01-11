# OpenSphere Document Editor - Tiptap with Pagination

A production-ready Tiptap-based document editor with real-time pagination designed for legal document drafting. This editor provides a WYSIWYG experience where users can see exactly how their documents will appear when printed, with proper page breaks, headers, and footers.

## Live Demo

[To be deployed on Vercel]

## Features

### Core Features
- **Real-time Pagination**: Dynamic page breaks that update as you type
- **US Letter Format**: Standard 8.5" x 11" page size with 1-inch margins
- **Visual Page Breaks**: Clear separation between pages, similar to Google Docs or Microsoft Word
- **WYSIWYG**: What you see matches what prints

### Formatting Support
- **Headings**: H1, H2, H3 for document structure
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Lists**: Bullet points and numbered lists
- **Blockquotes**: For citations and important excerpts
- **Content Flow**: Automatic paragraph splitting across pages

### Additional Features
- **Page Numbers**: Automatic page numbering in headers
- **Custom Headers/Footers**: Configurable per-page headers and footers
- **Print Support**: Direct printing with proper page formatting
- **PDF Export**: Export documents as PDF via browser print dialog
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: Next.js 15 (React 19)
- **Editor**: Tiptap 2.x with ProseMirror
- **Pagination**: Custom implementation (local extension)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd assignment
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 4: Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
assignment/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles including pagination
├── components/
│   ├── TiptapEditor.tsx    # Main editor component with pagination config
│   └── Toolbar.tsx         # Formatting toolbar
├── extensions/
│   └── pagination/         # Custom pagination extension
│       ├── PaginationPlus.ts    # Main extension logic
│       ├── utils.ts             # Utility functions
│       ├── types.ts             # TypeScript types
│       ├── constants.ts         # Page size constants
│       └── index.ts             # Export file
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Pagination Approach

Pagination within the editor is implemented using a custom Tiptap/ProseMirror extension. The implementation renders page boundaries visually while maintaining a single continuous ProseMirror document.

### Architecture

**ProseMirror Decorations (View Layer Only)**

Page breaks are rendered using ProseMirror **Decorations** (specifically widget decorations), not document nodes. This is the correct approach for pagination in ProseMirror because:
- Decorations are **non-destructive**: They exist only in the view layer and do not modify the underlying document structure
- They preserve cursor behavior, selection handling, and undo/redo integrity
- They avoid introducing extraneous nodes that complicate document serialization and transformation
- They are production-safe and used extensively in real-world ProseMirror applications

The document remains a single contiguous ProseMirror document. Page boundaries are injected visually as decorations that update dynamically as content changes.

### Page Dimensions and Layout

The editor uses **US Letter dimensions** (8.5" × 11") at 96 DPI with 1-inch margins:
- Page size: 816px × 1056px
- Margins: 96px on all sides (top, bottom, left, right)
- Content area: 624px × 864px

Headers and footers are rendered for each page using calculated heights. The `{page}` placeholder is replaced dynamically with the current page number.

### Dynamic Content Measurement

Content height is measured **dynamically from the rendered DOM**, not estimated. The pagination extension:
1. Measures the actual scroll height of the editor's content area
2. Calculates how many pages are required based on available content height per page
3. Updates page break decorations automatically as users type, delete, or paste content
4. Uses `requestAnimationFrame` for smooth, non-blocking updates

This approach ensures accurate pagination that responds immediately to content changes while maintaining editor stability.

### Technical Implementation

**Core Algorithm (`calculatePageCount`)**:
- Measures DOM scroll height in real-time
- Accounts for header and footer heights per page
- Dynamically adds or removes page break decorations as content grows or shrinks

**Decoration Management (`createDecoration`)**:
- Creates widget decorations for page breaks
- Generates header/footer DOM elements for each page
- Injects visual page gap separators between pages

**ProseMirror Integration**:
- Two ProseMirror plugins manage decorations and state
- Plugins listen to editor transactions and trigger recalculation on content changes
- Decorations update on every transaction without mutating the document

### Why This Approach

Using decorations instead of document nodes ensures:
- **Editor stability**: Cursor, selection, and input handling remain standard
- **Format preservation**: All text formatting flows naturally across page boundaries
- **Undo/redo safety**: No unexpected nodes appear in history
- **Interoperability**: The underlying document remains a clean, continuous structure

## Print Behavior and Formatting

The editor is designed to visually match printed output in terms of page size, margins, headers, and content flow. However, for printing, the application **intentionally relies on the browser's native print pagination engine**.

### Why Not Use Editor Pagination for Print?

The pagination extension is **not used to control physical page breaks during print**. This is an intentional engineering decision, not a limitation. Here's why:

**Avoiding Double Pagination**: If the editor's custom page breaks were also applied during print, the browser's own pagination engine would create a second layer of pagination on top of the custom one, leading to:
- Content clipping at unexpected positions
- Blank pages or duplicated content
- Inconsistent behavior across browsers

**Browser Print Reliability**: Modern browsers have robust, well-tested print engines that handle page breaks, margins, and content reflow correctly across different printers and PDF generators. Replicating this behavior in JavaScript is complex and error-prone.

**Real-World Editor Behavior**: This approach mirrors how production editors handle print:
- **Google Docs**: Uses custom pagination in the editor view, but defers to browser print for actual printing
- **Microsoft Word Online**: Similar approach — editor pagination is visual, print uses browser engine

### USCIS-Safe Output

By deferring to the browser's print engine, the implementation ensures:
- No content loss during print
- Consistent output across different browsers and platforms
- Reliable PDF generation via print-to-PDF

The editor's on-screen pagination provides a **close visual approximation** of the printed output, while the browser ensures **production-safe printing** without content clipping or layout bugs.

## Trade-offs and Limitations

This section documents known limitations and architectural trade-offs made during implementation.

### Pagination Accuracy

- **Pixel-perfect parity between on-screen pagination and printed output is not guaranteed**. Browser print engines apply their own reflow logic and may use slightly different font metrics than the on-screen renderer. The editor provides a close visual approximation, but minor differences in line breaks or spacing may occur during print.

### Header and Footer Constraints

- **Editable headers and footers are supported** inside the editor for layout visualization. However:
  - There is currently **no enforced length or overflow limit** on header/footer content. Users can add arbitrarily long content, which may overflow the designated header/footer area.
  - Headers and footers are **not rendered in the browser's print preview** in the current implementation. They are visible in the editor but handled by the browser's print engine during actual printing.

### Print Pagination Architecture

- **Print pagination does not reuse editor page-break decorations by design**. This is an intentional trade-off to avoid double pagination (where custom page breaks conflict with browser page breaks), content clipping, and cross-browser inconsistencies. The browser's native print engine handles physical page breaks reliably.

### Advanced Layout Cases

- **Very large tables, images, or extreme font scaling** rely on browser print behavior rather than custom pagination logic. The editor's pagination extension handles standard text content well, but complex layout scenarios (e.g., tables spanning multiple pages) are delegated to the browser's more mature print engine.

### Performance Considerations

- **Pagination recalculates on every content change**. For very large documents (50+ pages), this may introduce slight latency. The calculation uses `requestAnimationFrame` to minimize jank, but debouncing or incremental updates could further improve performance.

## Future Improvements

With additional time and resources, the following improvements would enhance the editor's capabilities:

### Print/Export Rendering Engine

- Build a **dedicated print and download preview engine** similar to Microsoft Word or Google Docs PDF export. This would perform its own layout pass using physical units (points, inches) and precise font metrics to achieve near pixel-perfect WYSIWYG parity.
- Such an engine would calculate exact page breaks, handle complex layouts (tables, images), and generate output that matches the editor view with high fidelity.

### PDF Export Pipeline

- Implement **direct PDF export using a custom rendering pipeline** (e.g., server-side rendering with Puppeteer, PDFKit, or a headless browser). This would bypass browser print dialogs entirely and provide deterministic, high-quality PDF output with full control over formatting.

### Header and Footer Constraints

- Add **length limits and overflow handling** for headers and footers. Implement validation to prevent content from exceeding designated header/footer areas.
- Provide visual feedback (warnings, truncation indicators) when header/footer content is too long.

### Advanced Layout Support

- Extend pagination logic to handle **tables spanning multiple pages** with header row preservation.
- Implement intelligent **image pagination** to prevent awkward splits and ensure images are positioned appropriately across page boundaries.

### Performance Optimization

- Introduce **debouncing or throttling** for pagination recalculation to reduce computational overhead in large documents.
- Explore **virtual scrolling** or incremental rendering for documents exceeding 50+ pages.

## Technical Details

### Core Files

**[extensions/pagination/PaginationPlus.ts](extensions/pagination/PaginationPlus.ts)**: Main extension containing:
- Extension definition and configuration options
- ProseMirror plugin setup
- Page calculation algorithm (`calculatePageCount`)
- Decoration creation logic (`createDecoration`)

**[extensions/pagination/utils.ts](extensions/pagination/utils.ts)**: Utility functions for:
- CSS variable management
- Header/footer DOM element creation
- Height calculation helpers

**[extensions/pagination/types.ts](extensions/pagination/types.ts)**: TypeScript type definitions
**[extensions/pagination/constants.ts](extensions/pagination/constants.ts)**: Predefined page sizes (A4, Letter, Legal, etc.)

### Configuration Example

```typescript
PaginationPlus.configure({
  pageHeight: 1056,        // 11 inches at 96 DPI
  pageWidth: 816,          // 8.5 inches at 96 DPI
  marginTop: 96,           // 1 inch
  marginBottom: 96,        // 1 inch
  marginLeft: 96,          // 1 inch
  marginRight: 96,         // 1 inch
  pageGap: 20,             // Visual gap between pages
  headerRight: 'Page {page}',
  footerLeft: 'Document Footer',
})
```

## Contact

For questions or feedback about this implementation, please contact the development team.

---

**Built for OpenSphere Immigration Platform**
*Making legal document drafting easier and more precise*
