import z from "zod";

export const CREATE_BLOG = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["DRAFT", "PUBLISH"]).default("DRAFT"),
  author: z.string().min(1, "Author name is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  featured_media: z.string(),

  meta: z.object({
    seo_title: z.string().min(1, "SEO title is required"),
    seo_description: z.string().min(1, "SEO description is required"),
    focus_keyword: z.string(),
    keywords: z.array(z.string()),
  }),

  custom_fields: z.object({
    reading_time: z.string(),
    rating: z.number().int().min(0).max(10),
  }),
});
