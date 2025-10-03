import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import { CREATE_BLOG } from "../validators/blog.validation";

export async function postBlog(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = CREATE_BLOG.parse(body);

    const business = await prisma.business.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    if (!business) {
      return res.status(400).json({ message: "Please setup your account" });
    }

    const meta = await prisma.meta.create({
      data: {
        seo_title: payload.meta.seo_title,
        seo_description: payload.meta.seo_description,
        focus_keyword: payload.meta.focus_keyword || "",
        keywords: payload.meta.keywords || [],
      },
    });

    const customField = await prisma.customField.create({
      data: {
        reading_time: payload.custom_fields.reading_time || "",
        rating: payload.custom_fields.rating || 0,
      },
    });

    const slug = payload.title.toLowerCase().trim().replace(/\s+/g, "-");

    const blog = await prisma.blog.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        content: payload.content,
        excerpt: payload.excerpt,
        businessId: business.id as string,
        featured_media: payload.featured_media,
        slug: slug,
        customFieldId: customField.id,
        metaId: meta.id,
        categories: payload.categories,
        tags: payload.tags,
      },
    });

    return res.status(200).json({
      message: "Blog Created",
      blogInfo: blog,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const flatError = z.flattenError(error);
      return res.status(400).json({
        message: "An Error Occured while account setup",
        error: flatError,
      });
    }

    return res
      .status(400)
      .json({ message: "An Error Occured while account setup", error });
  }
}
