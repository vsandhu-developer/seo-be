import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import {
  CREATE_BUSINESS,
  GET_BUSINESS_INFO,
} from "../validators/business.validation";

export async function createBusiness(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = CREATE_BUSINESS.parse(body);

    const existingBusiness = await prisma.business.findUnique({
      where: {
        businessName: payload.businessName,
      },
    });

    if (existingBusiness) {
      return res
        .status(400)
        .json({ message: "Please Try some other business name" });
    }

    const business = await prisma.business.create({
      data: {
        businessName: payload.businessName,
        businessDescription: payload.businessDescription,
        businessType: payload.businessType,
        businessWebsiteUrl: payload.websiteURL,
        userId: payload.userId,
      },
    });

    // here we also need to create data for keywords, CompetitiveAdvantage, Competitors, currentRanking

    const keywords = await prisma.keywords.createMany({
      data: payload.keywords.map((data) => ({
        keyword: data.keyword,
        keywordType: data.keywordType,
        businessId: business.id,
      })),
    });

    // CompetitiveAdvantage

    const competitiveAdvantage = await prisma.competitiveAdvantage.createMany({
      data: {
        businessId: business.id,
        advantage: payload.advantage,
      },
    });

    // Competitor
    const competitor = await prisma.competitors.createMany({
      data: payload.competitors.map((data) => ({
        name: data.name,
        url: data.url,
        businessId: business.id,
      })),
    });

    //current Ranking

    const currentRanking = await prisma.currentRanking.create({
      data: {
        ranking: payload.ranking,
        website: payload.website,
        businessId: business.id,
      },
    });

    return res.status(200).json({
      message: "You account setup has been completed",
      business,
      keywords,
      competitiveAdvantage,
      competitor,
      currentRanking,
    });
  } catch (error) {
    const flattError = z.flattenError(error as any);

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error Occured", error: flattError });
    }
    return res.status(400).json({ message: "Error While Setting Up Business" });
  }
}

export async function getBusinessInfo(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = GET_BUSINESS_INFO.parse(body);

    const businessInfo = await prisma.business.findUnique({
      where: {
        userId: payload.userId,
      },
      include: {
        competitiors: true,
        competitiveAdvantage: true,
        currentRanking: true,
        keywords: true,
        User: {
          select: {
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return res.status(200).json({ message: "Business Info", businessInfo });
  } catch (error) {
    const flattError = z.flattenError(error as any);

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error Occured", error: flattError });
    }
    return res.status(400).json({ message: "Error While Setting Up Business" });
  }
}
