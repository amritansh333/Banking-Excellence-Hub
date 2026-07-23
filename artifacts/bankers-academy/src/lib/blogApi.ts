const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE = `${API_BASE}/api`;

export type BlogLookup = {
  id: number;
  name: string;
  slug?: string;
};

export type BlogLookupWithCount = BlogLookup & {
  count: number;
};

export type BlogCourse = BlogLookup & {
  shortDescription: string | null;
  thumbnailUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  content: string;
  status: string;
  publishedAt: string | null;
  modifiedAt: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  author: (BlogLookup & { bio: string | null; avatarUrl: string | null }) | null;
  category: BlogLookup | null;
  tags: BlogLookup[];
  relatedPosts: Pick<BlogPost, "id" | "title" | "slug" | "excerpt" | "featuredImageUrl" | "publishedAt">[];
  relatedCourses: BlogCourse[];
  readingTime: string;
};

export type BlogDetailResponse = {
  blog: BlogPost;
  previousBlog: BlogPost | null;
  nextBlog: BlogPost | null;
  relatedBlogs: BlogPost["relatedPosts"];
};

export type BlogListResponse = {
  items: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BlogListParams = {
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

function toQuery(params: BlogListParams = {}): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchPublicBlogs(params: BlogListParams = {}): Promise<BlogListResponse> {
  const response = await fetch(`${BASE}/blogs${toQuery(params)}`);
  if (!response.ok) throw new Error("Unable to load blogs.");
  return response.json();
}

export async function fetchPublicBlog(slug: string): Promise<BlogDetailResponse> {
  const response = await fetch(`${BASE}/blogs/${slug}`);
  if (!response.ok) {
    const error = new Error(response.status === 404 ? "Blog not found." : "Unable to load blog.");
    error.name = String(response.status);
    throw error;
  }
  return response.json();
}

export async function fetchPublicBlogCategories(): Promise<BlogLookupWithCount[]> {
  const response = await fetch(`${BASE}/blogs/categories`);
  if (!response.ok) throw new Error("Unable to load blog categories.");
  return response.json();
}

export async function fetchPublicBlogTags(): Promise<BlogLookupWithCount[]> {
  const response = await fetch(`${BASE}/blogs/tags`);
  if (!response.ok) throw new Error("Unable to load blog tags.");
  return response.json();
}

export async function fetchPopularBlogs(limit = 4): Promise<BlogPost[]> {
  const response = await fetch(`${BASE}/blogs/popular?limit=${limit}`);
  if (!response.ok) throw new Error("Unable to load popular blogs.");
  return response.json();
}

export async function fetchLatestBlogs(limit = 4): Promise<BlogPost[]> {
  const response = await fetch(`${BASE}/blogs/latest?limit=${limit}`);
  if (!response.ok) throw new Error("Unable to load latest blogs.");
  return response.json();
}

export function formatBlogDate(value: string | null): string {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}
