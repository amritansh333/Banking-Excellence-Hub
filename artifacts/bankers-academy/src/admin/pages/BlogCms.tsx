import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Edit, Eye, Plus, Search, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type Lookup = {
  id: number;
  name: string;
  slug: string;
};

type Author = {
  id: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
};

type Course = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  thumbnailUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  authorId: number | null;
  categoryId: number | null;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  scheduledAt: string | null;
  publishedAt: string | null;
  modifiedAt: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author | null;
  category: Lookup | null;
  tags: Lookup[];
  relatedPosts: Pick<
    Blog,
    "id" | "title" | "slug" | "excerpt" | "featuredImageUrl" | "publishedAt"
  >[];
  relatedCourses: Course[];
  readingTime: string;
};

type SortBy = "updated-desc" | "published-desc" | "title-asc" | "status-asc";
type TabValue = "posts" | "categories" | "tags" | "authors";

const emptyPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  featuredImageUrl: "",
  content: "",
  authorId: "",
  categoryId: "",
  tagIds: [] as number[],
  relatedPostIds: [] as number[],
  relatedCourseIds: [] as number[],
  status: "DRAFT" as Blog["status"],
  publishedAt: "",
  scheduledAt: "",
  seoTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

const emptyLookupForm = { id: null as number | null, name: "", slug: "" };
const emptyAuthorForm = {
  id: null as number | null,
  name: "",
  bio: "",
  avatarUrl: "",
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function formatDate(value: string | null): string {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toggleId(values: number[], id: number): number[] {
  return values.includes(id)
    ? values.filter((value) => value !== id)
    : [...values, id];
}

function statusBadgeVariant(
  status: Blog["status"],
): "default" | "secondary" | "outline" {
  if (status === "PUBLISHED") return "default";
  if (status === "SCHEDULED") return "outline";
  return "secondary";
}

function matches(value: string | null | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export default function BlogCms() {
  const { hasPermission } = useAdminAuth();
  const canManage = hasPermission("blog.manage");
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Lookup[]>([]);
  const [tags, setTags] = useState<Lookup[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("posts");
  const [postOpen, setPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [lookupSearch, setLookupSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("updated-desc");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [authorFilter, setAuthorFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [categoryForm, setCategoryForm] = useState(emptyLookupForm);
  const [tagForm, setTagForm] = useState(emptyLookupForm);
  const [authorForm, setAuthorForm] = useState(emptyAuthorForm);
  const [lookupModal, setLookupModal] = useState<
    "category" | "tag" | "author" | null
  >(null);

  const load = async () => {
    setLoading(true);
    const [blogRows, authorRows, categoryRows, tagRows, courseRows] =
      await Promise.all([
        adminApi.get<Blog[]>("/admin/blogs"),
        adminApi.get<Author[]>("/admin/blog-authors"),
        adminApi.get<Lookup[]>("/admin/blog-categories"),
        adminApi.get<Lookup[]>("/admin/blog-tags"),
        adminApi.get<Course[]>("/admin/blog-courses"),
      ]);
    setBlogs(blogRows);
    setAuthors(authorRows);
    setCategories(categoryRows);
    setTags(tagRows);
    setCourses(courseRows);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => {
      setError("Unable to load blog data.");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!editingPost && postForm.title) {
      setPostForm((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [editingPost, postForm.title]);

  useEffect(() => {
    setPage(1);
  }, [authorFilter, categoryFilter, search, sortBy, statusFilter]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = blogs.filter((blog) => {
      const statusMatches =
        statusFilter === "ALL" || blog.status === statusFilter;
      const categoryMatches =
        categoryFilter === "ALL" || blog.categoryId === Number(categoryFilter);
      const authorMatches =
        authorFilter === "ALL" || blog.authorId === Number(authorFilter);
      const queryMatches =
        !query ||
        matches(blog.title, query) ||
        matches(blog.slug, query) ||
        matches(blog.excerpt, query) ||
        matches(blog.author?.name, query) ||
        matches(blog.category?.name, query) ||
        blog.tags.some((tag) => matches(tag.name, query));
      return statusMatches && categoryMatches && authorMatches && queryMatches;
    });

    return [...rows].sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "status-asc")
        return (
          a.status.localeCompare(b.status) || a.title.localeCompare(b.title)
        );
      if (sortBy === "published-desc")
        return (
          new Date(b.publishedAt ?? 0).getTime() -
          new Date(a.publishedAt ?? 0).getTime()
        );
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [authorFilter, blogs, categoryFilter, search, sortBy, statusFilter]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagedPosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const lookupQuery = lookupSearch.trim().toLowerCase();
  const filteredCategories = categories.filter(
    (item) =>
      !lookupQuery ||
      matches(item.name, lookupQuery) ||
      matches(item.slug, lookupQuery),
  );
  const filteredTags = tags.filter(
    (item) =>
      !lookupQuery ||
      matches(item.name, lookupQuery) ||
      matches(item.slug, lookupQuery),
  );
  const filteredAuthors = authors.filter(
    (item) =>
      !lookupQuery ||
      matches(item.name, lookupQuery) ||
      matches(item.bio, lookupQuery),
  );

  const resetPostForm = () => {
    setEditingPost(null);
    setError(null);
    setPostForm(emptyPostForm);
  };

  const openNewPost = () => {
    resetPostForm();
    setPostOpen(true);
  };

  const editPost = (blog: Blog) => {
    setEditingPost(blog);
    setError(null);
    setPostForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      featuredImageUrl: blog.featuredImageUrl ?? "",
      content: blog.content,
      authorId: blog.authorId?.toString() ?? "",
      categoryId: blog.categoryId?.toString() ?? "",
      tagIds: blog.tags.map((tag) => tag.id),
      relatedPostIds: blog.relatedPosts.map((post) => post.id),
      relatedCourseIds: blog.relatedCourses.map((course) => course.id),
      status: blog.status,
      publishedAt: toLocalInput(blog.publishedAt),
      scheduledAt: toLocalInput(blog.scheduledAt),
      seoTitle: blog.seoTitle ?? "",
      metaDescription: blog.metaDescription ?? "",
      canonicalUrl: blog.canonicalUrl ?? "",
      ogTitle: blog.ogTitle ?? "",
      ogDescription: blog.ogDescription ?? "",
      ogImage: blog.ogImage ?? "",
    });
    setPostOpen(true);
  };

  const insertContent = (before: string, after = "", placeholder = "Text") => {
    const textarea = contentRef.current;
    const current = postForm.content;
    if (!textarea) {
      setPostForm({
        ...postForm,
        content: `${current}${before}${placeholder}${after}`,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = current.slice(start, end) || placeholder;
    const next = `${current.slice(0, start)}${before}${selected}${after}${current.slice(end)}`;
    setPostForm({ ...postForm, content: next });
    window.setTimeout(() => textarea.focus(), 0);
  };

  const validatePost = () => {
    if (!postForm.title.trim()) return "Title is required.";
    if (!postForm.slug.trim()) return "Slug is required.";
    if (!postForm.content.trim()) return "Content is required.";
    if (postForm.status === "SCHEDULED" && !postForm.scheduledAt)
      return "Scheduled posts need a scheduled date.";
    return null;
  };

  const savePost = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validatePost();
    if (validation) {
      setError(validation);
      return;
    }

    setSubmitting(true);
    setError(null);
    const payload = {
      ...postForm,
      slug: slugify(postForm.slug),
      excerpt: postForm.excerpt || null,
      featuredImageUrl: postForm.featuredImageUrl || null,
      authorId: postForm.authorId ? Number(postForm.authorId) : null,
      categoryId: postForm.categoryId ? Number(postForm.categoryId) : null,
      publishedAt: postForm.publishedAt || null,
      scheduledAt: postForm.scheduledAt || null,
      seoTitle: postForm.seoTitle || null,
      metaDescription: postForm.metaDescription || null,
      canonicalUrl: postForm.canonicalUrl || null,
      ogTitle: postForm.ogTitle || null,
      ogDescription: postForm.ogDescription || null,
      ogImage: postForm.ogImage || null,
    };

    try {
      if (editingPost)
        await adminApi.patch(`/admin/blogs/${editingPost.id}`, payload);
      else await adminApi.post("/admin/blogs", payload);
      setPostOpen(false);
      resetPostForm();
      await load();
    } catch (err) {
      setError(
        err instanceof AdminApiError ? err.message : "Unable to save blog.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete this blog?")) return;
    await adminApi.delete(`/admin/blogs/${id}`);
    await load();
  };

  const duplicatePost = async (blog: Blog) => {
    const stamp = Date.now().toString().slice(-5);
    await adminApi.post("/admin/blogs", {
      title: `${blog.title} Copy`,
      slug: `${blog.slug}-copy-${stamp}`,
      excerpt: blog.excerpt,
      featuredImageUrl: blog.featuredImageUrl,
      authorId: blog.authorId,
      categoryId: blog.categoryId,
      content: blog.content,
      status: "DRAFT",
      publishedAt: null,
      scheduledAt: null,
      seoTitle: blog.seoTitle,
      metaDescription: blog.metaDescription,
      canonicalUrl: null,
      ogTitle: blog.ogTitle,
      ogDescription: blog.ogDescription,
      ogImage: blog.ogImage,
      tagIds: blog.tags.map((tag) => tag.id),
      relatedPostIds: blog.relatedPosts.map((post) => post.id),
      relatedCourseIds: blog.relatedCourses.map((course) => course.id),
    });
    await load();
  };

  const toggleStatus = async (blog: Blog) => {
    await adminApi.patch(`/admin/blogs/${blog.id}`, {
      status: blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
    });
    await load();
  };

  const saveLookup = async (
    kind: "category" | "tag",
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setLookupError(null);
    const form = kind === "category" ? categoryForm : tagForm;
    const endpoint =
      kind === "category" ? "/admin/blog-categories" : "/admin/blog-tags";
    const name = form.name.trim();
    const slug = slugify(form.slug || form.name);
    if (!name || !slug) {
      setLookupError(
        `${kind === "category" ? "Category" : "Tag"} name is required.`,
      );
      return;
    }

    try {
      if (form.id)
        await adminApi.patch(`${endpoint}/${form.id}`, { name, slug });
      else await adminApi.post(endpoint, { name, slug });
      if (kind === "category") setCategoryForm(emptyLookupForm);
      else setTagForm(emptyLookupForm);
      setLookupModal(null);
      await load();
    } catch (err) {
      setLookupError(
        err instanceof AdminApiError ? err.message : `Unable to save ${kind}.`,
      );
    }
  };

  const deleteLookup = async (kind: "category" | "tag", id: number) => {
    if (!confirm(`Delete this ${kind}?`)) return;
    const endpoint =
      kind === "category" ? "/admin/blog-categories" : "/admin/blog-tags";
    await adminApi.delete(`${endpoint}/${id}`);
    await load();
  };

  const saveAuthor = async (event: React.FormEvent) => {
    event.preventDefault();
    setLookupError(null);
    const name = authorForm.name.trim();
    if (!name) {
      setLookupError("Author name is required.");
      return;
    }

    const payload = {
      name,
      bio: authorForm.bio || null,
      avatarUrl: authorForm.avatarUrl || null,
    };

    try {
      if (authorForm.id)
        await adminApi.patch(`/admin/blog-authors/${authorForm.id}`, payload);
      else await adminApi.post("/admin/blog-authors", payload);
      setAuthorForm(emptyAuthorForm);
      setLookupModal(null);
      await load();
    } catch (err) {
      setLookupError(
        err instanceof AdminApiError ? err.message : "Unable to save author.",
      );
    }
  };

  const deleteAuthor = async (id: number) => {
    if (!confirm("Delete this author?")) return;
    await adminApi.delete(`/admin/blog-authors/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Blogs</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Manage blog posts, authors, categories, tags, publishing workflow,
              SEO settings and article relationships from one place.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
              <p className="text-xs uppercase tracking-wider text-blue-100">
                Content Management
              </p>

              <p className="mt-1 text-lg font-semibold">Blogs Dashboard</p>
            </div>

            {canManage && activeTab === "posts" && (
              <Dialog
                open={postOpen}
                onOpenChange={(value) => {
                  setPostOpen(value);
                  if (!value) resetPostForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={openNewPost}
                    className="gap-2 bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C] cursor-pointer"
                  >
                    <Plus size={16} /> Add Blog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-6xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Edit Blog" : "Create Blog"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={savePost} className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2 rounded-md bg-muted/50 px-4 py-3">
                        <h3 className="font-medium text-[#0B1F4D]">General</h3>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Input
                          required
                          value={postForm.title}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              title: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Slug</Label>
                        <Input
                          required
                          value={postForm.slug}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              slug: slugify(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Author</Label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={postForm.authorId}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              authorId: event.target.value,
                            })
                          }
                        >
                          <option value="">No author</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Category</Label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={postForm.categoryId}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              categoryId: event.target.value,
                            })
                          }
                        >
                          <option value="">No category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>Excerpt</Label>
                        <Textarea
                          className="min-h-24"
                          value={postForm.excerpt}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              excerpt: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Featured Image URL</Label>
                        <Input
                          value={postForm.featuredImageUrl}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              featuredImageUrl: event.target.value,
                            })
                          }
                        />
                      </div>
                      {postForm.featuredImageUrl && (
                        <div className="md:col-span-2">
                          <img
                            src={postForm.featuredImageUrl}
                            alt=""
                            className="aspect-[16/7] w-full rounded-md border object-cover"
                          />
                        </div>
                      )}
                      <div className="md:col-span-2 rounded-md bg-muted/50 px-4 py-3">
                        <h3 className="font-medium text-[#0B1F4D]">Content</h3>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Rich Editor</Label>
                        <div className="flex flex-wrap gap-2 rounded-md border border-input bg-muted/30 p-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertContent("## ")}
                          >
                            H2
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertContent("### ")}
                          >
                            H3
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertContent("**", "**")}
                          >
                            Bold
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertContent("- ")}
                          >
                            List
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertContent("> ")}
                          >
                            Quote
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              insertContent(
                                "[",
                                "](https://example.com)",
                                "Link text",
                              )
                            }
                          >
                            Link
                          </Button>
                        </div>
                        <Textarea
                          ref={contentRef}
                          required
                          className="min-h-72 font-mono text-sm"
                          value={postForm.content}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              content: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2 rounded-md bg-muted/50 px-4 py-3">
                        <h3 className="font-medium text-[#0B1F4D]">
                          Publishing
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Status</Label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={postForm.status}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              status: event.target.value as Blog["status"],
                            })
                          }
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="SCHEDULED">Scheduled</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Published Date</Label>
                        <Input
                          type="datetime-local"
                          value={postForm.publishedAt}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              publishedAt: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Scheduled Date</Label>
                        <Input
                          type="datetime-local"
                          value={postForm.scheduledAt}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              scheduledAt: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2 rounded-md bg-muted/50 px-4 py-3">
                        <h3 className="font-medium text-[#0B1F4D]">
                          Classification
                        </h3>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Tags</Label>
                        <div className="grid gap-2 rounded-md border border-input p-3 sm:grid-cols-2 md:grid-cols-3">
                          {tags.map((tag) => (
                            <label
                              key={tag.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={postForm.tagIds.includes(tag.id)}
                                onChange={() =>
                                  setPostForm({
                                    ...postForm,
                                    tagIds: toggleId(postForm.tagIds, tag.id),
                                  })
                                }
                              />
                              {tag.name}
                            </label>
                          ))}
                          {tags.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No tags available.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 rounded-md bg-muted/50 px-4 py-3">
                        <h3 className="font-medium text-[#0B1F4D]">
                          Relations
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Label>Related Posts</Label>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-input p-3">
                          {blogs
                            .filter((blog) => blog.id !== editingPost?.id)
                            .map((blog) => (
                              <label
                                key={blog.id}
                                className="flex items-start gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  className="mt-1"
                                  checked={postForm.relatedPostIds.includes(
                                    blog.id,
                                  )}
                                  onChange={() =>
                                    setPostForm({
                                      ...postForm,
                                      relatedPostIds: toggleId(
                                        postForm.relatedPostIds,
                                        blog.id,
                                      ),
                                    })
                                  }
                                />
                                <span>{blog.title}</span>
                              </label>
                            ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Related Courses</Label>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-input p-3">
                          {courses.map((course) => (
                            <label
                              key={course.id}
                              className="flex items-start gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={postForm.relatedCourseIds.includes(
                                  course.id,
                                )}
                                onChange={() =>
                                  setPostForm({
                                    ...postForm,
                                    relatedCourseIds: toggleId(
                                      postForm.relatedCourseIds,
                                      course.id,
                                    ),
                                  })
                                }
                              />
                              <span>{course.name}</span>
                            </label>
                          ))}
                          {courses.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No courses available.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 border-t pt-4">
                        <h3 className="font-medium text-[#0B1F4D]">SEO</h3>
                      </div>
                      <div className="space-y-1.5">
                        <Label>SEO Title</Label>
                        <Input
                          value={postForm.seoTitle}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              seoTitle: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Canonical URL</Label>
                        <Input
                          value={postForm.canonicalUrl}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              canonicalUrl: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>Meta Description</Label>
                        <Textarea
                          className="min-h-20"
                          value={postForm.metaDescription}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              metaDescription: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>OG Title</Label>
                        <Input
                          value={postForm.ogTitle}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              ogTitle: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>OG Image</Label>
                        <Input
                          value={postForm.ogImage}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              ogImage: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>OG Description</Label>
                        <Textarea
                          className="min-h-20"
                          value={postForm.ogDescription}
                          onChange={(event) =>
                            setPostForm({
                              ...postForm,
                              ogDescription: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <FieldError message={error} />
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Saving..."
                        : editingPost
                          ? "Update Blog"
                          : "Create Blog"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card className="border shadow-md">
            <CardContent className="p-6">
              <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_150px_170px_170px_170px]">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    className="pl-9"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="ALL">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={authorFilter}
                  onChange={(event) => setAuthorFilter(event.target.value)}
                >
                  <option value="ALL">All authors</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortBy)}
                >
                  <option value="updated-desc">Recently updated</option>
                  <option value="published-desc">Recently published</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="status-asc">Status</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-base">All Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                  <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />

                  <p className="text-sm text-muted-foreground">
                    Loading blogs...
                  </p>
                </div>
              ) : pagedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <FileText className="mb-4 h-12 w-12 text-slate-400" />

                  <p className="text-lg font-medium text-slate-700">
                    No blogs found
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Create your first blog to get started.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {pagedPosts.map((blog) => (
                    <div
                      key={blog.id}
                      className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <div className="grid gap-4 lg:grid-cols-[104px_minmax(0,1fr)_auto]">
                        <div className="h-20 w-full overflow-hidden rounded-md bg-muted lg:w-[104px]">
                          {blog.featuredImageUrl ? (
                            <img
                              src={blog.featuredImageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#0B1F4D] text-xs font-semibold text-[#C89B3C]">
                              BLOG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-[#0B1F4D]">
                              {blog.title}
                            </h3>
                            <Badge variant={statusBadgeVariant(blog.status)}>
                              {blog.status}
                            </Badge>
                          </div>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            /blog/{blog.slug}
                          </p>
                          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                            <span>
                              <b className="text-foreground">Category:</b>{" "}
                              {blog.category?.name ?? "None"}
                            </span>
                            <span>
                              <b className="text-foreground">Author:</b>{" "}
                              {blog.author?.name ?? "None"}
                            </span>
                            <span>
                              <b className="text-foreground">Published:</b>{" "}
                              {formatDate(blog.publishedAt)}
                            </span>
                            <span>
                              <b className="text-foreground">Updated:</b>{" "}
                              {formatDate(blog.modifiedAt ?? blog.updatedAt)}
                            </span>
                            <span>
                              <b className="text-foreground">Reading:</b>{" "}
                              {blog.readingTime}
                            </span>
                            <span>
                              <b className="text-foreground">Views:</b> -
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                          {canManage && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 cursor-pointer"
                              onClick={() => editPost(blog)}
                            >
                              <Edit size={14} /> Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            asChild
                          >
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Eye size={14} /> Preview
                            </a>
                          </Button>
                          {canManage && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleStatus(blog)}
                              >
                                {blog.status === "PUBLISHED"
                                  ? "Unpublish"
                                  : "Publish"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => duplicatePost(blog)}
                              >
                                <Copy size={14} /> Duplicate
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1.5"
                                onClick={() => deletePost(blog.id)}
                              >
                                <Trash2 size={14} /> Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((value) => Math.min(totalPages, value + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <LookupPanel
            title="Categories"
            items={filteredCategories}
            form={categoryForm}
            setForm={setCategoryForm}
            search={lookupSearch}
            setSearch={setLookupSearch}
            canManage={canManage}
            error={lookupError}
            open={lookupModal === "category"}
            setOpen={(open) => setLookupModal(open ? "category" : null)}
            onSubmit={(event) => saveLookup("category", event)}
            onDelete={(id) => deleteLookup("category", id)}
          />
        </TabsContent>

        <TabsContent value="tags">
          <LookupPanel
            title="Tags"
            items={filteredTags}
            form={tagForm}
            setForm={setTagForm}
            search={lookupSearch}
            setSearch={setLookupSearch}
            canManage={canManage}
            error={lookupError}
            open={lookupModal === "tag"}
            setOpen={(open) => setLookupModal(open ? "tag" : null)}
            onSubmit={(event) => saveLookup("tag", event)}
            onDelete={(id) => deleteLookup("tag", id)}
          />
        </TabsContent>

        <TabsContent value="authors">
          <Card className="border shadow-md">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">Authors</CardTitle>
              {canManage && (
                <Dialog
                  open={lookupModal === "author"}
                  onOpenChange={(value) => {
                    setLookupModal(value ? "author" : null);
                    if (!value) setAuthorForm(emptyAuthorForm);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus size={14} /> Add Author
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {authorForm.id ? "Edit Author" : "Add Author"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={saveAuthor} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input
                          required
                          value={authorForm.name}
                          onChange={(event) =>
                            setAuthorForm({
                              ...authorForm,
                              name: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Bio</Label>
                        <Textarea
                          value={authorForm.bio}
                          onChange={(event) =>
                            setAuthorForm({
                              ...authorForm,
                              bio: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Avatar URL</Label>
                        <Input
                          value={authorForm.avatarUrl}
                          onChange={(event) =>
                            setAuthorForm({
                              ...authorForm,
                              avatarUrl: event.target.value,
                            })
                          }
                        />
                      </div>
                      <FieldError message={lookupError} />
                      <Button type="submit" className="w-full">
                        {authorForm.id ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    className="pl-9"
                    placeholder="Search authors..."
                    value={lookupSearch}
                    onChange={(event) => setLookupSearch(event.target.value)}
                  />
                </div>
                <div className="divide-y rounded-md border">
                  {filteredAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {author.avatarUrl && (
                          <img
                            src={author.avatarUrl}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{author.name}</p>
                          {author.bio && (
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {author.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      {canManage && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => {
                              setAuthorForm({
                                id: author.id,
                                name: author.name,
                                bio: author.bio ?? "",
                                avatarUrl: author.avatarUrl ?? "",
                              });
                              setLookupModal("author");
                            }}
                          >
                            <Edit size={14} /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5"
                            onClick={() => deleteAuthor(author.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredAuthors.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">
                      No authors found.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LookupPanel({
  title,
  items,
  form,
  setForm,
  search,
  setSearch,
  canManage,
  error,
  open,
  setOpen,
  onSubmit,
  onDelete,
}: {
  title: string;
  items: Lookup[];
  form: typeof emptyLookupForm;
  setForm: (value: typeof emptyLookupForm) => void;
  search: string;
  setSearch: (value: string) => void;
  canManage: boolean;
  error: string | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="border shadow-md">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {canManage && (
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) setForm(emptyLookupForm);
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus size={14} /> Add {title.slice(0, -1)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {form.id
                    ? `Edit ${title.slice(0, -1)}`
                    : `Add ${title.slice(0, -1)}`}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                        slug: form.id ? form.slug : slugify(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      setForm({ ...form, slug: slugify(event.target.value) })
                    }
                  />
                </div>
                <FieldError message={error} />
                <Button type="submit" className="w-full">
                  {form.id ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="divide-y rounded-md border">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.slug}</p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        setForm({
                          id: item.id,
                          name: item.name,
                          slug: item.slug,
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit size={14} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No {title.toLowerCase()} found.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
