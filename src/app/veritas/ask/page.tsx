import ChatInterface from "@/components/veritas/ChatInterface";
import PageHeader from "@/components/veritas/PageHeader";

export default function AskAquinas() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Ask Aquinas"
        subtitle="AI chat grounded in the complete works of Aquinas"
        icon="💬"
      />
      <ChatInterface
        endpoint="/api/veritas-chat"
        placeholder="Ask anything about Catholic theology, philosophy, or apologetics..."
        welcomeMessage={`Welcome to Ask Aquinas — your personal Thomistic AI theologian.

I have access to the complete works of St. Thomas Aquinas, the Church Fathers, Sacred Scripture, the Catechism, and the full Catholic intellectual tradition.

Ask me anything:
• Theological questions ("What is the hypostatic union?")
• Philosophical questions ("How do the Five Ways work?")
• Apologetics ("How do I respond to sola scriptura?")
• Moral theology ("What does natural law say about X?")
• Scripture interpretation ("What does John 6 really mean?")
• Study help ("Explain ST I, q.3, a.4")

I will always cite my sources. Let's begin.`}
      />
    </div>
  );
}
