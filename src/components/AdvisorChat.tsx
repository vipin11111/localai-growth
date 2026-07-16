import { useState, useRef, useEffect } from "react";
import { BusinessProfile, ChatMessage } from "../types";
import { Sparkles, Send, Lightbulb, Compass, RotateCw, User, Cpu } from "lucide-react";

interface AdvisorChatProps {
  profile: BusinessProfile | null;
}

export default function AdvisorChat({ profile }: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How to increase physical foot traffic?",
    "3 local SEO keywords I must use?",
    "How to price our packages?",
    "How to get more Google Reviews?"
  ];

  // Load welcome message on mount
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      sender: "advisor",
      text: `### Welcome to LocalAI Advisor! 📈\n\nI am your dedicated senior small business consultant, powered by Google's Gemini models.\n\nBased on your active business profile (**${profile?.name || "unconfigured brand"}**), I can advise you on target customer acquisition, optimal service packaging, SEO tricks, or local marketing campaigns.\n\n*Tap one of the quick prompts below or write your custom question to begin!*`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
  }, [profile]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || thinking) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const response = await fetch("/api/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile?.name || "Local Business",
          type: profile?.category || "SaaS Partner",
          description: profile?.address ? `Located at ${profile.address}.` : "",
          message: textToSend
        })
      });

      const resData = await response.json();
      if (resData.answer) {
        const advisorMsg: ChatMessage = {
          sender: "advisor",
          text: resData.answer,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, advisorMsg]);
      }
    } catch (err) {
      console.error("Advisor chat request failed:", err);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">LocalAI Growth Advisor</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini model online
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset chat log?")) {
              setMessages([
                {
                  sender: "advisor",
                  text: `Welcome back! How else can I help optimize your business today?`,
                  timestamp: new Date().toISOString()
                }
              ]);
            }
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all text-slate-400 hover:text-slate-600"
          title="Reset chat"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-grow p-6 overflow-y-auto space-y-5 bg-slate-50/50 dark:bg-slate-950/10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3.5 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Sender Icon */}
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-indigo-600 text-white shadow-sm"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/10 font-medium"
                  : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-tl-none shadow-sm whitespace-pre-wrap"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-start gap-3.5 mr-auto max-w-[85%]">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 py-3">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Footer controls & prompt suggestions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/20 space-y-3 flex-shrink-0">
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                disabled={thinking}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-850 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800/50 rounded-full text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={thinking}
            placeholder="Type your strategic business questions (e.g. competitor actions)..."
            className="flex-grow px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            id="send-chat-btn"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl shadow-md transition-all flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
