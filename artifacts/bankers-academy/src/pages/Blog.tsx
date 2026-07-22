import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const categories = ["All", "Private Banking", "Finance", "Insurance", "Career Tips", "Industry Insights"];

const articles = [
  { id: 1, title: "How to Crack a Private Banking Interview in 2026: A Complete Guide", category: "Career Tips", date: "June 15, 2026", readTime: "8 min read", excerpt: "Private Banking interviews are evolving rapidly. Here is everything you need to know about the current interview format, common questions, and how to prepare with confidence.", tags: ["Interview", "Private Banking", "Preparation"] },
  { id: 2, title: "The Rise of NBFCs in India: Opportunities for Fresh Graduates", category: "Industry Insights", date: "June 10, 2026", readTime: "6 min read", excerpt: "Non-Private Banking Financial Companies are growing at an unprecedented rate in India. Here is why they represent one of the most exciting career entry points for 2026 graduates.", tags: ["NBFC", "Career", "Finance"] },
  { id: 3, title: "Understanding KYC, AML & CFT: What Every Private Banking Professional Must Know", category: "Private Banking", readTime: "10 min read", date: "June 5, 2026", excerpt: "Regulatory compliance is the backbone of the private banking industry. This guide breaks down KYC, AML, and CFT requirements in simple terms for anyone entering the sector.", tags: ["KYC", "Compliance", "Private Banking"] },
  { id: 4, title: "Resume Writing for Private Banking & Finance Jobs: 7 Things Recruiters Look For", category: "Career Tips", date: "May 28, 2026", readTime: "5 min read", excerpt: "Your resume is your first impression. Private Banking and finance recruiters see hundreds of CVs a week. Here is what separates the ones that get callbacks from the ones that don't.", tags: ["Resume", "Career", "HR Tips"] },
  { id: 5, title: "UPI, Open Private Banking & the Future of Indian FinTech: A Career Opportunity", category: "Finance", date: "May 20, 2026", readTime: "7 min read", excerpt: "India's digital payment revolution is creating thousands of new roles in FinTech, digital private banking, and payment solutions. Here is how to position yourself for this wave.", tags: ["FinTech", "Digital Private Banking", "Career"] },
  { id: 6, title: "Life Insurance vs General Insurance: Understanding the Key Differences", category: "Insurance", date: "May 12, 2026", readTime: "6 min read", excerpt: "For anyone considering a career in insurance, understanding the fundamental differences between life and general insurance products is an essential foundation to build on.", tags: ["Insurance", "Products", "IRDAI"] }
];

const popular = [
  "How to Crack a Private Banking Interview in 2026",
  "Understanding KYC, AML & CFT",
  "Rise of NBFCs in India",
  "Resume Writing for Finance Jobs"
];

export default function Blog() {
  useEffect(() => { document.title = "Blog & Articles — The Bankers Academy LLP"; }, []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">Insights & Resources</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold">Blog & Articles</motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto">Industry insights, career guidance, and private banking knowledge from our expert faculty.</motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      <section ref={gridRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-4 gap-7">
            {/* Main */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    data-testid={`filter-blog-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === cat ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/30"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <motion.div initial="hidden" animate={gridInView ? "visible" : "hidden"} variants={stagger} className="space-y-6">
                {filtered.map(({ id, title, category, date, readTime, excerpt, tags }) => (
                  <motion.div key={id} variants={fadeUp} className="bg-white rounded-3xl border border-border shadow-sm hover-lift overflow-hidden group cursor-pointer">
                    <div className="h-2 gold-gradient" />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{category}</span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Calendar size={12} />{date}</span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock size={12} />{readTime}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">{title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{excerpt}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                          {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-border text-muted-foreground text-xs">
                              <Tag size={10} />{tag}
                            </span>
                          ))}
                        </div>
                        <button className="flex items-center gap-1 text-secondary text-sm font-semibold hover:gap-2 transition-all">
                          Read More <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-9 text-muted-foreground">
                    <Search size={40} className="mx-auto mb-4 opacity-30" />
                    <p>No articles found matching your search.</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-border shadow-sm p-5">
                <h3 className="font-serif font-bold text-primary mb-3">Search Articles</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 rounded-xl"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    data-testid="input-blog-search"
                  />
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-border shadow-sm p-5">
                <h3 className="font-serif font-bold text-primary mb-4">Popular Articles</h3>
                <ul className="space-y-3">
                  {popular.map((title, i) => (
                    <li key={i} className="flex items-start gap-3 cursor-pointer group">
                      <div className="w-6 h-6 rounded bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors leading-relaxed">{title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hero-gradient rounded-3xl p-6 text-white">
                <h3 className="font-serif font-bold text-lg mb-2">Ready to Start?</h3>
                <p className="text-blue-100 text-sm mb-4">Join our 2-month program and launch your private banking career.</p>
                <a href="/admission" className="block w-full text-center py-2.5 rounded-xl gold-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Apply Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
