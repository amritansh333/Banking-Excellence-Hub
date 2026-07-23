import { Router, type IRouter } from "express";
import { asc, desc, eq, inArray } from "drizzle-orm";
import {
  db,
  blogAuthorsTable,
  blogCategoriesTable,
  blogPostTagsTable,
  blogPostsTable,
  blogRelatedCoursesTable,
  blogRelatedPostsTable,
  blogTagsTable,
  coursesTable,
  type BlogAuthor,
  type BlogCategory,
  type BlogPost,
  type BlogTag,
  type Course,
} from "@workspace/db";
import {
  requireAdminAuth,
  requirePermission,
} from "../../middlewares/requireAdminAuth";
import { writeAuditLog } from "../../lib/audit";
import { PERMISSIONS } from "../../lib/permissions";

const router: IRouter = Router();

function parseId(param: string | string[]): number {
  return Number(Array.isArray(param) ? param[0] : param);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIdArray(value: unknown): number[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
}

function publicPost(post: BlogPost): boolean {
  return post.status === "PUBLISHED";
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

type CourseSummary = Pick<Course, "id" | "name" | "slug" | "shortDescription" | "thumbnailUrl" | "ctaLabel" | "ctaUrl">;

type HydratedBlog = BlogPost & {
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: BlogTag[];
  relatedPosts: Pick<BlogPost, "id" | "title" | "slug" | "excerpt" | "featuredImageUrl" | "publishedAt">[];
  relatedCourses: CourseSummary[];
  readingTime: string;
};

type HydrateOptions = {
  publicOnly?: boolean;
};

async function hydratePosts(posts: BlogPost[], options: HydrateOptions = {}): Promise<HydratedBlog[]> {
  if (posts.length === 0) return [];

  const postIds = posts.map((post) => post.id);

  const [authors, categories, tags, tagLinks, relatedPostLinks, relatedCourseLinks, courses] = await Promise.all([
    db.select().from(blogAuthorsTable),
    db.select().from(blogCategoriesTable),
    db.select().from(blogTagsTable),
    db.select().from(blogPostTagsTable).where(inArray(blogPostTagsTable.postId, postIds)),
    db.select().from(blogRelatedPostsTable).where(inArray(blogRelatedPostsTable.postId, postIds)),
    db.select().from(blogRelatedCoursesTable).where(inArray(blogRelatedCoursesTable.postId, postIds)),
    db.select().from(coursesTable).orderBy(asc(coursesTable.displayOrder), asc(coursesTable.name)),
  ]);

  const authorMap = new Map(authors.map((author) => [author.id, author]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const tagMap = new Map(tags.map((tag) => [tag.id, tag]));
  const relatedPostIds = [...new Set(relatedPostLinks.map((link) => link.relatedPostId))];
  const relatedPostRows =
    relatedPostIds.length > 0
      ? await db.select().from(blogPostsTable).where(inArray(blogPostsTable.id, relatedPostIds))
      : [];
  const availableRelatedPosts = options.publicOnly ? relatedPostRows.filter(publicPost) : relatedPostRows;
  const postMap = new Map([...posts, ...availableRelatedPosts].map((post) => [post.id, post]));
  const availableCourses = options.publicOnly
    ? courses.filter((course) => course.active && course.status === "PUBLISHED")
    : courses;
  const courseMap = new Map(availableCourses.map((course) => [course.id, course]));

  return posts.map((post) => {
    const postTags = tagLinks
      .filter((link) => link.postId === post.id)
      .map((link) => tagMap.get(link.tagId))
      .filter((tag): tag is BlogTag => Boolean(tag));

    const relatedPosts = relatedPostLinks
      .filter((link) => link.postId === post.id)
      .map((link) => postMap.get(link.relatedPostId))
      .filter((related): related is BlogPost => Boolean(related))
      .map((related) => ({
        id: related.id,
        title: related.title,
        slug: related.slug,
        excerpt: related.excerpt,
        featuredImageUrl: related.featuredImageUrl,
        publishedAt: related.publishedAt,
      }));

    const relatedCourses = relatedCourseLinks
      .filter((link) => link.postId === post.id)
      .map((link) => courseMap.get(link.courseId))
      .filter((course): course is Course => Boolean(course))
      .map((course) => ({
        id: course.id,
        name: course.name,
        slug: course.slug,
        shortDescription: course.shortDescription,
        thumbnailUrl: course.thumbnailUrl,
        ctaLabel: course.ctaLabel,
        ctaUrl: course.ctaUrl,
      }));

    return {
      ...post,
      author: post.authorId ? authorMap.get(post.authorId) ?? null : null,
      category: post.categoryId ? categoryMap.get(post.categoryId) ?? null : null,
      tags: postTags,
      relatedPosts,
      relatedCourses,
      readingTime: readingTime(post.content),
    };
  });
}

function buildPostPayload(body: Record<string, unknown>, isUpdate: boolean) {
  const status = typeof body.status === "string" ? body.status : undefined;
  if (status && !["DRAFT", "PUBLISHED", "SCHEDULED"].includes(status)) {
    throw new Error("Invalid blog status.");
  }

  if (!isUpdate && (!body.title || !body.slug || !body.content)) {
    throw new Error("Title, slug and content are required.");
  }

  const publishedAt = toDate(body.publishedAt);
  const scheduledAt = toDate(body.scheduledAt);
  const data: Partial<BlogPost> = {};

  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.slug === "string") data.slug = slugify(body.slug);
  if (body.excerpt !== undefined) data.excerpt = body.excerpt ? String(body.excerpt) : null;
  if (body.featuredImageUrl !== undefined) data.featuredImageUrl = body.featuredImageUrl ? String(body.featuredImageUrl) : null;
  if (body.authorId !== undefined) data.authorId = body.authorId ? Number(body.authorId) : null;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId ? Number(body.categoryId) : null;
  if (typeof body.content === "string") data.content = body.content;
  if (status) data.status = status;
  if (publishedAt !== undefined) data.publishedAt = publishedAt;
  if (scheduledAt !== undefined) data.scheduledAt = scheduledAt;
  if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle ? String(body.seoTitle) : null;
  if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription ? String(body.metaDescription) : null;
  if (body.canonicalUrl !== undefined) data.canonicalUrl = body.canonicalUrl ? String(body.canonicalUrl) : null;
  if (body.ogTitle !== undefined) data.ogTitle = body.ogTitle ? String(body.ogTitle) : null;
  if (body.ogDescription !== undefined) data.ogDescription = body.ogDescription ? String(body.ogDescription) : null;
  if (body.ogImage !== undefined) data.ogImage = body.ogImage ? String(body.ogImage) : null;

  if (data.status === "PUBLISHED" && data.publishedAt === undefined) {
    data.publishedAt = new Date();
  }

  return {
    data,
    tagIds: toIdArray(body.tagIds),
    relatedPostIds: toIdArray(body.relatedPostIds),
    relatedCourseIds: toIdArray(body.relatedCourseIds),
  };
}

function parsePositiveInt(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function matchesText(value: string | null | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

async function replaceRelations(
  postId: number,
  relations: {
    tagIds?: number[];
    relatedPostIds?: number[];
    relatedCourseIds?: number[];
  },
): Promise<void> {
  if (relations.tagIds) {
    await db.delete(blogPostTagsTable).where(eq(blogPostTagsTable.postId, postId));
    if (relations.tagIds.length > 0) {
      await db.insert(blogPostTagsTable).values(relations.tagIds.map((tagId) => ({ postId, tagId })));
    }
  }

  if (relations.relatedPostIds) {
    await db.delete(blogRelatedPostsTable).where(eq(blogRelatedPostsTable.postId, postId));
    const relatedPostIds = relations.relatedPostIds.filter((relatedPostId) => relatedPostId !== postId);
    if (relatedPostIds.length > 0) {
      await db
        .insert(blogRelatedPostsTable)
        .values(relatedPostIds.map((relatedPostId) => ({ postId, relatedPostId })));
    }
  }

  if (relations.relatedCourseIds) {
    await db.delete(blogRelatedCoursesTable).where(eq(blogRelatedCoursesTable.postId, postId));
    if (relations.relatedCourseIds.length > 0) {
      await db
        .insert(blogRelatedCoursesTable)
        .values(relations.relatedCourseIds.map((courseId) => ({ postId, courseId })));
    }
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  return db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt), desc(blogPostsTable.updatedAt));
}

// ---------- Public ----------

router.get("/blogs/categories", async (_req, res): Promise<void> => {
  const posts = (await hydratePosts((await getAllPosts()).filter(publicPost), { publicOnly: true }));
  const counts = new Map<number, number>();
  posts.forEach((post) => {
    if (post.category) counts.set(post.category.id, (counts.get(post.category.id) ?? 0) + 1);
  });
  const categories = (await db.select().from(blogCategoriesTable).orderBy(asc(blogCategoriesTable.name)))
    .map((category) => ({ ...category, count: counts.get(category.id) ?? 0 }))
    .filter((category) => category.count > 0);
  res.json(categories);
});

router.get("/blogs/tags", async (_req, res): Promise<void> => {
  const posts = await hydratePosts((await getAllPosts()).filter(publicPost), { publicOnly: true });
  const counts = new Map<number, number>();
  posts.forEach((post) => post.tags.forEach((tag) => counts.set(tag.id, (counts.get(tag.id) ?? 0) + 1)));
  const tags = (await db.select().from(blogTagsTable).orderBy(asc(blogTagsTable.name)))
    .map((tag) => ({ ...tag, count: counts.get(tag.id) ?? 0 }))
    .filter((tag) => tag.count > 0);
  res.json(tags);
});

router.get("/blogs/latest", async (req, res): Promise<void> => {
  const limit = parsePositiveInt(req.query.limit, 4, 12);
  const posts = (await getAllPosts()).filter(publicPost).slice(0, limit);
  res.json(await hydratePosts(posts, { publicOnly: true }));
});

router.get("/blogs/popular", async (req, res): Promise<void> => {
  const limit = parsePositiveInt(req.query.limit, 4, 12);
  const posts = (await getAllPosts()).filter(publicPost).slice(0, limit);
  res.json(await hydratePosts(posts, { publicOnly: true }));
});

router.get("/blogs/:slug/related", async (req, res): Promise<void> => {
  const limit = parsePositiveInt(req.query.limit, 3, 9);
  const posts = (await getAllPosts()).filter(publicPost);
  const hydrated = await hydratePosts(posts, { publicOnly: true });
  const post = hydrated.find((item) => item.slug === req.params.slug);
  if (!post) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  const explicit = post.relatedPosts.filter((item) => item.id !== post.id);
  const explicitIds = new Set(explicit.map((item) => item.id));
  const sameCategory = hydrated
    .filter((item) => item.id !== post.id && item.category?.id === post.category?.id && !explicitIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      featuredImageUrl: item.featuredImageUrl,
      publishedAt: item.publishedAt,
    }));
  const relatedIds = new Set([...explicit, ...sameCategory].map((item) => item.id));
  const latest = hydrated
    .filter((item) => item.id !== post.id && !relatedIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      featuredImageUrl: item.featuredImageUrl,
      publishedAt: item.publishedAt,
    }));

  res.json([...explicit, ...sameCategory, ...latest].slice(0, limit));
});

