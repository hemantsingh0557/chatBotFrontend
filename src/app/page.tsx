"use client";

import { useState, useRef } from "react";

export default function Chatbot() {
  const [input, setInput] = useState(""); // Store the input text
  const [response, setResponse] = useState(""); // Store the response from the backend
  const [loading, setLoading] = useState(false); // Track if waiting for a response
  const [userQuestion, setUserQuestion] = useState(""); // Store the latest user question
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // Default to localhost for dev

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Send the question to the backend and get the response
  const sendMessage = async () => {
    if (!input.trim()) return;

    setUserQuestion(input); // Set the user's question in the response box
    setResponse("Waiting for a response..."); // Show waiting message
    setLoading(true); // Start loading

    try {
      const res = await fetch(`${API_BASE_URL}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      if (data.found) {
        setResponse(`${data.answer}`); // Display the backend's answer
      } else {
        setResponse(data.message); // Display "No relevant data found"
      }
    } catch {
      setResponse("Error fetching response. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }

    setInput("");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-200 p-6">
      {/* Left Side: Input */}
      <div className="w-full md:w-1/2 bg-white shadow-xl rounded-lg p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-5 text-center">Ask a Question</h2>
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line
              sendMessage();
            }
          }}
          placeholder="Type your question..."
          className="w-full p-3 border border-gray-400 rounded text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]"
          rows={1}
          disabled={loading}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 mt-4 rounded-lg text-lg transition disabled:bg-gray-400"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        <p className="mt-2 text-gray-600 text-lg">
          Example Input: Type something like Learn, Node, or any topic you prefer.
        </p>


      </div>

      {/* Right Side: Response */}
      <div className="w-full md:w-1/2 pl-8 flex flex-col justify-start">
        <div className="mt-0 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-900 text-lg break-words">
          <h3 className="text-2xl font-semibold text-blue-800 mb-3">Response</h3>
          {/* Display user question at the top */}
          {userQuestion && (
            <div className="text-lg font-bold text-black mb-2">Question: {userQuestion}</div>
          )}
          {/* Display response from backend */}
          <div className={`text-lg ${response ? "" : "text-gray-400 italic"}`}>
            {response}
          </div>
        </div>
      </div>
    </div>
  );
}
