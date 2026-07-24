import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock, Search, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchPopularBlogs,
  fetchPublicBlogCategories,
  fetchPublicBlogs,
  fetchPublicBlogTags,
  formatBlogDate,
  type BlogLookupWithCount,
  type BlogPost,
} from "@/lib/blogApi";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function BlogImage({
  blog,
  compact = false,
}: {
  blog: BlogPost;
  compact?: boolean;
}) {
  if (blog.featuredImageUrl) {
    return (
      <img
        src={blog.featuredImageUrl}
        alt={blog.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="hero-gradient flex h-full w-full items-center justify-center px-5 text-center text-white">
      <div>
        <p
          className={`font-serif font-bold ${compact ? "text-base" : "text-2xl"}`}
        >
          The Bankers Academy
        </p>
        <p className="mt-1 text-xs text-blue-100">Private banking insights</p>
      </div>
    </div>
  );
}

function ArticleCard({
  blog,
  featured = false,
}: {
  blog: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`group flex h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`overflow-hidden bg-[#0B1F4D]/10 ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-[42%]" : "aspect-[16/10]"}`}
      >
        <BlogImage blog={blog} />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {blog.category && (
            <span className="rounded-full bg-[#C89B3C]/10 px-3 py-1 text-xs font-bold uppercase text-[#9A7327]">
              {blog.category.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Clock size={13} />
            {blog.readingTime}
          </span>
        </div>
        <h2
          className={`font-serif font-bold leading-tight text-[#0B1F4D] transition-colors group-hover:text-[#C89B3C] ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
        >
          {blog.title}
        </h2>
        {blog.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600">
            {blog.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          {blog.author && (
            <span className="inline-flex items-center gap-1.5">
              <User size={13} />
              {blog.author.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} />
            {formatBlogDate(blog.publishedAt)}
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded bg-[#F3F5F8] px-2 py-1 text-xs text-gray-600"
              >
                <Tag size={11} />
                {tag.name}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#C89B3C] transition-all group-hover:gap-2">
            Read More <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SidebarLink({ blog, index }: { blog: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group grid grid-cols-[36px_1fr] gap-3"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded bg-[#C89B3C]/10 text-xs font-bold text-[#C89B3C]">
        {index + 1}
      </span>
      <span className="text-sm font-semibold leading-6 text-gray-700 transition-colors group-hover:text-[#0B1F4D]">
        {blog.title}
      </span>
    </Link>
  );
}

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [popular, setPopular] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogLookupWithCount[]>([]);
  const [tags, setTags] = useState<BlogLookupWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  useEffect(() => {
    document.title = "Blog & Articles - The Bankers Academy LLP";
    Promise.all([
      fetchPublicBlogCategories(),
      fetchPublicBlogTags(),
      fetchPopularBlogs(5),
    ])
      .then(([categoryRows, tagRows, popularRows]) => {
        setCategories(categoryRows);
        setTags(tagRows);
        setPopular(popularRows);
      })
      .catch(() => setError("Unable to load blog filters right now."));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, activeTag, search]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPublicBlogs({
      page,
      pageSize: 7,
      search: search.trim(),
      category: activeCategory,
      tag: activeTag,
    })
      .then((response) => {
        setBlogs(response.items);
        setTotalPages(response.totalPages);
      })
      .catch(() => setError("Unable to load articles right now."))
      .finally(() => setLoading(false));
  }, [activeCategory, activeTag, page, search]);

  const featuredBlog = blogs[0] ?? null;
  const remainingBlogs = useMemo(() => blogs.slice(1), [blogs]);

  return (
    <div className="overflow-hidden bg-[#F8FAFC]">
      <section className="hero-gradient relative overflow-hidden py-14 text-white md:py-20">
        <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl space-y-5"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-full border border-[#C89B3C]/40 bg-[#C89B3C]/15 px-4 py-2 text-sm font-semibold text-[#E8C879]"
            >
              Insights & Resources
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl font-bold leading-tight md:text-6xl"
            >
              Blog & Articles
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-base leading-8 text-blue-100 md:text-lg"
            >
              Industry insights, career guidance, and private banking knowledge
              from our expert faculty.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 54" fill="none" aria-hidden="true">
            <path
              d="M0 54H1440V0C1190 34 960 52 720 52C480 52 250 34 0 0V54Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      <section ref={gridRef} className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === ""
                  ? "border-[#0B1F4D] bg-[#0B1F4D] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#C89B3C]"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(category.slug ?? category.name)
                }
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === (category.slug ?? category.name)
                    ? "border-[#0B1F4D] bg-[#0B1F4D] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#C89B3C]"
                }`}
              >
                {category.name}{" "}
                <span className="text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <main className="min-w-0">
              <motion.div
                initial="hidden"
                animate={gridInView ? "visible" : "hidden"}
                variants={stagger}
                className="space-y-6"
              >
                {loading && (
                  <div className="rounded-xl border border-gray-200 bg-white py-20 shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />

                      <p className="text-sm font-medium text-muted-foreground">
                        Loading Blogs...
                      </p>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-destructive">
                    {error}
                  </p>
                )}
                {!loading && !error && featuredBlog && (
                  <motion.div variants={fadeUp}>
                    <ArticleCard blog={featuredBlog} featured />
                  </motion.div>
                )}
                {!loading && !error && remainingBlogs.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {remainingBlogs.map((blog) => (
                      <motion.div key={blog.id} variants={fadeUp}>
                        <ArticleCard blog={blog} />
                      </motion.div>
                    ))}
                  </div>
                )}
                {!loading && !error && blogs.length === 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-600">
                    <Search size={40} className="mx-auto mb-4 text-gray-300" />
                    <p>No articles found matching your filters.</p>
                  </div>
                )}
                {!loading && !error && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                    >
                      Previous
                    </Button>
                    <span className="px-3 text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((value) => Math.min(totalPages, value + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </motion.div>
            </main>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-serif text-lg font-bold text-[#0B1F4D]">
                  Search Articles
                </h2>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className="h-11 rounded-lg pl-10"
                  />
                </div>
              </div>

              {popular.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 font-serif text-lg font-bold text-[#0B1F4D]">
                    Popular Articles
                  </h2>
                  <div className="space-y-4">
                    {popular.map((blog, index) => (
                      <SidebarLink key={blog.id} blog={blog} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {categories.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 font-serif text-lg font-bold text-[#0B1F4D]">
                    Categories
                  </h2>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setActiveCategory(category.slug ?? category.name)
                        }
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-[#F3F5F8] hover:text-[#0B1F4D]"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-400">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 font-serif text-lg font-bold text-[#0B1F4D]">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() =>
                          setActiveTag(
                            activeTag === (tag.slug ?? tag.name)
                              ? ""
                              : (tag.slug ?? tag.name),
                          )
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          activeTag === (tag.slug ?? tag.name)
                            ? "border-[#C89B3C] bg-[#C89B3C] text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-[#C89B3C]"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="hero-gradient rounded-lg p-6 text-white shadow-sm">
                <h2 className="font-serif text-xl font-bold">
                  Ready to Start?
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Join our focused program and launch your private banking
                  career.
                </p>
                <Link
                  href="/admission"
                  className="mt-5 inline-flex w-full items-center justify-center rounded bg-[#C89B3C] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b8892e]"
                >
                  Apply Now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
