const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE = `${API_BASE}/api`;

export async function fetchFaqs() {
  const response = await fetch(`${BASE}/faqs`);

  if (!response.ok) {
    throw new Error("Unable to load FAQs.");
  }

  return response.json();
}
