-- Seed data for blog with JSONB content blocks including inline images

-- Sample blog posts with content blocks
INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'Building Modern Web Applications with Next.js 15',
  'building-modern-web-apps-nextjs-15',
  'Discover the latest features in Next.js 15 and learn how to build blazing-fast web applications with the App Router, Server Components, and advanced optimization techniques.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Next.js 15 introduces groundbreaking features that revolutionize how we build modern web applications. In this comprehensive guide, we''ll explore the App Router, Server Components, and performance optimizations that make Next.js the go-to framework for production applications.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'App Router Architecture'),
    jsonb_build_object('type', 'paragraph', 'text', 'The new App Router in Next.js 15 provides a file-system based routing solution that supports layouts, nested routes, and loading states. It leverages React Server Components to reduce client-side JavaScript and improve performance.'),
    jsonb_build_object(
      'type', 'image',
      'src', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      'alt', 'Code editor showing Next.js project',
      'caption', 'Next.js App Router structure in VS Code'
    ),
    jsonb_build_object('type', 'paragraph', 'text', 'Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client. This results in faster page loads and better SEO performance.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Performance Optimization'),
    jsonb_build_object('type', 'paragraph', 'text', 'Next.js 15 introduces several performance optimizations including improved image optimization, automatic code splitting, and enhanced caching strategies. These features work together to create lightning-fast user experiences.')
  ),
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
  'Aariz Sheikh',
  ARRAY['Next.js', 'React', 'Web Development', 'Performance'],
  true,
  NOW()
FROM blog_categories cat WHERE cat.slug = 'code'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'Docker Containerization: From Zero to Production',
  'docker-containerization-zero-to-production',
  'Master Docker containerization with this comprehensive guide. Learn how to build, deploy, and manage containerized applications in production environments.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Docker has revolutionized the way we build, ship, and run applications. By containerizing applications, we ensure consistency across development, testing, and production environments.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Why Docker Matters'),
    jsonb_build_object('type', 'paragraph', 'text', 'Containers solve the classic "it works on my machine" problem by packaging applications with all their dependencies. This ensures that your application runs identically regardless of where it''s deployed.'),
    jsonb_build_object(
      'type', 'image',
      'src', 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800',
      'alt', 'Docker containers visualization',
      'caption', 'Docker container architecture and orchestration'
    ),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Building Production-Ready Images'),
    jsonb_build_object('type', 'paragraph', 'text', 'Creating efficient Docker images requires understanding multi-stage builds, layer caching, and security best practices. A well-optimized image can be 10x smaller than a naive implementation.'),
    jsonb_build_object('type', 'code', 'language', 'dockerfile', 'code', E'FROM node:18-alpine AS base\n\nFROM base AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n\nFROM base AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build\n\nFROM base AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCMD ["node", "dist/index.js"]'),
    jsonb_build_object('type', 'paragraph', 'text', 'This multi-stage build approach keeps the final image lean while maintaining a clean development workflow.')
  ),
  'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200',
  'Aariz Sheikh',
  ARRAY['Docker', 'DevOps', 'Containerization', 'Tutorial'],
  true,
  NOW() - INTERVAL '1 day'
