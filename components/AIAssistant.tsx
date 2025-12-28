'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bot,
  Send,
  User,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  X,
  Maximize2,
  Minimize2,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'analysis' | 'recommendation' | 'alert' | 'general';
    confidence?: number;
    sources?: string[];
  };
}

// Quick prompts
const QUICK_PROMPTS = [
  { icon: TrendingUp, label: 'Price forecast', prompt: 'What\'s the price forecast for Brent crude next week?' },
  { icon: BarChart3, label: 'Market analysis', prompt: 'Give me a market analysis for diesel in Europe' },
  { icon: Lightbulb, label: 'Best routes', prompt: 'What are the best trade routes for 50K MT fuel oil?' },
  { icon: Zap, label: 'Quick trade', prompt: 'Find me buyers for 25K MT ULSD in West Africa' },
];

// Simulated AI responses
const AI_RESPONSES: Record<string, Message> = {
  'price': {
    id: '',
    role: 'assistant',
    content: `## Brent Crude Price Forecast

Based on current market conditions and our AI analysis:

**Short-term (7 days):** $72-76/bbl
- Geopolitical tensions in Middle East may cause upward pressure
- OPEC+ production decisions pending

**Medium-term (30 days):** $70-78/bbl
- Seasonal demand increase expected
- Inventory levels remain moderate

**Key Risk Factors:**
1. 🔴 US inventory build could push prices down
2. 🟡 China demand recovery uncertain
3. 🟢 EU sanctions on Russian oil maintaining floor

*Confidence: 78% | Last updated: ${new Date().toLocaleString()}*`,
    timestamp: new Date(),
    metadata: { type: 'analysis', confidence: 0.78, sources: ['Platts', 'Reuters', 'Internal Analytics'] }
  },
  'market': {
    id: '',
    role: 'assistant',
    content: `## European Diesel Market Analysis

**Current Spot Price:** $685/MT (Rotterdam)
**Weekly Change:** +2.3%

### Supply Dynamics
- Refinery maintenance season ending in NW Europe
- Russian diesel flows via alternative routes stable
- ARA stocks at 5-year average

### Demand Signals
- Industrial activity picking up post-summer
- Transportation sector demand stable
- Agricultural peak season approaching

### Trade Recommendation
Consider spot purchases in current window. Forward curve shows backwardation suggesting tighter supply ahead.

**Our AI Confidence Score:** 85%`,
    timestamp: new Date(),
    metadata: { type: 'recommendation', confidence: 0.85 }
  },
  'routes': {
    id: '',
    role: 'assistant',
    content: `## Optimal Trade Routes for 50K MT Fuel Oil

Based on current freight rates and demand patterns:

### Recommended Route #1 ⭐
**Rotterdam → Lagos (Nigeria)**
- Freight: $42/MT
- Demand: Very High
- Competition: Moderate
- Est. Margin: $28-35/MT
- Transit: 12-14 days

### Route #2
**Fujairah → Mumbai**
- Freight: $18/MT  
- Demand: High
- Competition: High
- Est. Margin: $15-22/MT
- Transit: 4-5 days

### Route #3
**Singapore → Ho Chi Minh City**
- Freight: $12/MT
- Demand: Medium-High
- Competition: Low
- Est. Margin: $18-25/MT
- Transit: 3 days

💡 **Pro Tip:** Lagos route has 3 verified buyers actively seeking. Want me to connect you?`,
    timestamp: new Date(),
    metadata: { type: 'recommendation', confidence: 0.92 }
  },
  'buyers': {
    id: '',
    role: 'assistant',
    content: `## Active Buyers for ULSD in West Africa

I found **7 verified buyers** matching your criteria:

### Top Matches

| Buyer | Trust Score | Volume Need | Price Range |
|-------|-------------|-------------|-------------|
| NNPC Trading | ⭐ 4.9 | 50K MT | $680-700 |
| Ghana Oil Corp | ⭐ 4.7 | 30K MT | $675-690 |
| Sonangol | ⭐ 4.6 | 45K MT | $670-685 |

### Quick Actions
1. 📧 Request quote from all 3
2. 📋 Compare deal terms
3. 🤝 Schedule intro call

All buyers are **verified** with 95%+ success rates.

Would you like me to initiate contact with any of these buyers?`,
    timestamp: new Date(),
    metadata: { type: 'recommendation', confidence: 0.88 }
  }
};

