import { StreamingTextResponse } from 'ai';
import { ChatMessage, MessageContent, OpenAI, TogetherLLM } from 'llamaindex';
import { NextRequest, NextResponse } from 'next/server';
import { createChatEngine } from './engine';
import { LlamaIndexStream } from './llamaindex-stream';

import { fetchProductDetails } from '../saleor/saleor';
import { transformProductToDocument } from '../saleor/transformer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const convertMessageContent = (
  textMessage: string,
  imageUrl: string | undefined
): MessageContent => {
  if (!imageUrl) return textMessage;
  return [
    {
      type: 'text',
      text: textMessage,
    },
    {
      type: 'image_url',
      image_url: {
        url: imageUrl,
      },
    },
  ];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, data }: { messages: ChatMessage[]; data: any } = body;
    const userMessage = messages.pop();
    if (!messages || !userMessage || userMessage.role !== 'user') {
      return NextResponse.json(
        {
          error:
            'messages are required in the request body and the last message must be from the user',
        },
        { status: 400 }
      );
    }

    //console.log(messages)
    //console.log(userMessage)
    //console.log(body)

    //const { productId, query } = await request.json();

    //const product = await fetchProductDetails("UHJvZHVjdDoxNTM=");
    //const document = transformProductToDocument(product);

    const llm = new TogetherLLM({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      maxTokens: 512,
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const chatEngine = await createChatEngine(llm);

    // Convert message content from Vercel/AI format to LlamaIndex/OpenAI format
    const userMessageContent = convertMessageContent(
      userMessage.content,
      data?.imageUrl
    );

    const contextUserMessage = `You are an expert on the life of Saint Josemaria Escriva. Use his biography to answer the question: ${userMessageContent}. If the question is not related to the book, say that you cannot answer it.`

    // Calling LlamaIndex's ChatEngine to get a streamed response
    const response = await chatEngine.chat({
      //message: userMessageContent,
      message: contextUserMessage,
      chatHistory: messages,
      stream: true,
    });

    // Transform LlamaIndex stream to Vercel/AI format
    const { stream, data: streamData } = LlamaIndexStream(response, {
      parserOptions: {
        image_url: data?.imageUrl,
      },
    });

    // Return a StreamingTextResponse, which can be consumed by the Vercel/AI client
    return new StreamingTextResponse(stream, {}, streamData);
  } catch (error) {
    console.error('[LlamaIndex]', error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
