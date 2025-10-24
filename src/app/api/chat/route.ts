import Groq from "groq-sdk";

const groq = new Groq();

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return Response.json({ error: "Messages are Missing" }, { status: 400 });
    }

    const systemMessages = {
      role: "system",
      content:
        "You are a helpful AI assistant. Keep responses concise and friendly",
    };
    const chatMessages = [systemMessages, ...messages];

    const chatOutput = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: chatMessages,
    });

    const reply = chatOutput.choices[0]?.message?.content || "";

    return Response.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("Error Occurred:", err);
    return Response.json({ error: "Error Occured" }, { status: 500 });
  }
};
