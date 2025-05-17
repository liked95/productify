import { Bot } from 'lucide-react';
import { useAIAssistantStore } from '@/store/aiAssistantStore';

export function AIAssistantToggle() {
  const toggle = useAIAssistantStore(state => state.toggle);

  return (
    <button
      onClick={() => toggle()}
      className="ml-2 p-2 rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
      title="Open AI Assistant"
      aria-label="Open AI Assistant"
    >
      <Bot className="h-6 w-6 text-foreground" />
    </button>
  );
} 