router.get("/blogs", async (req, res): Promise<void> => {
  const page = parsePositiveInt(req.query.page, 1, 1000);
  const pageSize = parsePositiveInt(req.query.pageSize, 9, 24);
  const query = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim().toLowerCase() : "";
  const tag = typeof req.query.tag === "string" ? req.query.tag.trim().toLowerCase() : "";
  const hydrated = await hydratePosts((await getAllPosts()).filter(publicPost), { publicOnly: true });
  const filtered = hydrated.filter((post) => {
    const categoryMatches =
      !category || post.category?.slug.toLowerCase() === category || post.category?.name.toLowerCase() === category;
    const tagMatches = !tag || post.tags.some((item) => item.slug.toLowerCase() === tag || item.name.toLowerCase() === tag);
    const searchMatches =
      !query ||
      matchesText(post.title, query) ||
      matchesText(post.excerpt, query) ||
      matchesText(post.content, query) ||
      matchesText(post.author?.name, query) ||
      matchesText(post.category?.name, query) ||
      post.tags.some((item) => matchesText(item.name, query));

    return categoryMatches && tagMatches && searchMatches;
  });
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  res.json({
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

router.get("/blogs/:slug", async (req, res): Promise<void> => {
  const posts = (await getAllPosts()).filter(publicPost);
  const post = posts.find((item) => item.slug === req.params.slug);

  if (!post) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  const hydrated = await hydratePosts(posts, { publicOnly: true });
  const currentIndex = hydrated.findIndex((item) => item.id === post.id);
  const relatedResponse = await new Promise<HydratedBlog["relatedPosts"]>((resolve) => {
    const current = hydrated[currentIndex];
    const explicit = current.relatedPosts.filter((item) => item.id !== current.id);
    const explicitIds = new Set(explicit.map((item) => item.id));
    const sameCategory = hydrated
      .filter((item) => item.id !== current.id && item.category?.id === current.category?.id && !explicitIds.has(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        featuredImageUrl: item.featuredImageUrl,
        publishedAt: item.publishedAt,
      }));
    const relatedIds = new Set([...explicit, ...sameCategory].map((item) => item.id));
    const latest = hydrated
      .filter((item) => item.id !== current.id && !relatedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        featuredImageUrl: item.featuredImageUrl,
        publishedAt: item.publishedAt,
      }));
    resolve([...explicit, ...sameCategory, ...latest].slice(0, 3));
  });

  res.json({
    blog: hydrated[currentIndex],
    previousBlog: currentIndex > 0 ? hydrated[currentIndex - 1] : null,
    nextBlog: currentIndex < hydrated.length - 1 ? hydrated[currentIndex + 1] : null,
    relatedBlogs: relatedResponse,
  });
});

// ---------- Admin Lookups ----------

router.get(
  "/admin/blog-authors",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (_req, res): Promise<void> => {
    res.json(await db.select().from(blogAuthorsTable).orderBy(asc(blogAuthorsTable.name)));
  },
);

router.post(
  "/admin/blog-authors",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      res.status(400).json({ error: "Author name is required." });
      return;
    }

    const [row] = await db
      .insert(blogAuthorsTable)
      .values({
        name,
        bio: req.body.bio ? String(req.body.bio) : null,
        avatarUrl: req.body.avatarUrl ? String(req.body.avatarUrl) : null,
      })
      .returning();

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_AUTHOR_CREATED",
      entityType: "blog_author",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} created blog author "${row.name}".`,
    });

    res.status(201).json(row);
  },
);

router.patch(
  "/admin/blog-authors/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db
      .update(blogAuthorsTable)
      .set({
        ...(typeof req.body.name === "string" ? { name: req.body.name.trim() } : {}),
        ...(req.body.bio !== undefined ? { bio: req.body.bio ? String(req.body.bio) : null } : {}),
        ...(req.body.avatarUrl !== undefined ? { avatarUrl: req.body.avatarUrl ? String(req.body.avatarUrl) : null } : {}),
      })
      .where(eq(blogAuthorsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_AUTHOR_UPDATED",
      entityType: "blog_author",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated blog author "${row.name}".`,
    });

    res.json(row);
  },
);

