import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";

export default function ChatMessages(
  props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop">,
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  return (
    <div className="flex-1 w-full bg-white p-4 pr-2 pt-0 shadow-xl pb-0">
    {/* <div className="flex-1 overflow-y-auto p-4 space-y-4"> */}
      <div
        className="flex flex-col h-[85vh] gap-5 divide-y overflow-y-auto pb-4"
        ref={scrollableChatContainerRef}
      >
      {/* <div
        className="space-y-4"
        ref={scrollableChatContainerRef}
      > */}
        {props.messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="fixed bottom-[41vh] right-0 p-4 ">
        <ChatActions
          reload={props.reload}
          stop={props.stop}
          showReload={showReload}
          showStop={showStop}
        />
      </div>
    </div>
  );
}
