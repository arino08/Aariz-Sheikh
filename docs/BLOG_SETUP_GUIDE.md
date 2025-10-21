# Blog System - Complete Setup Guide

## 🚀 Features Implemented

### ✅ Supabase Integration
- **Database Schema**: Blog posts with JSONB content blocks, categories, RLS policies
- **Storage**: Image upload to Supabase storage with public access
- **API Layer**: Full CRUD operations with typed functions

### ✅ Admin Panel
- **Location**: `/admin/blog`
- **Authentication**: Simple password protection (default: `az8576`)
- **Rich Text Editor**: TipTap with support for:
  - Paragraphs and headings
  - Bold, italic, code formatting
  - Bullet lists and blockquotes
  - **Image uploads** (directly to Supabase storage)
  - **Inline images between paragraphs**
  - Code blocks with syntax highlighting

### ✅ Blog Interface
- **Terminal Theme**: Matrix rain background, compilation animations
- **Responsive**: Mobile bottom drawer, desktop side-by-side
- **Keyboard Navigation**:
  - `↑/↓` - Navigate posts
  - `Enter` - Open full post
  - `Esc` - Close preview
- **Performance**: Lazy-loaded images, optimized Next.js Image component

### ✅ Content Blocks System
Posts support mixed content blocks:
- **Paragraph blocks**: Regular text content
- **Image blocks**: Images with captions between paragraphs
- **Heading blocks**: H1-H6 headings
- **Code blocks**: Syntax-highlighted code
- **List blocks**: Ordered and unordered lists
- **Quote blocks**: Blockquotes with optional author

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

Packages installed:
- `@supabase/supabase-js` - Supabase client
- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - TipTap extensions
- `@tiptap/extension-image` - Image support
- `@tiptap/extension-link` - Link support
- `@tiptap/extension-placeholder` - Placeholder text

### 2. Supabase Setup

#### A. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### B. Configure Environment Variables
Create `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Secret
NEXT_PUBLIC_ADMIN_SECRET=az8576
```

#### C. Run Database Migrations

In your Supabase SQL Editor, run these files in order:

1. **Schema** (`supabase/schema.sql`):
```bash
# Creates blog_categories and blog_posts tables
# Sets up RLS policies
# Adds indexes for performance
# Creates triggers for auto-updating timestamps and reading time
```

2. **Storage** (`supabase/storage.sql`):
```bash
# Creates blog-storage bucket
# Sets up storage policies for public read, authenticated write
```

3. **Seed Data** (`supabase/seed.sql`):
```bash
# Inserts sample categories
# Creates 5 sample blog posts with inline images
# Demonstrates JSONB content blocks format
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to:
- **Blog**: `http://localhost:3000/blog`
- **Admin**: `http://localhost:3000/admin/blog`

## 📝 Creating Blog Posts

### Using the Admin Panel

1. Go to `/admin/blog`
2. Enter admin password (default: `az8576`)
3. Click "+ New Post"
4. Fill in the form:
   - **Title**: Auto-generates slug
   - **Category**: Select from dropdown
   - **Description**: Brief summary
   - **Cover Image**: Upload or paste URL
   - **Tags**: Comma-separated
   - **Content**: Use the rich text editor
5. **Insert Images Between Paragraphs**:
   - Click "Upload Image" button in toolbar
   - Select image file
   - Image is uploaded to Supabase storage
   - Image block is inserted at cursor position
6. Check "Publish immediately" or save as draft
7. Click "Create Post"

### Content Blocks Format (JSONB)

Example of how content is stored in the database:

```json
[
  {
    "type": "paragraph",
    "text": "This is the first paragraph with some introductory text."
  },
  {
    "type": "heading",
    "level": 2,
    "text": "Main Section Title"
  },
  {
    "type": "paragraph",
    "text": "More content explaining the section..."
  },
  {
    "type": "image",
    "src": "https://your-project.supabase.co/storage/v1/object/public/blog-storage/blog-images/abc123.jpg",
    "alt": "Screenshot of the feature",
    "caption": "Optional caption text"
  },
  {
    "type": "paragraph",
    "text": "Text continues after the image..."
  },
  {
    "type": "code",
    "language": "typescript",
    "code": "const example = 'code block';"
  }
]
```

## 🎨 Customization

### Styling
- **Colors**: Defined in `app/globals.css` (terminal green, orange, blue)
- **Font**: JetBrains Mono (monospace)
- **Animations**: GSAP for 60fps terminal effects

