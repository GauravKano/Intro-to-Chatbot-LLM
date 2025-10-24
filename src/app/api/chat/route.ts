/*
 📄 File: src/app/api/chat/route.ts
 🧠 Description:
 This file defines a POST API route for a chat endpoint using the Groq SDK.
 It should accept an array of messages from the client, prepend a system message,
 call the Groq model, and return the assistant's response to the frontend.

 🧩 What to do in this file:
 Write code in the section below (marked with "!!!! ADD CHATBOT API CODE HERE !!!!") to implement the POST function to handle the request: process incoming messages,
 call `groq.chat.completions.create`, and return the assistant's reply as JSON.
*/

import Groq from "groq-sdk";

const groq = new Groq();

export const POST = async (req: Request) => {
  try {
    // Get the message from HTTP request
    const { messages } = await req.json();
    if (!messages) {
      return Response.json({ error: "Messages are Missing" }, { status: 400 });
    }

    // Create a System Message
    const systemMessages = {
      role: "system",
      content:
        "You are a helpful AI assistant. Keep responses concise and friendly",
    };
    const chatMessages = [systemMessages, ...messages];

    // Get response from groq
    const chatOutput = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: chatMessages,
    });
    const reply = chatOutput.choices[0]?.message?.content || "";

    // Return to frontend
    return Response.json({ reply }, { status: 200 });
  } catch (err) {
    // Error Occured return 500 status code
    console.error("Error Occurred:", err);
    return Response.json({ error: "Error Occured" }, { status: 500 });
  }
};