// Get AI response based on prompt
function getAIResponse(prompt: string): Message {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('price') || lowerPrompt.includes('forecast')) {
    return { ...AI_RESPONSES.price, id: Math.random().toString(36).substr(2, 9) };
  }
  if (lowerPrompt.includes('market') || lowerPrompt.includes('analysis') || lowerPrompt.includes('diesel')) {
    return { ...AI_RESPONSES.market, id: Math.random().toString(36).substr(2, 9) };
  }
  if (lowerPrompt.includes('route') || lowerPrompt.includes('trade')) {
    return { ...AI_RESPONSES.routes, id: Math.random().toString(36).substr(2, 9) };
  }
  if (lowerPrompt.includes('buyer') || lowerPrompt.includes('seller') || lowerPrompt.includes('find')) {
    return { ...AI_RESPONSES.buyers, id: Math.random().toString(36).substr(2, 9) };
  }
  
  // Default response
  return {
    id: Math.random().toString(36).substr(2, 9),
    role: 'assistant',
    content: `I understand you're asking about: "${prompt}"

Let me analyze this for you...

Based on current market conditions and Staunton Trade's proprietary data:

1. **Market Sentiment:** Moderately bullish
2. **Key Factors:** Supply constraints, seasonal demand
3. **Recommendation:** Monitor closely for opportunities

Would you like me to:
- Provide detailed price analysis?
- Find potential counterparties?
- Analyze specific routes?

Just let me know how I can help!`,
    timestamp: new Date(),
    metadata: { type: 'general', confidence: 0.7 }
  };
}

// Message Bubble Component
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 p-4',
        isUser ? 'flex-row-reverse' : ''
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
      )}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 max-w-[85%] space-y-2',
        isUser ? 'text-right' : ''
      )}>
        <div className={cn(
          'rounded-xl p-4',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
            : 'bg-muted rounded-tl-sm'
        )}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
              {/* Simple markdown-like rendering */}
              {message.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h3 key={i} className="text-base font-semibold mb-2 text-foreground">{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('### ')) {
                  return <h4 key={i} className="text-sm font-semibold mt-3 mb-1 text-foreground">{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                }
                if (line.startsWith('| ')) {
                  return (
                    <p key={i} className="font-mono text-xs bg-background/50 px-2 py-1 rounded">
                      {line}
                    </p>
                  );
                }
                if (line.startsWith('1. ') || line.startsWith('- ') || line.match(/^\d\./)) {
                  return <p key={i} className="text-muted-foreground ml-2">{line}</p>;
                }
                if (line.trim() === '') {
                  return <br key={i} />;
                }
                return <p key={i} className="text-muted-foreground">{line}</p>;
              })}
            </div>
          )}
        </div>

        {/* Metadata & Actions (for assistant messages) */}
        {!isUser && message.metadata && (
          <div className="flex items-center gap-3 px-1">
            {message.metadata.confidence && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <Sparkles size={10} />
                {Math.round(message.metadata.confidence * 100)}% confidence
              </Badge>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsUp size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsDown size={12} />
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={cn(
          'text-[10px] text-muted-foreground px-1',
          isUser ? 'text-right' : ''
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

// Typing Indicator
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 p-4"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-muted rounded-xl rounded-tl-sm p-4">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main AI Assistant Component
interface AIAssistantProps {
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function AIAssistant({ className, expanded = false, onToggleExpand }: AIAssistantProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `👋 Hello! I'm your AI Trading Assistant powered by Staunton Intelligence.

I can help you with:
- **Price forecasts** and market analysis
- **Finding buyers/sellers** with verified trust scores
- **Route optimization** for your trades
- **Real-time market insights**

How can I help you today?`,
      timestamp: new Date(),
      metadata: { type: 'general' }
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse = getAIResponse(input);
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <CardHeader className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Staunton AI
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Online
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">Your intelligent trading assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw size={14} />
            </Button>
            {onToggleExpand && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleExpand}>
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="divide-y divide-border/50">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Quick prompts</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                className="h-auto py-2 px-3 justify-start gap-2 text-xs"
                onClick={() => handleQuickPrompt(prompt.prompt)}
              >
                <prompt.icon size={12} className="text-primary" />
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <CardContent className="p-4 border-t border-border flex-shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask me anything about the market..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            {isTyping ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          AI responses are for informational purposes. Always verify before trading.
        </p>
      </CardContent>
    </Card>
  );
}

export default AIAssistant;


