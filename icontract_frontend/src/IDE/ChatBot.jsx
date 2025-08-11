"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquareCode, Send, X, Bot, User, Loader2 } from "lucide-react"

export default function CodeAssistant({ code = "" , setIsOpen, isOpen}) {
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const { data } = await axios.post("/api/code-assistant", {
        prompt: prompt.trim(),
        code: code?.trim?.() || "",
      })

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling AI assistant:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setPrompt("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <>

      {/* Chatbot Popup */}
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-gray-800 rounded-lg shadow-2xl border border-slate-200 flex flex-col z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">AI Code Assistant</h3>
                <p className="text-xs text-slate-500">Ask me about your code</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">Hi! I can see your current code and help you with any questions.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-slate-100 text-slate-800 p-3 rounded-lg rounded-bl-sm text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Analyzing your code...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me about your code..."
                disabled={isLoading}
                className="w-full resize-none text-sm"
                rows={2}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Press Enter to send, Shift+Enter for new line</p>
                <Button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
    </>
  )
}
