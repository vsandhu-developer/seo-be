import type { AIMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const tools: StructuredToolInterface[] = [];
const toolNode = new ToolNode(tools);

export const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY as string,
  model: "openai/gpt-oss-120b",
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
      content: `You are a smart assistant. The information of the website will be provided to you. You have to generated blogs based on that information make sure to target 2 must have and 10 nice to have keywords. Also the blog length need to be around 1500 to 2000. to match the standards and blog also need to more seo friendly and make sure it target all the required keywords.

      You are an SEO-focused content writer. Write a blog post using the following business data: { …business JSON… }. Use the following SEO rules:

        - Must put primary keyword in title, first paragraph, H2, meta.
        - Use header structure (H1, H2, H3).
        - Include an internal link and an external authoritative link.
        - Avoid keyword stuffing; NICE_TO_HAVE keywords can appear naturally.
        - Append JSON-LD BlogPosting schema.
        - Output in HTML only (no markdown).
        - Provide title, metaTitle, metaDescription, content.

        Now generate the output in the structure given below.


      {
        "title": "The Key to Success: How Discipline Shapes Your Path",
        "slug": "discipline-key-to-success",
        "status": "publish",
        "author": 1,
        "content": "<p>Discipline is the bridge between goals and accomplishment...</p>",
        "excerpt": "Discover how discipline shapes your path to success, helps you build consistency, and drives long-term achievement.",
        "categories": [2, 5],
        "tags": ["discipline", "success", "personal growth", "motivation"],
        "featured_media": 123,
        "meta": {
            "seo_title": "How Discipline Shapes Success | Codepaper Insights",
            "seo_description": "Learn why discipline is the foundation of success and how it drives personal growth, consistency, and achievement.",
            "focus_keyword": "discipline for success",
            "keywords": [
            "discipline",
            "personal growth",
            "success habits",
            "motivation"
            ]
        },
        "custom_fields": {
            "reading_time": "6 min",
            "rating": 8
        }
        }
        the output need to be in this structure and also the content need to be in html format for better seo 
      
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

export async function generateBlogLLM(blogData: string) {
  const response = await app.invoke({
    messages: [
      {
        role: "user",
        content: `Hi, This is the information of the blog ${blogData} please generate me a seo friendly blog.`,
      },
    ],
  });

  return console.log(
    `${response.messages[response.messages.length - 1]?.content}`
  );
}
