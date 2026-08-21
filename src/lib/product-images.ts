import tshirts from "@/assets/cat-tshirts.jpg";
import shirts from "@/assets/cat-shirts.jpg";
import activewear from "@/assets/cat-activewear.jpg";
import outerwear from "@/assets/cat-outerwear.jpg";

const BY_CATEGORY: Record<string, string> = {
  "t-shirts": tshirts,
  shirts: shirts,
  activewear: activewear,
  outerwear: outerwear,
};

export function categoryImage(slug: string | null | undefined) {
  if (!slug) return tshirts;
  return BY_CATEGORY[slug] ?? tshirts;
}

export function productImage(imageUrl: string | null | undefined, categorySlug?: string | null) {
  if (imageUrl) return imageUrl;
  return categoryImage(categorySlug);
}

export { tshirts, shirts, activewear, outerwear };
