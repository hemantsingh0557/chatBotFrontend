"use client";

import { useState, useRef } from "react";

export default function Chatbot() {
  const [input, setInput] = useState(""); // Store the input text (user's question)
  const [response, setResponse] = useState(""); // Store the response from the backend

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Function to auto-resize the textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textAreaRef.current;
    setInput(e.target.value);

    // Adjust the height of the textarea dynamically
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Function to send the question to the backend and get the response
  const sendMessage = async () => {
    if (!input.trim()) return; // Don't send if the input is empty or only spaces

    try {
      // Send the question to the backend API
      const res = await fetch("https://chat-botbackend-self.vercel.app/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }), // Send the question as JSON
      });

      // If the response is not OK, throw an error
      if (!res.ok) {
        throw new Error('Failed to fetch response from the backend.');
      }

      // Parse the response JSON
      const data = await res.json();
      
      // Set the response from the backend or display a default message if not present
      setResponse(data.answer || "No answer provided");
    } catch {
      setResponse("Error"); // Display error message if there's a failure
    }

    setInput(""); // Clear input field after sending the message
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-200 p-6">
      {/* Left Side: Ask Question */}
      <div className="w-full md:w-1/2 bg-white shadow-xl rounded-lg p-8 flex flex-col items-center mb-4 md:mb-0">
        <h2 className="text-3xl font-bold text-blue-900 mb-5 text-center">Ask a Question</h2>
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Allow sending on Enter key press
          placeholder="Type your question..."
          className="w-full p-3 border border-gray-400 rounded text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]"
          rows={1} // Minimum rows
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 mt-4 rounded-lg text-lg transition"
          onClick={sendMessage} // Call the sendMessage function when the button is clicked
        >
          Send
        </button>
      </div>

      {/* Right Side: Response */}
      <div className="w-full md:w-1/2 pl-8 flex flex-col justify-start">
        <div className="mt-0 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-900 text-lg break-words">
          <h3 className="text-2xl font-semibold text-blue-800 mb-3">Response</h3>
          {/* Display the response or a loading message if no response */}
          <div className={`text-lg ${response ? '' : 'text-gray-400 italic'}`}>
            {response || <span className="text-gray-400 italic">Waiting for a response...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
