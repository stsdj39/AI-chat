import { createMessage } from "@/db";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { error } from "console";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 在顶部添加开发环境时钟容差配置
if (process.env.NODE_ENV === "development") {
  // 在开发环境下设置JWT时钟容差
  process.env.CLERK_JWT_CLOCK_SKEW_SECONDS = "60";
}

// ... existing imports ...

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEKER_API_KEY, // 注意这里要和.env文件中的变量名保持一致
  baseURL: process.env.BASE_URL,
});

// ... existing POST function ...

export async function POST(req: Request) {
  const { messages, model, chat_id, chat_user_id } = await req.json();

  const { userId } = await auth();
  if (!userId || userId !== chat_user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // 存入用户消息
  const lastMessage = messages[messages.length - 1];
  await createMessage(chat_id, lastMessage.content, lastMessage.role);

  const result = streamText({
    model: deepseek("deepseek-v3"),
    system: "You are a helpful assistant.",
    messages,
    onFinish: async (result) => {
      await createMessage(chat_id, result.text, "assistant");
    },
  });

  return result.toDataStreamResponse();
}
