# 🤖 Intro to Chatbot & LLMs — Live Coding Project

Welcome to the **Intro to Chatbot & LLMs** live coding session!  
This project is designed to help you understand how to build a simple chatbot UI and connect it to a Large Language Model (LLM) using the **Groq SDK**.

---

## 🧱 Overview

You’ll be working in a **Next.js (App Router)** project with two main goals:

1. Implement a **normal chat** flow (one-shot response).
2. Implement a **streaming chat** flow (real-time response).

There are **3 files** where you’ll be adding logic, and **completed solutions** are provided in the `solution` branch.

---

## 📂 Project Structure

Here’s what you’ll be editing:

### 1. `src/app/page.tsx`

- The **frontend UI** for the chatbot.
- Handles:
  - Rendering chat messages (user → right, assistant → left)
  - Sending messages to the backend
  - Displaying responses from the assistant
- **Sections to complete:**
  - `!!!! Add Fetch Logic Here !!!!` → normal chat logic (`/api/chat`)
  - `!!! ADD STREAM LOGIC HERE !!!` → streaming logic (`/api/stream`)

---

### 2. `src/app/api/chat/route.ts`

- Backend API route for **normal chat**.
- Handles one full response from the model.
- **Your task:**  
  Implement the POST function to:
  - Read messages from the request
  - Add a system message
  - Call Groq model (`groq.chat.completions.create`)
  - Return a JSON response with the assistant’s reply

---

### 3. `src/app/api/stream/route.ts`

- Backend API route for **streaming chat**.
- Streams the model’s output chunk-by-chunk to the frontend.
- **Your task:**
  - Use `ReadableStream` + `TextEncoder` to encode and send text chunks
  - Return the stream in a new `Response` with headers
  - This gives real-time typing effect in the UI

---

## 🧩 Solution Branch

Once you’ve completed your implementation, you can compare your work with the reference solution in the `solution` branch:

```bash
git checkout solution
```

---

## ⚙️ Stepup Instructions

Clone the repo:

```bash
git clone <repo-url>
cd <project-folder>
```

Install the dependencies:

```bash
npm install
```

Set up environment variables:

```bash
GROQ_API_KEY=[your_api_key_here]
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
