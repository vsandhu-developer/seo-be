import { tool } from "@langchain/core/tools";
import { CREATE_BLOG } from "../../validators/blog.validation";

export const saveBlogInDb = tool(
  async (structuredJson: any) => {
    try {
      const payload = CREATE_BLOG.parse(structuredJson);

      console.log("Tool: Sending validated data to the API endpoint...");

      const response = await fetch("http://localhost:3001/api/v1/blog/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
    name: "save-blog-info",
    description:
      "This is the final tool to be used. It takes the complete, structured business data JSON and saves it to the database by calling the secure API endpoint. It should only be called once all information has been gathered and structured.",
    schema: CREATE_BLOG,
  }
);