### Admin Password
Change `NEXT_PUBLIC_ADMIN_SECRET` in `.env.local`

### Categories
Add/edit categories in Supabase:
```sql
INSERT INTO blog_categories (name, slug, description, display_order)
VALUES ('YOUR CATEGORY', 'your-category', 'Description', 10);
```

## 🔧 API Functions

All API functions are in `lib/blogService.ts`:

### Public Functions
- `fetchCategories()` - Get all active categories
- `fetchPosts(categoryId?)` - Get published posts
- `fetchPostById(id)` - Get single post (increments views)
- `fetchPostBySlug(slug)` - Get post by slug
- `searchPosts(term)` - Search posts by title/description

### Admin Functions
- `createPost(data)` - Create new post
- `updatePost(id, data)` - Update existing post
- `deletePost(id)` - Delete post
- `fetchAllPostsAdmin()` - Get all posts including drafts
- `uploadImage(file, folder?)` - Upload image to Supabase storage
- `deleteImage(url)` - Delete image from storage

### Utility Functions
- `generateSlug(title)` - Create URL-friendly slug
- `parseContentToBlocks(html)` - Convert HTML to content blocks
- `blocksToPlainText(blocks)` - Extract text for search/preview

## 📱 Keyboard Shortcuts

### Blog Interface
- `↑` - Previous post
- `↓` - Next post
- `Enter` - Open selected post
- `Esc` - Close post preview

## 🎯 Performance Features

### Implemented
- ✅ Lazy-loaded images (loading="lazy")
- ✅ Optimized image sizes with Next.js Image
- ✅ GSAP animations at 60fps
- ✅ Code splitting (dynamic imports)
- ✅ Responsive images with sizes attribute

### To Add (Optional)
- Intersection Observer for scroll animations
- Debounced search input
- Virtual scrolling for large post lists
- Service worker for offline support

## 🐛 Troubleshooting

### Images Not Loading
- Check `next.config.ts` has correct `remotePatterns`
- Verify Supabase storage bucket is public
- Check image URLs are correct in database

### Admin Panel Won't Login
- Verify `NEXT_PUBLIC_ADMIN_SECRET` matches password
- Check environment variables are loaded

### Database Errors
- Ensure schema.sql is run completely
- Check RLS policies are enabled
- Verify Supabase anon key has correct permissions

### Build Errors
- Run `npm run lint` to check for TypeScript errors
- Ensure all dependencies are installed
- Check Node.js version (18+ required)

## 📚 File Structure

```
├── app/
│   ├── admin/blog/page.tsx          # Admin panel
│   ├── blog/page.tsx                # Blog route
│   └── globals.css                  # Animations & styles
├── components/
│   ├── blog/
│   │   ├── BlogInterface.tsx        # Main blog container
│   │   ├── CategoryPanelV2.tsx      # Category navigation
│   │   ├── ContentPreview.tsx       # Post preview
│   │   ├── BlockEditor.tsx          # TipTap editor
│   │   └── SimpleMatrixRain.tsx     # Background effect
│   └── ui/
│       ├── Navigation.tsx           # Compact nav
│       └── TerminalMenu.tsx         # Terminal overlay
├── lib/
│   ├── supabaseClient.ts            # Supabase config & types
│   └── blogService.ts               # API functions
├── supabase/
│   ├── schema.sql                   # Database schema
│   ├── storage.sql                  # Storage setup
│   └── seed.sql                     # Sample data
└── next.config.ts                   # Image domains config
```

## 🚢 Deployment

### Environment Variables
Set in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_SECRET`

### Build Command
```bash
npm run build
```

### Vercel/Netlify
- Auto-detected Next.js project
- Add environment variables in dashboard
- Deploy from GitHub repository

## 📈 Next Steps

### Recommended Enhancements
1. **Authentication**: Replace password with Supabase Auth
2. **Comments**: Add comment system with moderation
3. **Analytics**: Track popular posts, user behavior
4. **SEO**: Add metadata, sitemap, structured data
5. **RSS Feed**: Generate RSS feed for subscribers
6. **Related Posts**: Suggest similar articles
7. **Reading Progress**: Show progress bar while reading
8. **Dark/Light Mode**: Theme switcher
9. **Draft Preview**: Preview draft posts before publishing
10. **Scheduled Publishing**: Set future publish dates

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs
3. Check browser console for errors
4. Verify database schema matches types

## 📄 License

MIT - Feel free to use in your projects!
