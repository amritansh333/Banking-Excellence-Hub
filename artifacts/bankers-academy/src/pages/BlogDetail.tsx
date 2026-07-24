import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Copy,
  Facebook,
  Linkedin,
  Share2,
  Tag,
  Twitter,
  User,
} from "lucide-react";
import NotFound from "@/pages/not-found";
import {
  fetchPublicBlog,
  formatBlogDate,
  type BlogDetailResponse,
  type BlogPost,
} from "@/lib/blogApi";

function setMeta(name: string, content: string, property = false) {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(url: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = url;
}

function PlaceholderImage() {
  return (
    <div className="aspect-[16/9] w-full rounded-lg hero-gradient flex items-center justify-center overflow-hidden">
      <div className="text-center px-6">
        <div className="mx-auto mb-4 h-14 w-14 rounded bg-[#C89B3C]/20 border border-[#C89B3C]/40 flex items-center justify-center">
          <Share2 className="text-[#C89B3C]" size={26} />
        </div>
        <p className="text-white font-serif text-2xl font-bold">
          The Bankers Academy
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Insights for private banking careers
        </p>
      </div>
    </div>
  );
}

function RelatedBlogCard({ blog }: { blog: BlogPost["relatedPosts"][number] }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover-lift"
    >
      <h3 className="font-bold text-[#0B1F4D] text-sm leading-snug">
        {blog.title}
      </h3>
      {blog.excerpt && (
        <p className="text-gray-600 text-xs leading-relaxed mt-2 line-clamp-3">
          {blog.excerpt}
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-[#C89B3C] text-xs font-semibold mt-3">
        Read Article <ArrowRight size={12} />
      </span>
    </Link>
  );
}

function renderInline(text: string) {
  const nodes = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    nodes.push(
      <a
        key={`${match[1]}-${match.index}`}
        href={match[2]}
        className="font-semibold text-[#C89B3C] underline-offset-4 hover:underline"
      >
        {match[1]}
      </a>,
    );
    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function ArticleContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;
  let quote: string[] = [];
  let code: string[] = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="text-base leading-8 text-gray-700"
      >
        {renderInline(text)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    const TagName = orderedList ? "ol" : "ul";
    blocks.push(
      <TagName
        key={`list-${blocks.length}`}
        className={`${orderedList ? "list-decimal" : "list-disc"} space-y-2 pl-6 text-gray-700`}
      >
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`} className="leading-7">
            {renderInline(item)}
          </li>
        ))}
      </TagName>,
    );
    listItems = [];
    orderedList = false;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push(
      <blockquote
        key={`quote-${blocks.length}`}
        className="border-l-4 border-[#C89B3C] bg-[#C89B3C]/10 px-5 py-4 font-serif text-lg leading-8 text-[#0B1F4D]"
      >
        {renderInline(quote.join(" "))}
      </blockquote>,
    );
    quote = [];
  };

  const flushCode = () => {
    if (code.length === 0) return;
    blocks.push(
      <pre
        key={`code-${blocks.length}`}
        className="overflow-x-auto rounded-lg bg-[#0B1F4D] p-4 text-sm leading-7 text-blue-50"
      >
        <code>{code.join("\n")}</code>
      </pre>,
    );
    code = [];
  };

  const flushFlow = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushFlow();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      code.push(rawLine);
      return;
    }

    if (!line) {
      flushFlow();
      return;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushFlow();
      blocks.push(
        <img
          key={`image-${blocks.length}`}
          src={image[2]}
          alt={image[1] || "Article image"}
          className="w-full rounded-lg border border-gray-200 object-cover"
        />,
      );
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushFlow();
      const level = heading[1].length;
      if (level <= 2) {
        blocks.push(
          <h2
            key={`h2-${blocks.length}`}
            className="font-serif text-3xl font-bold leading-tight text-[#0B1F4D]"
          >
            {renderInline(heading[2])}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={`h3-${blocks.length}`}
            className="font-serif text-2xl font-bold leading-tight text-[#0B1F4D]"
          >
            {renderInline(heading[2])}
          </h3>,
        );
      } else {
        blocks.push(
          <h4
            key={`h4-${blocks.length}`}
            className="text-lg font-bold leading-tight text-[#0B1F4D]"
          >
            {renderInline(heading[2])}
          </h4>,
        );
      }
      return;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      flushQuote();
      if (orderedList) flushList();
      listItems.push(unordered[1]);
      orderedList = false;
      return;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (listItems.length > 0 && !orderedList) flushList();
      listItems.push(ordered[1]);
      orderedList = true;
      return;
    }

    const quoted = line.match(/^>\s?(.+)$/);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      return;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  });

  flushFlow();
  flushCode();

  return <div className="space-y-6">{blocks}</div>;
}

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const [data, setData] = useState<BlogDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);
    fetchPublicBlog(slug)
      .then(setData)
      .catch((err: Error) => {
        if (err.name === "404") {
          setNotFound(true);
        } else {
          setError("Unable to load this article right now.");
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}`;
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    const { blog } = data;
    const title = blog.seoTitle || blog.title;
    const description =
      blog.metaDescription ||
      blog.excerpt ||
      "Private banking insights from The Bankers Academy.";
    const canonical = blog.canonicalUrl || shareUrl;

    document.title = `${title} - The Bankers Academy LLP`;
    setMeta("description", description);
    setCanonical(canonical);
    setMeta("og:title", blog.ogTitle || title, true);
    setMeta("og:description", blog.ogDescription || description, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", canonical, true);
    if (blog.ogImage || blog.featuredImageUrl)
      setMeta("og:image", blog.ogImage || blog.featuredImageUrl || "", true);
  }, [data, shareUrl]);

  if (loading) {
    return (
      <div className="section-padding bg-[#F8FAFC]">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-xl border border-gray-200 bg-white py-24 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />

              <p className="text-sm font-medium text-muted-foreground">
                Loading Article...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) return <NotFound />;

  if (error || !data) {
    return (
      <div className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-destructive">{error ?? "Article unavailable."}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#C89B3C] text-sm font-semibold mt-4"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const { blog, previousBlog, nextBlog, relatedBlogs } = data;
  const shareLinks = [
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`,
    },
  ];

  const copyLink = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden bg-white">
      <section className="hero-gradient py-10 md:py-14 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-white relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-6"
          >
            <ArrowLeft size={15} /> Back to Blogs
          </Link>
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-blue-100">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            {blog.category && (
              <>
                <span>/</span>
                <span>{blog.category.name}</span>
              </>
            )}
          </nav>
          <div className="space-y-4">
            {blog.category && (
              <span className="inline-block px-3 py-1 rounded bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-semibold uppercase tracking-widest">
                {blog.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-blue-100 text-lg max-w-3xl leading-relaxed">
                {blog.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-blue-100 text-sm">
              {blog.author && (
                <span className="inline-flex items-center gap-2">
                  <User size={15} /> {blog.author.name}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} /> {formatBlogDate(blog.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={15} /> {blog.readingTime}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L1440 50L1440 0C1200 33 960 50 720 50C480 50 240 33 0 0L0 50Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      <section className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article className="min-w-0 space-y-6">
              {blog.featuredImageUrl ? (
                <img
                  src={blog.featuredImageUrl}
                  alt={blog.title}
                  className="aspect-[16/9] w-full rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <PlaceholderImage />
              )}

              <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-7">
                <ArticleContent content={blog.content} />
              </div>

              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 rounded bg-white border border-gray-200 px-3 py-1 text-xs text-gray-600"
                    >
                      <Tag size={12} /> {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {previousBlog && (
                  <Link
                    href={`/blog/${previousBlog.slug}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover-lift"
                  >
                    <span className="text-xs text-gray-500">Previous Blog</span>
                    <p className="mt-1 text-sm font-bold text-[#0B1F4D]">
                      {previousBlog.title}
                    </p>
                  </Link>
                )}
                {nextBlog && (
                  <Link
                    href={`/blog/${nextBlog.slug}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 text-right hover-lift"
                  >
                    <span className="text-xs text-gray-500">Next Blog</span>
                    <p className="mt-1 text-sm font-bold text-[#0B1F4D]">
                      {nextBlog.title}
                    </p>
                  </Link>
                )}
              </div>

              {relatedBlogs.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold text-[#0B1F4D] mb-4">
                    Related Blogs
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    {relatedBlogs.map((related) => (
                      <RelatedBlogCard key={related.id} blog={related} />
                    ))}
                  </div>
                </section>
              )}

              {blog.relatedCourses.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold text-[#0B1F4D] mb-4">
                    Related Courses
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {blog.relatedCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={course.ctaUrl || "/courses"}
                        className="rounded-lg border border-gray-200 bg-white p-5 hover-lift"
                      >
                        <h3 className="font-bold text-[#0B1F4D]">
                          {course.name}
                        </h3>
                        {course.shortDescription && (
                          <p className="text-gray-600 text-sm mt-2">
                            {course.shortDescription}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-[#C89B3C] text-sm font-semibold mt-4">
                          {course.ctaLabel || "View Course"}{" "}
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-lg hero-gradient p-6 md:p-8 text-white">
                <h2 className="font-serif text-2xl font-bold mb-2">
                  Ready to Start Your Private Banking Career?
                </h2>
                <p className="text-blue-100 mb-5">
                  Join our focused 2-month program and learn from experienced
                  banking professionals.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/admission"
                    className="px-5 py-3 rounded bg-[#C89B3C] text-white text-sm font-bold hover:bg-[#b8892e] transition-colors"
                  >
                    Apply Now
                  </Link>
                  <Link
                    href="/enquiry"
                    className="px-5 py-3 rounded border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    Send Enquiry
                  </Link>
                </div>
              </section>
            </article>

            <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="font-serif font-bold text-[#0B1F4D] mb-4">
                  Share
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {shareLinks.map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-[#C89B3C]"
                    >
                      <Icon size={15} /> {label}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center justify-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-[#C89B3C]"
                  >
                    <Copy size={15} /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {blog.author && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <h2 className="font-serif font-bold text-[#0B1F4D] mb-3">
                    Author
                  </h2>
                  <div className="flex items-center gap-3">
                    {blog.author.avatarUrl && (
                      <img
                        src={blog.author.avatarUrl}
                        alt={blog.author.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-[#0B1F4D]">
                        {blog.author.name}
                      </p>
                      {blog.author.bio && (
                        <p className="text-gray-600 text-sm mt-1">
                          {blog.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
