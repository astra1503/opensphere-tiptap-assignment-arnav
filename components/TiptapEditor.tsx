'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { PaginationPlus, DEFAULT_PAGE_CONFIG } from '@/extensions/pagination'
import { Toolbar } from './Toolbar'

const TiptapEditor = () => {
  const [headerLeft, setHeaderLeft] = useState('USCIS Document')
  const [headerRight, setHeaderRight] = useState('Page {page}')
  const [footerLeft, setFooterLeft] = useState('Confidential')
  const [footerRight, setFooterRight] = useState('Draft - January 2026')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      PaginationPlus.configure({
        // US Letter size configuration (8.5" x 11" at 96 DPI with 1-inch margins)
        ...DEFAULT_PAGE_CONFIG,

        // Header and Footer
        // Available placeholder: {page} for page number
        headerLeft: headerLeft,
        headerRight: headerRight,
        footerLeft: footerLeft,
        footerRight: footerRight,

        // Header click event
        onHeaderClick: ({ event }) => {
          const target = event.target as HTMLElement
          const isLeft = target.closest('.page-header-left')
          const isRight = target.closest('.page-header-right')

          if (isLeft) {
            const newValue = prompt('Edit header left:', headerLeft)
            if (newValue !== null) {
              setHeaderLeft(newValue)
            }
          } else if (isRight) {
            const newValue = prompt('Edit header right (use {page} for page number):', headerRight)
            if (newValue !== null) {
              setHeaderRight(newValue)
            }
          }
        },

        // Footer click event
        onFooterClick: ({ event }) => {
          const target = event.target as HTMLElement
          const isLeft = target.closest('.page-footer-left')
          const isRight = target.closest('.page-footer-right')

          if (isLeft) {
            const newValue = prompt('Edit footer left:', footerLeft)
            if (newValue !== null) {
              setFooterLeft(newValue)
            }
          } else if (isRight) {
            const newValue = prompt('Edit footer right (use {page} for page number):', footerRight)
            if (newValue !== null) {
              setFooterRight(newValue)
            }
          }
        },
      }),
    ],
    content: `
      <p>Start typing your document here...</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[200px]',
      },
    },
  })

  // Update headers/footers when state changes
  useEffect(() => {
    if (!editor) return

    editor.commands.updateHeaderContent(headerLeft, headerRight)
    editor.commands.updateFooterContent(footerLeft, footerRight)
  }, [editor, headerLeft, headerRight, footerLeft, footerRight])

  // Print mode toggle - disable pagination during print
  useEffect(() => {
    if (!editor) return

    const beforePrint = () => {
      // Add print-mode class to trigger CSS changes
      document.body.classList.add('print-mode')
    }

    const afterPrint = () => {
      // Remove print-mode class to restore pagination
      document.body.classList.remove('print-mode')
    }

    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)

    return () => {
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      <div className="overflow-x-auto relative pt-4" id="printableArea">
        <EditorContent
          editor={editor}
          id="editor"
          className="w-full mb-5 editor-container"
        />
      </div>
    </div>
  )
}

export default TiptapEditor
