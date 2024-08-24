import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Sparkles, Moon, Sun, Zap, RefreshCcw, Maximize, Minimize } from 'lucide-react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const messagesEndRef = useRef(null)
  const controls = useAnimation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = () => {
    if (input.trim() === '') return

    const newMessages = [...messages, { text: input, sender: 'user' }]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    // Simulating API call delay
    setTimeout(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        })
        const data = await response.json()
        setIsTyping(false)
        setMessages([...newMessages, { text: data.reply, sender: 'ai' }])
      } catch (error) {
        console.error('Error:', error)
        setIsTyping(false)
        setMessages([...newMessages, { text: "Sorry, I couldn't process your request. Please try again.", sender: 'ai' }])
      }
    }, 1000) // Increased delay to 1000ms to show typing animation
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    controls.start({
      rotate: [0, 360],
      transition: { duration: 0.5 }
    })
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 100 }
  }

  const typingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center space-x-2 text-gray-400 mb-4"
    >
      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-blue-500'}`}>
        <Bot size={20} className="text-white" />
      </div>
      <motion.div
        className={`p-4 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <motion.div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-400' : 'bg-blue-400'}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return (
    <motion.div
      className={`flex flex-col rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
      animate={{ height: isFullScreen ? '100vh' : '600px' }}
    >
      <motion.div
        className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600' : 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'}`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold flex items-center">
            AI Professor
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="ml-2" size={28} />
            </motion.div>
          </h2>
          <div className="flex space-x-2">
            <motion.button
              onClick={toggleFullScreen}
              className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </motion.button>
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div animate={controls}>
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
        <p className="text-sm opacity-75 mt-1">Unlocking knowledge with AI-powered brilliance</p>
      </motion.div>
      <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'}`}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className={`p-2 rounded-full ${
                    message.sender === 'user'
                      ? (isDarkMode ? 'bg-purple-600' : 'bg-orange-500')
                      : (isDarkMode ? 'bg-indigo-600' : 'bg-blue-500')
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User size={20} className="text-white" />
                  ) : (
                    <Bot size={20} className="text-white" />
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl shadow-lg ${
                    message.sender === 'user'
                      ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-orange-500 text-white')
                      : (isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800 border border-gray-200')
                  }`}
                >
                  {message.text}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isTyping && typingIndicator()}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <motion.div
        className={`border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="flex space-x-2">
          <motion.input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className={`flex-grow px-4 py-2 rounded-full focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-purple-500'
                : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'
            }`}
            placeholder="Ask about a professor..."
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 focus:ring-offset-gray-900'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 focus:ring-orange-500 focus:ring-offset-white'
            }`}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Chatbot
