import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import z from "zod";
import { scrapeWebsite } from "../utils/tools.utils";
import { CREATE_BUSINESS } from "../validators/business.validation";

interface getWebsiteDataParams {
  url: string;
}

export const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY as string,
  model: "openai/gpt-oss-120b",
});

export const getWebsiteData = tool(
  async (params) => {
    const { url } = params as getWebsiteDataParams;
    const data = await scrapeWebsite(url);
    console.log(data);
    return data;
  },
  {
    name: "get-website-info",
    description:
      "This tool can be used to all the information of the any website. This tool will provide you proper meta tags heading tags and script related to seo which you can use to process further information related to the website",
    schema: z.object({
      url: z
        .url()
        .describe("In this parameter you can pass the url of the website."),
    }),
  }
);

export const getStructureWebsiteData = tool(
  async (summary: any) => {
    const response = await llm.invoke(
      [
        {
          role: "system",
          content: `You are a data normalization expert. Your task is to accurately convert the user's input into a JSON object that strictly adheres to the provided schema. Do not add any fields that are not in the schema.`,
        },
        {
          role: "user",
          content: JSON.stringify(summary),
        },
      ],
      {
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "business-table-information",
            schema: z.toJSONSchema(CREATE_BUSINESS),
          },
        },
      }
    );

    const rawJson = response.content;
    let structured;

    try {
      const parsed =
        typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;

      structured = CREATE_BUSINESS.parse(parsed);
    } catch (err) {
      throw new Error(`Validation failed: ${err}`);
    }

    return structured;
  },
  {
    name: "get-structure-data",
    description:
      "AI-powered validator that takes messy website/business summary and restructures it into the CREATE_BUSINESS schema.",
  }
);

export const storeDataInDb = tool(
  async (structuredJson: any) => {
    try {
      const payload = CREATE_BUSINESS.parse(structuredJson);

      console.log("Tool: Sending validated data to the API endpoint...");

      const response = await fetch(
        "http://localhost:3001/api/v1/business/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = `API Error (${response.status}): ${
          result.message || "An unknown error occurred"
        }`;
        console.error("Tool: " + errorMessage);
        return errorMessage;
      }

      console.log("Tool: API call successful.", result.message);
      return result.message;
    } catch (error: any) {
      const errorMessage = `Tool execution failed: ${error.message}`;
      console.error(errorMessage);
      return errorMessage;
    }
  },
  {
    name: "save-business-data-to-database",
    description:
      "This is the final tool to be used. It takes the complete, structured business data JSON and saves it to the database by calling the secure API endpoint. It should only be called once all information has been gathered and structured.",
    schema: CREATE_BUSINESS,
  }
);
