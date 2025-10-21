"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useRef } from 'react';
import type { ContentBlock } from '@/lib/supabaseClient';

interface BlockEditorProps {
  content: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export default function BlockEditor({ content, onChange, onImageUpload }: BlockEditorProps) {
  // Track first render to avoid initialization issues
  const isFirstRender = useRef(true);

  // Convert content blocks to HTML for TipTap
  const blocksToHTML = useCallback((blocks: ContentBlock[]): string => {
    return blocks
      .map(block => {
        switch (block.type) {
          case 'paragraph':
            return `<p>${block.text}</p>`;
          case 'heading':
            return `<h${block.level}>${block.text}</h${block.level}>`;
          case 'image':
            return `<img src="${block.src}" alt="${block.alt || ''}" data-caption="${block.caption || ''}" />`;
          case 'code':
            return `<pre><code class="language-${block.language}">${block.code}</code></pre>`;
          case 'list':
            const tag = block.ordered ? 'ol' : 'ul';
            const items = block.items.map(item => `<li>${item}</li>`).join('');
            return `<${tag}>${items}</${tag}>`;
          case 'quote':
            return `<blockquote><p>${block.text}</p>${block.author ? `<footer>${block.author}</footer>` : ''}</blockquote>`;
          default:
            return '';
        }
      })
      .join('');
  }, []); // No dependencies needed as this is a pure function

  // Convert HTML to content blocks
  const htmlToBlocks = useCallback((html: string): ContentBlock[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: ContentBlock[] = [];

    doc.body.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        if (element.tagName === 'P') {
          blocks.push({
            type: 'paragraph',
            text: element.textContent || '',
          });
        } else if (/^H[1-6]$/.test(element.tagName)) {
          blocks.push({
            type: 'heading',
            level: parseInt(element.tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6,
            text: element.textContent || '',
          });
        } else if (element.tagName === 'IMG') {
          const img = element as HTMLImageElement;
          blocks.push({
            type: 'image',
            src: img.src,
            alt: img.alt,
            caption: img.dataset.caption,
          });
        } else if (element.tagName === 'PRE') {
          const code = element.querySelector('code');
          if (code) {
            const language = code.className.replace('language-', '') || 'text';
            blocks.push({
              type: 'code',
              language,
              code: code.textContent || '',
            });
          }
        } else if (element.tagName === 'OL' || element.tagName === 'UL') {
          const items = Array.from(element.querySelectorAll('li')).map(li => li.textContent || '');
          blocks.push({
            type: 'list',
            items,
            ordered: element.tagName === 'OL',
          });
        } else if (element.tagName === 'BLOCKQUOTE') {
          const p = element.querySelector('p');
          const footer = element.querySelector('footer');
          blocks.push({
            type: 'quote',
            text: p?.textContent || '',
            author: footer?.textContent,
          });
        }
      }
    });

    return blocks;
  }, []); // No dependencies needed as this is a pure function

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#00d4ff] underline hover:text-[#00ff88]',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post content...',
      }),
    ],
    content: blocksToHTML(content),
    immediatelyRender: false, // Disable SSR to avoid hydration mismatches
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const blocks = htmlToBlocks(html);
      onChange(blocks);
    },
  }, []); // Empty deps array - only create editor once

  // Sync content changes to editor (skip first render to avoid initialization issues)
  useEffect(() => {
    if (!editor) return;

    // Skip the very first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only update if not currently focused (user is not typing)
    if (editor.isFocused) {
      return;
    }

    // Update the editor content
    const html = blocksToHTML(content);
    const currentHtml = editor.getHTML();

    // Only update if the HTML is actually different
    if (html !== currentHtml) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [content, editor, blocksToHTML]);

  const addImage = useCallback(async () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const uploadImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageUpload && editor) {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#0D1117]">
      {/* Toolbar */}
      <div className="border-b border-gray-700 p-2 flex flex-wrap gap-1 bg-[#161b22]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('bold')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('italic')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('code')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Code
        </button>

        <div className="w-px bg-gray-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          H3
        </button>

        <div className="w-px bg-gray-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('bulletList')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('blockquote')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${
            editor.isActive('codeBlock')
              ? 'bg-[#00ff88] text-[#0D1117]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Code Block
        </button>

        <div className="w-px bg-gray-700 mx-1" />

        {onImageUpload && (
          <button
            type="button"
            onClick={uploadImage}
            className="px-3 py-1 rounded text-sm font-mono bg-[#00d4ff] text-[#0D1117] hover:bg-[#00d4ff]/80"
          >
            Upload Image
          </button>
        )}
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-mono bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          Add Image URL
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar" />

      {/* Character count */}
      <div className="border-t border-gray-700 p-2 text-xs text-gray-500 font-mono">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>
    </div>
  );
}
