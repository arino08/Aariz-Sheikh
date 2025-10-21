# Content Blocks API Reference

## Overview

The blog system uses a flexible JSONB-based content block system that allows you to mix different types of content (paragraphs, images, code, etc.) in a single blog post.

## Block Types

### 1. Paragraph Block

Regular text content.

```typescript
{
  type: 'paragraph',
  text: string
}
```

**Example:**
```json
{
  "type": "paragraph",
  "text": "This is a paragraph with some text content. You can have multiple paragraphs in sequence."
}
```

### 2. Heading Block

Section headings (H1-H6).

```typescript
{
  type: 'heading',
  level: 1 | 2 | 3 | 4 | 5 | 6,
  text: string
}
```

**Example:**
```json
{
  "type": "heading",
  "level": 2,
  "text": "This is a Section Title"
}
```

### 3. Image Block

**This is the key feature** - allows you to insert images between paragraphs!

```typescript
{
  type: 'image',
  src: string,
  alt?: string,
  caption?: string
}
```

**Example:**
```json
{
  "type": "image",
  "src": "https://your-project.supabase.co/storage/v1/object/public/blog-storage/blog-images/image123.jpg",
  "alt": "Descriptive alt text for accessibility",
  "caption": "Optional caption that appears below the image"
}
```

**Uploaded Image URL Format:**
```
https://[project-id].supabase.co/storage/v1/object/public/blog-storage/blog-images/[random-id]-[timestamp].jpg
```

### 4. Code Block

Syntax-highlighted code snippets.

```typescript
{
  type: 'code',
  language: string,
  code: string
}
```

**Example:**
```json
{
  "type": "code",
  "language": "typescript",
  "code": "const greeting: string = 'Hello, World!';\nconsole.log(greeting);"
}
```

**Supported Languages:**
- `javascript`, `typescript`, `python`, `bash`, `sql`, `json`, `html`, `css`, `jsx`, `tsx`

### 5. List Block

Ordered or unordered lists.

```typescript
{
  type: 'list',
  items: string[],
  ordered?: boolean
}
```

**Example:**
```json
{
  "type": "list",
  "items": [
    "First list item",
    "Second list item",
    "Third list item"
  ],
  "ordered": false
}
```

### 6. Quote Block

Blockquotes with optional author attribution.

```typescript
{
  type: 'quote',
  text: string,
  author?: string
}
```

**Example:**
```json
{
  "type": "quote",
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

## Complete Example

Here's a complete blog post with all block types:

```json
[
  {
    "type": "paragraph",
    "text": "Welcome to this comprehensive guide on Next.js development. In this post, we'll explore advanced patterns and best practices."
  },
  {
    "type": "heading",
    "level": 2,
    "text": "Getting Started"
  },
  {
    "type": "paragraph",
    "text": "First, let's look at the basic project structure. Here's what you need to know:"
  },
  {
    "type": "list",
    "items": [
      "Install Node.js 18 or higher",
      "Create a new Next.js project",
      "Configure your environment variables"
    ],
    "ordered": true
  },
  {
    "type": "image",
    "src": "https://project.supabase.co/storage/v1/object/public/blog-storage/blog-images/setup-screenshot.jpg",
    "alt": "Next.js project structure",
    "caption": "A typical Next.js project folder structure"
  },
  {
    "type": "paragraph",
    "text": "After setting up your project, you can start building components. Here's a simple example:"
  },
  {
    "type": "code",
    "language": "typescript",
    "code": "export default function HomePage() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}"
  },
  {
    "type": "heading",
    "level": 2,
    "text": "Best Practices"
  },
  {
    "type": "paragraph",
    "text": "As the creator of React once said:"
  },
  {
    "type": "quote",
    "text": "Learn once, write anywhere.",
    "author": "React Team"
  },
  {
    "type": "paragraph",
    "text": "This philosophy applies perfectly to Next.js development. You can use the same components across different platforms."
  },
  {
    "type": "image",
    "src": "https://project.supabase.co/storage/v1/object/public/blog-storage/blog-images/component-example.jpg",
    "alt": "Reusable React component",
    "caption": "Components can be reused across your application"
  },
  {
    "type": "paragraph",
    "text": "By following these patterns, you'll create maintainable and scalable applications."
  }
]
```

## Using in Admin Panel

### Via TipTap Editor

The admin panel automatically converts your rich text edits to content blocks:

1. **Paragraph**: Just type normally
2. **Headings**: Use H2 or H3 buttons in toolbar
3. **Bold/Italic**: Use formatting buttons
4. **Lists**: Use "List" button
5. **Code Blocks**: Use "Code Block" button
6. **Images**:
   - Click "Upload Image" to upload to Supabase storage
   - OR click "Add Image URL" to use external URL
7. **Quotes**: Use "Quote" button

### Manual JSONB Entry

You can also directly insert JSONB in the Supabase dashboard for advanced use cases:

```sql
UPDATE blog_posts
SET content = '[
  {"type": "paragraph", "text": "Your content here"},
  {"type": "image", "src": "https://...", "caption": "Image caption"}
]'::jsonb
WHERE id = 'post-id-here';
```

## Reading Time Calculation

Reading time is **automatically calculated** from paragraph blocks only (ignores images, code):

- **Formula**: Total words ÷ 200 words/minute
- **Minimum**: 1 minute
- **Automatically updated** when you save or update a post (via database trigger)

## Image Best Practices

### Uploading via Admin Panel

1. Click "Upload Image" in the editor
2. Select image file (JPG, PNG, WebP recommended)
3. Image is uploaded to: `blog-storage/blog-images/`
4. Automatic URL generation
5. Image block inserted at cursor

### Image Optimization

- **Recommended size**: 1200-1600px width
- **Format**: WebP for best compression, or JPG/PNG
- **Quality**: 80-85% (set in ContentPreview)
- **Lazy loading**: Enabled by default
- **Responsive sizes**: Automatically handled

### Cover Images

Cover images should be:
- **Aspect ratio**: 16:9 (e.g., 1600x900px)
- **Format**: JPG or WebP
- **Size**: < 500KB for fast loading

## API Usage

### Fetching Posts with Content Blocks

```typescript
import { fetchPostBySlug } from '@/lib/blogService';

