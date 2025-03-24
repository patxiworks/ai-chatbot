import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="flex flex-col h-[73vh] justify-end items-center gap-10 background-gradient">
      {/* <Header /> */}
      <ChatSection />
    </main>
  );
}
