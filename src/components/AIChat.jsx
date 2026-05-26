import React, { useState, useRef, useEffect } from 'react'
import { askGemini } from '../utils/geminiApi'
import { localAnswer } from '../utils/localAI'
import './AIChat.css'

const AIChat = ({ data, dataSummary, citySummaries }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response

      // Try Gemini API first
      const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
      if (GEMINI_KEY) {
        try {
          response = await askGemini(userMessage.content, dataSummary)

          // Check if response is an API error message (quota, auth, etc.)
          const isApiError = response.toLowerCase().includes('quota exceeded') ||
                             response.toLowerCase().includes('api key not configured') ||
                             response.toLowerCase().includes('not found for api version') ||
                             response.toLowerCase().includes('api request failed')

          if (isApiError) {
            console.log('[AI Chat] Gemini API error, falling back to local AI:', response)
            response = localAnswer(userMessage.content, data, citySummaries)
          }
        } catch (apiError) {
          // Gemini failed completely, fall back to local AI
          console.log('[AI Chat] Gemini API call failed, falling back to local AI:', apiError.message)
          response = localAnswer(userMessage.content, data, citySummaries)
        }
      } else {
        // No API key configured, use local AI directly
        response = localAnswer(userMessage.content, data, citySummaries)
      }

      const aiMessage = { role: 'ai', content: response }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Suggested questions
  const suggestions = [
    'Which city has the highest total collection?',
    'How many properties are rejected in Mumbai?',
    'What percentage of Delhi properties are approved?',
    'Which city has the most pending properties?'
  ]

  const handleSuggestion = (question) => {
    setInput(question)
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chat Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!isOpen && <span className="chat-badge">AI</span>}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="chat-panel glass-card slide-in-right">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.25 3.75 9.75 9 11 5.25-1.25 9-5.75 9-11A10 10 0 0 0 12 2z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div>
                <h3 className="chat-title">UPYOG AI Assistant</h3>
                <p className="chat-status">Ask about property tax data</p>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="empty-title">Hello! I can help you analyze property tax data</p>
                <p className="empty-subtitle">Try asking a question or use one of the suggestions below</p>
                <div className="suggestions">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="suggestion-btn"
                      onClick={() => handleSuggestion(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message ai">
                <div className="message-bubble ai loading">
                  <span className="pulse-dot">.</span>
                  <span className="pulse-dot">.</span>
                  <span className="pulse-dot">.</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="m22 2-11 11" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat
