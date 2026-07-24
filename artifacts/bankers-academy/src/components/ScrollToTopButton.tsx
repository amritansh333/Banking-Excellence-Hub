import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-[999] flex h-12 w-12 items-center justify-center rounded-full
      bg-[#C89B3C] text-white shadow-xl
      transition-all duration-300 ease-out
      hover:bg-[#b8892e]
      hover:-translate-y-1
      hover:scale-110
      active:scale-95
      ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <ChevronUp
        size={28}
        className="transition-transform duration-300 text-[#0B1F4D] group-hover:-translate-y-0.5"
      />
    </button>
  );
}
