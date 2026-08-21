import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabase } from "./catalog.server";

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicSupabase();
  const [categories, products] = await Promise.all([
    supabase.from("categories").select("id, name, slug, description, sort_order").order("sort_order"),
    supabase
      .from("products")
      .select("id, name, slug, description, fabric, gsm, sizes, colors, moq, base_price, image_url, category_id")
      .eq("is_active", true)
      .order("name"),
  ]);

  if (categories.error) throw new Error(categories.error.message);
  if (products.error) throw new Error(products.error.message);

  return {
    categories: categories.data ?? [],
    products: products.data ?? [],
  };
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = createPublicSupabase();
    const { data: product, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, fabric, gsm, sizes, colors, moq, base_price, image_url, category_id, categories(name, slug)",
      )
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return product;
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        company_name: z.string().min(2).max(120),
        contact_person: z.string().min(2).max(120),
        email: z.string().email().max(160),
        phone: z.string().max(40).default(""),
        product_interest: z.string().max(200).default(""),
        estimated_quantity: z.string().max(80).default(""),
        message: z.string().max(2000).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = createPublicSupabase();
    const { error } = await supabase.from("inquiries").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
