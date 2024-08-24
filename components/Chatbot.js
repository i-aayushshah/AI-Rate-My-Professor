import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot } from 'lucide-react'

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await response.json()
      setMessages([...newMessages, { text: data.reply, sender: 'ai' }])
    } catch (error) {
      console.error('Error:', error)
      setMessages([...newMessages, { text: "Sorry, I couldn't process your request. Please try again.", sender: 'ai' }])
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-semibold">AI Professor Assistant</h2>
        <p className="text-sm opacity-75">Ask me anything about professors or courses!</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {message.sender === 'user' ? (
                  <User size={20} className="text-white" />
                ) : (
                  <Bot size={20} className="text-gray-600" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow'
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ask about a professor..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
