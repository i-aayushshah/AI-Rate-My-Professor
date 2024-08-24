import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Sparkles } from 'lucide-react'

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    if (input.trim() === '') return

    const newMessages = [...messages, { text: input, sender: 'user' }]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await response.json()
      setTimeout(() => {
        setIsTyping(false)
        setMessages([...newMessages, { text: data.reply, sender: 'ai' }])
      }, 1500) // Slightly longer delay for a more natural feel
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      setMessages([...newMessages, { text: "Sorry, I couldn't process your request. Please try again.", sender: 'ai' }])
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-w-[800px] mx-auto border rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center">
            AI Professor Assistant
            <Sparkles size={24} className="ml-2 animate-pulse" />
          </h2>
          <p className="text-sm opacity-75 mt-1">Unlock knowledge with a chat!</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-6 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.sender === 'user' ? 'bg-indigo-600' : 'bg-white'
              } shadow-lg`}>
                {message.sender === 'user' ? (
                  <User size={24} className="text-white" />
                ) : (
                  <Bot size={24} className="text-indigo-600" />
                )}
              </div>
              <div
                className={`p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white text-gray-800'
                } shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-white shadow-lg">
                <Bot size={24} className="text-indigo-600" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-gray-800 shadow-lg">
                <div className="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-inner"
            placeholder="Ask about a professor..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .typing-animation {
          display: flex;
          align-items: center;
          column-gap: 6px;
        }
        .typing-animation span {
          height: 8px;
          width: 8px;
          background-color: #4F46E5;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.3s ease infinite;
        }
        .typing-animation span:nth-child(2) {
          animation-delay: 0.16s;
        }
        .typing-animation span:nth-child(3) {
          animation-delay: 0.32s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

export default Chatbot
