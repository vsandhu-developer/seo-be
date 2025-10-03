import z from "zod";

export const ACCOUNT_SETUP = z
  .object({
    websiteUrl: z.url("website url is required"),
    userId: z.string("Please pass the correct user id"),
  })
  .strict();
