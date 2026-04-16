import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import type { BlogPost } from '../data/blogPosts';

export type { BlogPost } from '../data/blogPosts';

const STORAGE_KEY = 'paramount-blog-posts';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const parseStoredPosts = (value: string | null): BlogPost[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as BlogPost[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore invalid storage content
  }
  return [];
};

export const getBlogPosts = (): BlogPost[] => {
  const stored = parseStoredPosts(localStorage.getItem(STORAGE_KEY));
  return stored.length ? stored : defaultBlogPosts;
};

export const getBlogPostById = (id: number): BlogPost | undefined =>
  getBlogPosts().find((post) => post.id === id);

export const getBlogPostBySlug = (slug?: string): BlogPost | undefined =>
  getBlogPosts().find((post) => post.slug === slug);

export const saveBlogPosts = (posts: BlogPost[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return posts;
};

export const createBlogPost = (post: Omit<BlogPost, 'id'>) => {
  const posts = getBlogPosts();
  const newPost: BlogPost = {
    ...post,
    id: Date.now(),
    slug: post.slug ? slugify(post.slug) : slugify(post.title),
  };
  const updated = [newPost, ...posts];
  saveBlogPosts(updated);
  return newPost;
};

export const updateBlogPost = (id: number, post: Omit<BlogPost, 'id'>) => {
  const posts = getBlogPosts();
  const updated = posts.map((existing) =>
    existing.id === id
      ? { ...existing, ...post, slug: post.slug ? slugify(post.slug) : slugify(post.title) }
      : existing
  );
  saveBlogPosts(updated);
  return updated.find((entry) => entry.id === id);
};

export const deleteBlogPost = (id: number) => {
  const posts = getBlogPosts();
  const filtered = posts.filter((post) => post.id !== id);
  saveBlogPosts(filtered);
  return filtered;
};
