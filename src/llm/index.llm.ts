import type { AIMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { getWebsiteData, storeDataInDb } from "../tools/llm.tools";

const tools: StructuredToolInterface[] = [getWebsiteData, storeDataInDb];
const toolNode = new ToolNode(tools);

export const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  model: "gpt-5",
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
      content: `You are a smart assistant. The url of the website will be provided to you. Use this user id passed by user You have find business details
      const keywordType = z.enum(["MUST_HAVE", "NICE_TO_HAVE"]);
     
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
          website: z.url("Ranking Website Url Is required"), This is required information you need to find include 10 must have and 20 nice to have keywords and also give the output in the same format currently you need to follow this structure you can include keywords and other options from your side. Make sure the output follow same format. also do not include "json" prefix as I need the to store in db later on. I have also added a tool for you add data in db. Use this tool to store the output response in DB.`,
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

export async function executeLLM(websiteUrl: string, userId: string) {
  const response = await app.invoke({
    messages: [
      {
        role: "user",
        content: `Hi, Can you tell me about this website ${websiteUrl} and this is the user id ${userId}`,
      },
    ],
  });

  return console.log(
    `${response.messages[response.messages.length - 1]?.content}`
  );
}