FROM blog_categories cat WHERE cat.slug = 'tutorials'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'Advanced TypeScript: Type-Safe Development at Scale',
  'advanced-typescript-type-safe-development',
  'Dive deep into advanced TypeScript patterns, generics, and type manipulation techniques to build robust, maintainable applications.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'TypeScript has become the standard for building large-scale JavaScript applications. Its powerful type system catches bugs at compile-time and provides excellent IDE support for better developer experience.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Generics and Type Inference'),
    jsonb_build_object('type', 'paragraph', 'text', 'Generics allow you to write flexible, reusable code while maintaining type safety. TypeScript''s type inference engine can often figure out types automatically, reducing boilerplate.'),
    jsonb_build_object(
      'type', 'image',
      'src', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      'alt', 'TypeScript code on screen',
      'caption', 'Advanced TypeScript patterns in action'
    ),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Utility Types and Mapped Types'),
    jsonb_build_object('type', 'paragraph', 'text', 'TypeScript provides powerful utility types like Partial, Pick, Omit, and Record. Combined with mapped types and conditional types, you can create sophisticated type transformations.'),
    jsonb_build_object('type', 'paragraph', 'text', 'Understanding these advanced patterns enables you to write code that is both flexible and type-safe, catching errors before they reach production.')
  ),
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200',
  'Aariz Sheikh',
  ARRAY['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
  true,
  NOW() - INTERVAL '2 days'
FROM blog_categories cat WHERE cat.slug = 'code'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'WebGL and Three.js: Creating Immersive 3D Experiences',
  'webgl-threejs-immersive-3d-experiences',
  'Learn how to create stunning 3D web experiences using Three.js and WebGL. From basic scenes to advanced shaders and animations.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Three.js makes WebGL accessible to web developers, enabling the creation of immersive 3D experiences that run directly in the browser without plugins.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Getting Started with Three.js'),
    jsonb_build_object('type', 'paragraph', 'text', 'A Three.js scene consists of three main components: a scene to hold objects, a camera to define the viewpoint, and a renderer to display the scene. Let''s build our first 3D scene.'),
    jsonb_build_object(
      'type', 'image',
      'src', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      'alt', '3D graphics and coding',
      'caption', '3D rendering pipeline visualization'
    ),
    jsonb_build_object('type', 'paragraph', 'text', 'Once you understand the basics, you can create complex animations, implement custom shaders, and build interactive 3D experiences that respond to user input.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Performance Optimization'),
    jsonb_build_object('type', 'paragraph', 'text', 'WebGL performance is critical for smooth 60fps experiences. Techniques like frustum culling, level-of-detail, and efficient geometry management ensure your 3D scenes run smoothly even on mobile devices.')
  ),
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
  'Aariz Sheikh',
  ARRAY['WebGL', 'Three.js', '3D Graphics', 'JavaScript'],
  true,
  NOW() - INTERVAL '3 days'
FROM blog_categories cat WHERE cat.slug = 'projects'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'Mastering GSAP: Advanced Web Animations',
  'mastering-gsap-advanced-web-animations',
  'Unlock the full potential of GSAP for creating smooth, performant web animations. Learn timelines, ScrollTrigger, and advanced easing functions.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'GSAP (GreenSock Animation Platform) is the industry-standard JavaScript animation library trusted by major companies worldwide. It provides silky-smooth 60fps animations with an intuitive API.'),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'Why Choose GSAP?'),
    jsonb_build_object('type', 'paragraph', 'text', 'Unlike CSS animations, GSAP gives you precise control over every aspect of your animations. It handles complex sequencing, provides advanced easing options, and works consistently across all browsers.'),
    jsonb_build_object(
      'type', 'image',
      'src', 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
      'alt', 'Animation and motion graphics',
      'caption', 'Smooth animations with GSAP'
    ),
    jsonb_build_object('type', 'heading', 'level', 2, 'text', 'ScrollTrigger Plugin'),
    jsonb_build_object('type', 'paragraph', 'text', 'ScrollTrigger is GSAP''s most popular plugin, enabling scroll-based animations with minimal code. Create parallax effects, reveal animations, and scroll-driven sequences effortlessly.'),
    jsonb_build_object('type', 'paragraph', 'text', 'With GSAP, you can create award-winning animations that enhance user experience without sacrificing performance.')
  ),
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200',
  'Aariz Sheikh',
  ARRAY['GSAP', 'Animation', 'Frontend', 'JavaScript'],
  true,
  NOW() - INTERVAL '4 days'
FROM blog_categories cat WHERE cat.slug = 'tutorials'
ON CONFLICT (slug) DO NOTHING;

-- Add a draft post example
INSERT INTO blog_posts (
  category_id,
  title,
  slug,
  description,
  content,
  cover_image,
  author,
  tags,
  is_published,
  published_at
)
SELECT
  cat.id,
  'The Future of Web Development: Trends for 2026',
  'future-web-development-trends-2026',
  'Exploring upcoming trends in web development including AI-assisted coding, edge computing, and the evolution of web frameworks.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'This is a draft post exploring future trends...'),
    jsonb_build_object('type', 'paragraph', 'text', 'Content being developed...')
  ),
  'https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=1200',
  'Aariz Sheikh',
  ARRAY['Web Development', 'Trends', 'Future'],
  false,
  NULL
FROM blog_categories cat WHERE cat.slug = 'thoughts'
ON CONFLICT (slug) DO NOTHING;
