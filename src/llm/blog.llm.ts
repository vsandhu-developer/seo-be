import type { AIMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { saveBlogInDb } from "./blogTools/tools.blogs";

const tools: StructuredToolInterface[] = [saveBlogInDb];
const toolNode = new ToolNode(tools);

export const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  model: "gpt-5-mini",
}).bindTools(tools);

async function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a smart SEO-focused content writer and assistant. And also use saveBlogInfo tool after generating blog to save it to database. The tool name is saveBlogInDb. Save the info to database as well use the tool after generating
      You will be given website information in JSON format: { …business JSON… }.  
      Your job is to generate **1 unique blog post at a time** in the exact structure below, and then call the database tool to save it.

      ## Rules for Blog Generation
      1. Blog length: ~1500–2000 words (long, descriptive, open to future edits).  
        - Content should feel "vast" and cover multiple angles.  
        - Expand ideas with storytelling, examples, case studies, and user-centric details.  
      2. SEO requirements:
        - 2 must-have keywords (primary)  
        - 10 nice-to-have keywords (used naturally, no stuffing)  
        - Primary keyword must appear in **title, first paragraph, one H2, and meta**.  
        - Add at least **one internal link** (pointing to another relevant page of the business).  
        - Add at least **one external authoritative link** (Wikipedia, government, research, or trusted source).  
      3. Formatting:
        - Content must be in **HTML only** (no markdown).  
        - Use **H1, H2, H3** tags properly.  
        - Must append **JSON-LD BlogPosting schema** at the end of the blog content.  
      4. Variation:
        - Every blog generated must be different (style, examples, tone, storytelling).  
        - Think like a creative SEO strategist who avoids repetitive patterns.  
      5. Save to database by use saveBlogInDb tool

      ## Output Structure
      enum status {
        DRAFT,
        PUBLISH
      }

      {
        "userId": "userId here",
        "title": "Title",
        "slug": "slug",
        "status": enum status,
        "author": "username here",
        "content": "<h1>Blog content here</h1>",
        "excerpt": "short SEO-friendly summary of the blog",
        "categories": ["categories here"],
        "tags": ["tags here"],
        "featured_media": "https://www.shawarmamoose.ca/assets/featured.jpg",
        "meta": {
          "seo_title": "blog seo meta title",
          "seo_description": "blog seo meta description",
          "focus_keyword": "primary keyword",
          "keywords": [
            "must-have and nice-to-have keywords"
          ]
        },
        "custom_fields": {
          "reading_time": "reading time",
          "rating": "rating as integer"
        }
      }

      ## Important
      1. First, generate **one blog** in the exact structure above.  
      2. Then, immediately call the database tool to save the blog in the format provided to you. and do include "json" keep the pure object so you can store data in db:

      `,
    },
    ...state.messages,
  ]);

  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("llm", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "llm")
  .addEdge("tools", "llm")
  .addConditionalEdges("llm", shouldContinue);

const app = workflow.compile();

export async function generateBlogLLM(blogInformation: string) {
  const response = await app.invoke({
    messages: [
      {
        role: "user",
        content: `Hi, This is the information of the blog ${blogInformation} and in include author information as well please generate me a seo friendly blog.`,
      },
    ],
  });

  console.log(`${response.messages[response.messages.length - 1]?.content}`);

  return response.messages[response.messages.length - 1]?.content;
}
