import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const categories = ["All", "Campus", "Training", "Workshops", "Placements", "Certificates"];

const galleryItems = [
  { id: 1, category: "Campus", title: "Training Hall", desc: "Our state-of-the-art training facility", color: "bg-blue-100" },
  { id: 2, category: "Training", title: "Private Banking Workshop", desc: "Hands-on credit analysis session", color: "bg-amber-100" },
  { id: 3, category: "Placements", title: "Placement Drive", desc: "Campus drive with HDFC Bank", color: "bg-green-100" },
  { id: 4, category: "Workshops", title: "GD Round", desc: "Group discussion practice session", color: "bg-purple-100" },
  { id: 5, category: "Certificates", title: "Certificate Distribution", desc: "2023 batch graduation ceremony", color: "bg-rose-100" },
  { id: 6, category: "Campus", title: "Library & Resources", desc: "Private Banking and finance resource library", color: "bg-cyan-100" },
  { id: 7, category: "Training", title: "Mock Bank Setup", desc: "Simulated bank branch environment", color: "bg-orange-100" },
  { id: 8, category: "Placements", title: "Axis Bank Drive", desc: "40+ students placed in one drive", color: "bg-teal-100" },
  { id: 9, category: "Workshops", title: "Industry Expert Session", desc: "Lecture by SBI Deputy GM", color: "bg-violet-100" },
  { id: 10, category: "Campus", title: "Computer Lab", desc: "Core private banking system training lab", color: "bg-yellow-100" },
  { id: 11, category: "Training", title: "Insurance Module", desc: "IRDAI regulations session", color: "bg-pink-100" },
  { id: 12, category: "Certificates", title: "Batch 2022 Ceremony", desc: "100% placement batch celebration", color: "bg-indigo-100" },
  { id: 13, category: "Workshops", title: "FinTech Summit", desc: "Digital private banking and UPI masterclass", color: "bg-emerald-100" },
  { id: 14, category: "Placements", title: "Bajaj Finance Drive", desc: "NBFC sector placement event", color: "bg-red-100" },
  { id: 15, category: "Campus", title: "Faculty Room", desc: "Where private banking professionals mentor students", color: "bg-sky-100" },
  { id: 16, category: "Training", title: "Sales Role-Play", desc: "Live customer acquisition simulation", color: "bg-lime-100" }
];

export default function Gallery() {
  useEffect(() => { document.title = "Gallery — The Bankers Academy LLP"; }, []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<typeof galleryItems[0] | null>(null);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const filtered = activeFilter === "All" ? galleryItems : galleryItems.filter(i => i.category === activeFilter);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">Life at TBA</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold">Gallery</motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto">A glimpse into the world that is shaping India's next generation of private banking professionals.</motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              data-testid={`filter-gallery-${cat.toLowerCase()}`}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeFilter === cat ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-primary"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={gridRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${item.color} aspect-square`}
                  onClick={() => setLightboxItem(item)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center mb-2 font-serif font-bold text-primary text-lg">
                      {item.category[0]}
                    </div>
                    <div className="font-semibold text-primary text-sm">{item.title}</div>
                    <div className="text-muted-foreground text-xs mt-1">{item.desc}</div>
                  </div>
                  <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white" size={28} />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/80 text-xs font-medium text-primary">
                    {item.category}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative rounded-3xl overflow-hidden max-w-lg w-full aspect-video ${lightboxItem.color} flex items-center justify-center`}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-4 font-serif font-bold text-primary text-3xl">
                  {lightboxItem.category[0]}
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary">{lightboxItem.title}</h3>
                <p className="text-muted-foreground mt-2">{lightboxItem.desc}</p>
                <span className="mt-3 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{lightboxItem.category}</span>
              </div>
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                onClick={() => setLightboxItem(null)}
                data-testid="button-close-lightbox"
              >
                <X size={18} className="text-primary" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