const post = await fetchPostBySlug('my-post-slug');

// post.content is ContentBlock[]
post.content.forEach(block => {
  if (block.type === 'paragraph') {
    console.log('Paragraph:', block.text);
  } else if (block.type === 'image') {
    console.log('Image:', block.src, block.caption);
  }
});
```

### Creating Posts Programmatically

```typescript
import { createPost } from '@/lib/blogService';
import type { ContentBlock } from '@/lib/supabaseClient';

const content: ContentBlock[] = [
  {
    type: 'paragraph',
    text: 'Introduction paragraph...'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-123...',
    alt: 'Beautiful landscape',
    caption: 'A stunning view'
  },
  {
    type: 'paragraph',
    text: 'More content after the image...'
  }
];

await createPost({
  title: 'My New Post',
  slug: 'my-new-post',
  description: 'A great post with inline images',
  content: content,
  cover_image: 'https://...',
  category_id: 'category-uuid',
  tags: ['tech', 'tutorial'],
  is_published: true,
  published_at: new Date().toISOString(),
  author: 'Your Name',
  metadata: null
});
```

## TypeScript Types

```typescript
// From lib/supabaseClient.ts

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string; author?: string };
```

## Rendering Content Blocks

Content blocks are automatically rendered in `ContentPreview.tsx`:

- **Paragraphs**: `<p>` tags with gray text
- **Headings**: `<h1>` - `<h6>` with proper sizing
- **Images**: Next.js `<Image>` with lazy loading
- **Code**: `<pre><code>` with syntax highlighting
- **Lists**: `<ul>` or `<ol>` with `<li>` items
- **Quotes**: `<blockquote>` with optional `<footer>`

## Migration from Plain Text

If you have old posts with plain text content:

```typescript
import { parseContentToBlocks } from '@/lib/blogService';

const oldContent = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
const blocks = parseContentToBlocks(oldContent);

// Update post with blocks
await updatePost(postId, { content: blocks });
```

## Advanced: Custom Block Types

To add custom block types:

1. **Update TypeScript type** in `lib/supabaseClient.ts`:
```typescript
type ContentBlock =
  | // ... existing types
  | { type: 'callout'; text: string; variant: 'info' | 'warning' | 'success' };
```

2. **Update renderer** in `ContentPreview.tsx`:
```typescript
if (block.type === 'callout') {
  return (
    <div className={`p-4 rounded border ${variantStyles[block.variant]}`}>
      {block.text}
    </div>
  );
}
```

3. **Update editor** in `BlockEditor.tsx`:
- Add TipTap extension or custom button
- Convert to/from HTML in `htmlToBlocks` function

## Summary

The content blocks system provides:

- ✅ **Flexibility**: Mix any content types
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Easy Editing**: TipTap visual editor
- ✅ **Performance**: Lazy-loaded images
- ✅ **SEO Friendly**: Proper HTML structure
- ✅ **Image Support**: Upload directly to Supabase storage
- ✅ **Auto Calculation**: Reading time computed automatically

**Key feature**: Insert images anywhere between paragraphs for engaging, visual content!
