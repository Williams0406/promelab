const SITE_URL = "https://corporacionpromelab.com";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const revalidate = 86400;

function buildUrl(path) {
  return `${SITE_URL}${path}`;
}

function route(path, changeFrequency, priority) {
  return {
    url: buildUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

async function getProductSlugs() {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  let nextUrl = `${baseUrl}/products/`;
  const slugs = new Set();

  try {
    for (let page = 0; nextUrl && page < 20; page += 1) {
      const response = await fetch(nextUrl, {
        next: { revalidate },
      });

      if (!response.ok) break;

      const data = await response.json();
      const products = Array.isArray(data) ? data : data.results || [];

      products.forEach((product) => {
        if (product?.slug) {
          slugs.add(product.slug);
        }
      });

      nextUrl = data?.next || null;
    }
  } catch {
    return [];
  }

  return [...slugs];
}

export default async function sitemap() {
  const staticRoutes = [
    route("/", "weekly", 1),
    route("/products", "daily", 0.9),
    route("/about", "monthly", 0.7),
    route("/contact", "monthly", 0.7),
    route("/help", "monthly", 0.5),
    route("/cart", "weekly", 0.4),
    route("/login", "monthly", 0.3),
    route("/orders", "weekly", 0.3),
  ];

  const productRoutes = (await getProductSlugs()).map((slug) =>
    route(`/products/${slug}`, "weekly", 0.8)
  );

  return [...staticRoutes, ...productRoutes];
}
