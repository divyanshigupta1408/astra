import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../services/aiAssistant';
import { MessageSquare, X, Send, Bot, Sparkles, Mic, MicOff, Scale, HelpCircle } from 'lucide-react';

interface AiAssistantWidgetProps {
  language: 'en' | 'hi';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const initialWelcome = language === 'hi'
    ? 'नमस्ते! मैं A.S.T.R.A मित्र हूँ, जनजातीय कार्य मंत्रालय (MoTA) का सहायक। मैं एसटी छात्रवृत्ति एवं फैलोशिप दिशानिर्देशों पर जानकारी देता हूँ। मैं आपकी क्या सहायता कर सकता हूँ?'
    : 'Namaste! I am A.S.T.R.A Mitra, an advisory assistant for MoTA Scheduled Tribe scholarships and fellowships. I cite statutory guideline clauses to assist you. How may I help you today?';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: initialWelcome,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askAiAssistant(textToSend.trim(), language);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: language === 'hi'
            ? 'सॉरी, तकनीकी कारण से उत्तर नहीं मिल सका। कृपया नोडल अधिकारी से संपर्क करें।'
            : 'Sorry, unable to fetch response. Please contact your tribal nodal officer.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice speech input for chat
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const sampleQuestions = language === 'hi'
    ? [
        'पोस्ट-मैट्रिक छात्रवृत्ति हेतु आय सीमा क्या है?',
        'नेशनल फैलोशिप (NFHET) के क्या लाभ हैं?',
        'क्या मैं पात्र हूँ?',
        'डीबीटी हेतु बैंक में क्या आवश्यक है?'
      ]
    : [
        'What is the income ceiling for Post-Matric ST?',
        'What are the NFHET fellowship amounts?',
        'Am I eligible for Top Class Education?',
        'What are the mandatory bank DBT rules?'
      ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-emerald-900 hover:bg-emerald-950 text-white p-3.5 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center gap-2 border-2 border-amber-400 group"
          title="Open A.S.T.R.A AI Mitra"
        >
          <Bot className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold hidden sm:inline pr-1">
            A.S.T.R.A Mitra
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col h-[520px]">
          {/* Top Bar */}
          <div className="bg-emerald-950 text-white p-3.5 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-900 rounded-lg text-amber-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>A.S.T.R.A Mitra</span>
                  <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                    Statutory Guardrails
                  </span>
                </h4>
                <p className="text-[10px] text-stone-300">
                  Citing MoTA Guideline Clauses • Advisory Only
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Principle Notice Bar */}
          <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-3 py-1 text-[10px] flex items-center gap-1.5 font-semibold">
            <Scale className="w-3 h-3 text-amber-700 shrink-0" />
            <span>AI assists, rules decide, humans approve.</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-stone-50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      isUser
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white border border-stone-200 text-stone-800 shadow-2xs whitespace-pre-line leading-relaxed'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-lg p-3 text-stone-500 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Searching scheme knowledge snippets & clauses...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-white p-2 border-t border-stone-200 flex gap-1.5 overflow-x-auto text-[11px]">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-stone-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={language === 'hi' ? 'छात्रवृत्ति नियमों के बारे में पूछें...' : 'Ask about ST scholarship clauses...'}
              className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-stone-800"
            />

            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-md border text-xs transition-colors ${
                isListening
                  ? 'bg-red-600 border-red-700 text-white animate-pulse'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2 rounded-md bg-emerald-900 hover:bg-emerald-950 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