router.delete(
  "/admin/blog-authors/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db.delete(blogAuthorsTable).where(eq(blogAuthorsTable.id, id)).returning();

    if (!row) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_AUTHOR_DELETED",
      entityType: "blog_author",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted blog author "${row.name}".`,
    });

    res.status(204).send();
  },
);

router.get(
  "/admin/blog-categories",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (_req, res): Promise<void> => {
    res.json(await db.select().from(blogCategoriesTable).orderBy(asc(blogCategoriesTable.name)));
  },
);

router.post(
  "/admin/blog-categories",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const slug = typeof req.body.slug === "string" && req.body.slug ? slugify(req.body.slug) : slugify(name);
    if (!name || !slug) {
      res.status(400).json({ error: "Category name is required." });
      return;
    }

    const [row] = await db.insert(blogCategoriesTable).values({ name, slug }).returning();
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_CATEGORY_CREATED",
      entityType: "blog_category",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} created blog category "${row.name}".`,
    });
    res.status(201).json(row);
  },
);

router.patch(
  "/admin/blog-categories/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db
      .update(blogCategoriesTable)
      .set({
        ...(typeof req.body.name === "string" ? { name: req.body.name.trim() } : {}),
        ...(typeof req.body.slug === "string" ? { slug: slugify(req.body.slug) } : {}),
      })
      .where(eq(blogCategoriesTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_CATEGORY_UPDATED",
      entityType: "blog_category",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated blog category "${row.name}".`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/blog-categories/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db.delete(blogCategoriesTable).where(eq(blogCategoriesTable.id, id)).returning();
    if (!row) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_CATEGORY_DELETED",
      entityType: "blog_category",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted blog category "${row.name}".`,
    });
    res.status(204).send();
  },
);

