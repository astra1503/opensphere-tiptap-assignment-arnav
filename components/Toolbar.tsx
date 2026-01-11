'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Printer,
  FileDown,
} from 'lucide-react'

interface ToolbarProps {
  editor: Editor
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // This will trigger the browser's print dialog where users can save as PDF
    window.print()
  }

  return (
    <div className="toolbar-container no-print">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl shadow-lg p-3 flex flex-wrap items-center gap-2">
          {/* Undo/Redo Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Headings Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Text Formatting Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('bold')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('italic')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('underline')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('strike')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Lists Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('bulletList')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('orderedList')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2.5 rounded-md transition-all ${
                editor.isActive('blockquote')
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1" />

          {/* Actions Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              title="Print Document"
            >
              <Printer className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              title="Export to PDF"
            >
              <FileDown className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
