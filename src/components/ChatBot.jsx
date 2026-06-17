import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "./config";
import api from "../utils/api";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for outside click detection

  const CHAT_WIDTH = 640;
  const CHAT_HEIGHT = 460;

  const [position, setPosition] = useState({
    x: window.innerWidth - CHAT_WIDTH - 24,
    y: window.innerHeight - CHAT_HEIGHT - 80,
  });
  const dragPos = useRef({ x: 0, y: 0, isDragging: false });

  // Handle auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- NEW: Close on Outside Click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the chat is open and the click target is NOT inside the chat container
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  // Drag handlers
  const onMouseDown = (e) => {
    if (!e.target.closest(".chat-header")) return;
    dragPos.current = {
      x: e.clientX,
      y: e.clientY,
      isDragging: true,
      startX: position.x,
      startY: position.y,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragPos.current.isDragging) return;
    const dx = e.clientX - dragPos.current.x;
    const dy = e.clientY - dragPos.current.y;

    let newX = dragPos.current.startX + dx;
    let newY = dragPos.current.startY + dy;

    // Boundary constraints
    newX = Math.max(0, Math.min(newX, window.innerWidth - CHAT_WIDTH));
    newY = Math.max(0, Math.min(newY, window.innerHeight - CHAT_HEIGHT));

    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = () => {
    dragPos.current.isDragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post(
        `${backendUrl}/api/Chat`,
        JSON.stringify(messageText),
        { headers: { "Content-Type": "application/json" } },
      );

      let botResponse =
        response.data.answer ||
        response.data.response ||
        response.data.message ||
        (typeof response.data === "string" ? response.data : "");

      // Logic to detect and extract HTML from markdown blocks
      if (botResponse.includes("```html")) {
        const parts = botResponse.split("```html");
        const introText = parts[0];
        const htmlContent = parts[1].split("```")[0];
        // Store as an object so the UI knows how to render it
        botResponse = { text: introText, html: htmlContent };
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      // HANDLE 503 REDIRECT
      if (err.response && err.response.status === 503) {
        window.location.href = "/service-unavailable";
        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error! Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // const sendMessage = async () => {
  //   const messageText = input.trim();
  //   if (!messageText) return;

  //   setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const response = await api.post(
  //       `${backendUrl}/api/Chat`,
  //       JSON.stringify(messageText),
  //       { headers: { "Content-Type": "application/json" } },
  //     );

  //     // FIX: Check multiple common keys or fallback to the data itself if it's a string
  //     const botResponse =
  //       response.data.answer ||
  //       response.data.response ||
  //       response.data.message ||
  //       (typeof response.data === "string"
  //         ? response.data
  //         : "I'm sorry, I received an empty response.");

  //     setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
  //   } catch (err) {
  //     // HANDLE 503 REDIRECT
  //     if (err.response && err.response.status === 503) {
  //       window.location.href = "/service-unavailable";
  //       return;
  //     }

  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: "bot", text: "Error! Please try again." },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-[#0F3A46] text-white rounded-full shadow-lg hover:bg-[#0C2A35] transition z-50 border-2 border-white"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={chatContainerRef} // Attached ref for outside click
      onMouseDown={onMouseDown}
      style={{
        top: position.y,
        left: position.x,
        width: CHAT_WIDTH,
        height: CHAT_HEIGHT,
      }}
      className="fixed bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 z-50"
    >
      <div className="chat-header bg-[#0F3A46] text-white p-4 flex justify-between items-center cursor-grab active:cursor-grabbing">
        <h2 className="font-semibold text-lg">ChatBot</h2>
        <button
          onClick={toggleChat}
          className="text-white hover:text-gray-300 text-xl font-bold cursor-pointer"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-400">
        {/* {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 max-w-[85%] p-2 rounded-md ${
              msg.sender === "bot"
                ? "bg-gray-100 text-gray-900 self-start"
                : "bg-[#0F3A46] text-white self-end"
            } break-words`}
          >
            {msg.text}
          </div>
        ))} */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 max-w-[90%] p-3 rounded-md ${
              msg.sender === "bot"
                ? "bg-gray-100 text-gray-900 self-start border border-gray-200"
                : "bg-[#0F3A46] text-white self-end"
            } break-words shadow-sm`}
          >
            {/* Handle standard text response */}
            {typeof msg.text === "string" && <div>{msg.text}</div>}

            {/* Handle HTML response */}
            {typeof msg.text === "object" && (
              <div className="flex flex-col gap-2">
                {msg.text.text && <div>{msg.text.text}</div>}
                <div
                  className="bg-white p-2 rounded border overflow-x-auto text-sm chatbot-html-content"
                  dangerouslySetInnerHTML={{ __html: msg.text.html }}
                />
              </div>
            )}
          </div>
        ))}

        {/* --- TYPING INDICATOR --- */}
        {loading && (
          <div className="mb-3 max-w-[85%] p-2 rounded-md bg-gray-100 text-gray-500 self-start italic text-sm animate-pulse">
            typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 flex gap-2 items-center">
        {/* <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Type..."
          disabled={loading}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0F3A46]"
        /> */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // If Enter is pressed WITHOUT Shift, send the message
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent adding a new line in the box
              if (!loading) sendMessage();
            }
            // If Shift + Enter is pressed, it will naturally add a new line
          }}
          placeholder="Type a message..."
          disabled={loading}
          rows={1}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0F3A46] resize-none overflow-y-auto max-h-32"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-[#0F3A46] text-white px-3 py-2 rounded-md hover:bg-[#0C2A35] transition disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
