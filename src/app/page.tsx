/*
 📄 File: src/app/page.tsx
 🧠 Description:
 This file defines the frontend UI for the Chatbot. It handles:
  - Rendering chat messages (user on the right, assistant on the left)
  - Sending user input to the backend API
  - Displaying responses from the assistant
 
 🧩 What to do in this file:
 Replace the code inside the section below (marked with "!!!! ADD FETCH LOGIC HERE !!!!")
 with your own logic for sending the message (if you’re modifying or extending it).
 The code snippet should use fetch() to send chat messages to /api/chat and
 update the chat state with the assistant’s reply.

 🚀 Challenge:
 Implement streaming logic to receive responses from /api/stream.
  - Look for the section marked "!!! ADD STREAM LOGIC HERE !!!"
  - Use `ReadableStream` + `TextDecoder` to read chunks as they arrive
  - Append each chunk to the assistant’s message in the chat UI so it displays live
 */

"use client";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  // Chatbot Variables
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to send message and get Chatbot response
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const myNewMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, myNewMessage];
    setMessages(newMessages);
    setInput("");

    /* Completed Task: Add fetch and save assistant reply to messages */
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    const assistantMessage: Message = {
      role: "assistant",
      content: data.reply || "Error!!!",
    };
    setMessages([...newMessages, assistantMessage]);

    setLoading(false);
  };

  const sendStreamMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const myNewMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, myNewMessage];
    setMessages(newMessages);
    setInput("");

    /* Completed Challenge: Add frontend streaming logic to receive and decode stream */
    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) {
        throw new Error("Failed to receive stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      // Add a placeholder for the chatbot's response
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantResponse += chunk;

        // Update the last message
        setMessages((currentMessages) => {
          const lastMessage = currentMessages[currentMessages.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...currentMessages.slice(0, -1),
              { ...lastMessage, content: assistantResponse },
            ];
          } else {
            return currentMessages;
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header Title */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          💬 AI@UCF Chatbot
        </h1>

        {/* Display Messages */}
        <div className="bg-gray-900 rounded-2xl p-4 h-[60vh] overflow-y-auto space-y-2 border border-gray-800">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 text-sm max-w-[75%] wrap-break-word ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Temp Loading Response */}
          {loading && (
            <div className="flex justify-start">
              <p className="text-gray-400 text-sm italic">
                Chatbot is thinking...
              </p>
            </div>
          )}
        </div>

        {/* User Input & Send */}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-800 rounded-xl p-3 outline-none text-gray-100 placeholder-gray-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          />
          <button
            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500 transition disabled:opacity-50"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
