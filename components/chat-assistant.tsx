"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, X, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "What should I do during an earthquake?",
  "How do I prepare for a hurricane?",
  "What are the current active alerts?",
  "How can I create an emergency kit?",
]

const botResponses: Record<string, string> = {
  earthquake: `**During an Earthquake:**

1. **DROP** to your hands and knees
2. **COVER** under a sturdy desk or table
3. **HOLD ON** until shaking stops

**After the earthquake:**
- Check for injuries and damage
- Be prepared for aftershocks
- Avoid damaged buildings
- Check gas, water, and electricity
- Use stairs, not elevators`,

  hurricane: `**Hurricane Preparation:**

1. **Create an emergency kit** with water, food, medications, flashlight, and batteries
2. **Know your evacuation zone** and routes
3. **Secure your home** - board windows, bring in outdoor furniture
4. **Fill your car with gas** and withdraw cash
5. **Charge all devices** before the storm

**During the hurricane:**
- Stay indoors away from windows
- Monitor emergency broadcasts
- Never drive through flooded roads`,

  alerts: `**Current Active Alerts:**

I'm monitoring several events in your zones of interest:

- **Southern California Earthquake** (Critical) - M6.4
- **Hurricane Maria** (Critical) - Cat 4, approaching Florida
- **Sierra Nevada Wildfire** (Warning) - 45,000 acres

Would you like specific details about any of these events?`,

  kit: `**Emergency Kit Essentials:**

**Water & Food:**
- 1 gallon per person per day (3-day minimum)
- Non-perishable food items
- Manual can opener

**Safety & Health:**
- First aid kit
- Prescription medications
- Flashlight with extra batteries
- Whistle for signaling

**Documents & Communication:**
- Copies of important documents
- Battery-powered radio
- Charged power bank
- Local maps

**Additional Items:**
- Cash in small bills
- Change of clothes
- Blankets or sleeping bags`,

  default: `I'm your emergency preparedness assistant. I can help you with:

- **Event information** - Current alerts and updates
- **Safety procedures** - What to do during natural disasters
- **Preparation tips** - How to prepare for emergencies
- **Emergency resources** - Contacts and supplies

What would you like to know?`,
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes("earthquake") || lower.includes("quake")) {
    return botResponses.earthquake
  }
  if (lower.includes("hurricane") || lower.includes("storm") || lower.includes("prepare")) {
    return botResponses.hurricane
  }
  if (lower.includes("alert") || lower.includes("current") || lower.includes("active")) {
    return botResponses.alerts
  }
  if (lower.includes("kit") || lower.includes("emergency") || lower.includes("supplies")) {
    return botResponses.kit
  }
  return botResponses.default
}

interface ChatAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatAssistant({ isOpen, onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your emergency preparedness assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = getResponse(input)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <Card className="bg-card border-border shadow-xl flex flex-col h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Emergency Assistant</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
              {message.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-secondary rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg"
    >
      <MessageSquare className="w-6 h-6" />
    </Button>
  )
}