router.get(
  "/admin/blog-tags",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (_req, res): Promise<void> => {
    res.json(await db.select().from(blogTagsTable).orderBy(asc(blogTagsTable.name)));
  },
);

router.post(
  "/admin/blog-tags",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const slug = typeof req.body.slug === "string" && req.body.slug ? slugify(req.body.slug) : slugify(name);
    if (!name || !slug) {
      res.status(400).json({ error: "Tag name is required." });
      return;
    }

    const [row] = await db.insert(blogTagsTable).values({ name, slug }).returning();
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_TAG_CREATED",
      entityType: "blog_tag",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} created blog tag "${row.name}".`,
    });
    res.status(201).json(row);
  },
);

router.patch(
  "/admin/blog-tags/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db
      .update(blogTagsTable)
      .set({
        ...(typeof req.body.name === "string" ? { name: req.body.name.trim() } : {}),
        ...(typeof req.body.slug === "string" ? { slug: slugify(req.body.slug) } : {}),
      })
      .where(eq(blogTagsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_TAG_UPDATED",
      entityType: "blog_tag",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated blog tag "${row.name}".`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/blog-tags/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db.delete(blogTagsTable).where(eq(blogTagsTable.id, id)).returning();
    if (!row) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_TAG_DELETED",
      entityType: "blog_tag",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted blog tag "${row.name}".`,
    });
    res.status(204).send();
  },
);

router.get(
  "/admin/blog-courses",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (_req, res): Promise<void> => {
    res.json(await db.select().from(coursesTable).orderBy(asc(coursesTable.displayOrder), asc(coursesTable.name)));
  },
);

// ---------- Admin Posts ----------

router.get(
  "/admin/blogs",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (_req, res): Promise<void> => {
    res.json(await hydratePosts(await getAllPosts()));
  },
);

router.get(
  "/admin/blogs/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_VIEW),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);

    const [row] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id));

    if (!row) {
      res.status(404).json({
        error: "Blog not found",
      });
      return;
    }

    const [hydrated] = await hydratePosts([row]);
    res.json(hydrated);
  },
);

router.post(
  "/admin/blogs",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    let payload: ReturnType<typeof buildPostPayload>;
    try {
      payload = buildPostPayload(req.body, false);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid blog payload." });
      return;
    }

    const postPayload = {
      ...payload.data,
      createdBy: req.adminUser!.id,
      updatedBy: req.adminUser!.id,
      modifiedAt: new Date(),
    };

    const [row] = await db
      .insert(blogPostsTable)
      .values(postPayload as typeof blogPostsTable.$inferInsert)
      .returning();

    await replaceRelations(row.id, payload);

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_CREATED",
      entityType: "blog_post",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} created blog "${row.title}".`,
    });

    const [hydrated] = await hydratePosts([row]);
    res.status(201).json(hydrated);
  },
);

router.patch(
  "/admin/blogs/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);

    let payload: ReturnType<typeof buildPostPayload>;
    try {
      payload = buildPostPayload(req.body, true);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid blog payload." });
      return;
    }

    const updates = {
      ...payload.data,
      updatedBy: req.adminUser!.id,
      modifiedAt: new Date(),
    };

    const [row] = await db
      .update(blogPostsTable)
      .set(updates as Partial<typeof blogPostsTable.$inferInsert>)
      .where(eq(blogPostsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({
        error: "Blog not found",
      });
      return;
    }

    await replaceRelations(row.id, payload);

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_UPDATED",
      entityType: "blog_post",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated blog "${row.title}".`,
    });

    const [hydrated] = await hydratePosts([row]);
    res.json(hydrated);
  },
);

router.delete(
  "/admin/blogs/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.BLOG_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);

    const [row] = await db
      .delete(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({
        error: "Blog not found",
      });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "BLOG_DELETED",
      entityType: "blog_post",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted blog "${row.title}".`,
    });

    res.status(204).send();
  },
);

export default router;
