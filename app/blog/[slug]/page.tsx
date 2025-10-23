import { notFound } from 'next/navigation';
import BlogPostView from '@/components/blog/BlogPostView';
import { fetchPostBySlug } from '@/lib/blogService';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = await fetchPostBySlug(slug);

    if (!post || !post.is_published) {
      notFound();
    }

    return <BlogPostView post={post} />;
  } catch {
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = await fetchPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    return {
      title: `${post.title} | Aariz Sheikh`,
      description: post.description || post.title,
      openGraph: {
        title: post.title,
        description: post.description || post.title,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}
