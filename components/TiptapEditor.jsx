'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@tiptap/extension-font-size'
import { BulletList } from '@tiptap/extension-bullet-list'
import { ListItem } from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import React, { useEffect } from 'react'

const extensions = [
  StarterKit.configure({
    bulletList: false,
    listItem: false,
  }),
  BulletList,
  ListItem,
  TextStyle,
  FontFamily.configure({ types: ['textStyle'] }),
  FontSize.configure({ types: ['textStyle'] }),
  Link.configure({ openOnClick: false, autolink: true }),
]

const buttonStyle = (active) =>
  `px-2 py-1 border text-sm rounded transition ${active ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`

const MenuBar = ({ editor }) => {
  if (!editor) return null

  const setLink = () => {
    const url = prompt('Enter URL')
    if (!url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonStyle(editor.isActive('bold'))}
      >
        Bold
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonStyle(editor.isActive('italic'))}
      >
        Italic
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonStyle(editor.isActive('strike'))}
      >
        Strike
      </button>

      <button
        onClick={setLink}
        className={buttonStyle(editor.isActive('link'))}
      >
        Link
      </button>

      <button
        onClick={unsetLink}
        className="px-2 py-1 border text-sm rounded bg-white hover:bg-gray-100"
      >
        Unlink
      </button>

      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">Default Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>

      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">Default Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="24px">24px</option>
      </select>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList')
            ? 'bg-gray-800 text-white px-2 py-1 rounded'
            : 'px-2 py-1'
        }
      >
        Bullet List
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="px-2 py-1 border text-sm rounded bg-white hover:bg-gray-100"
      >
        Undo
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="px-2 py-1 border text-sm rounded bg-white hover:bg-gray-100"
      >
        Redo
      </button>
    </div>
  )
}

const TipTapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value])

  if (!editor) return null

  return (
    <div className="border p-4 rounded-lg bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
    </div>
  )
}

export default TipTapEditor
