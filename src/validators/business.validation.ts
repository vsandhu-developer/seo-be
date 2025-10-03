import z from "zod";

const keywordType = z.enum(["MUST_HAVE", "NICE_TO_HAVE"]);

export const CREATE_BUSINESS = z
  .object({
    businessName: z.string("Name is required").min(3),
    businessType: z.string("Business Type is required").min(3),
    businessDescription: z.string("Business description is required").min(3),
    websiteURL: z.url("Website URL is required"),
    userId: z.string("User Id is required"),
    // keywords data

    keywords: z.array(
      z.object({
        keyword: z.string("keyword is required"),
        keywordType: keywordType,
      })
    ),

    // Advantage
    advantage: z.array(z.string("Competitor Advantge Required")),

    // Competitor
    competitors: z.array(
      z.object({
        name: z.string("Competitor Name is required"),
        url: z.string("Competitor URL is required"),
      })
    ),

    // Ranking
    ranking: z.string("Current Ranking is required"),
    website: z.url("Ranking Website Url Is required"),
  })
  .strict();

export const GET_BUSINESS_INFO = z
  .object({
    userId: z.string(),
  })
  .strict();
