import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Sparkles, AlertCircle, Shield, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateDualOpinion } from '../lib/dualOpinionEngine';
import DualOpinionView from './DualOpinionView';
import type { AssistantPersona, ChatMessage } from '../types/database';
import type { Opinion, OpinionDiff } from '../lib/dualOpinionEngine';

interface AIHealthAssistantV2Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIHealthAssistantV2({ isOpen, onClose }: AIHealthAssistantV2Props) {
  const [personas, setPersonas] = useState<AssistantPersona[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dualOpinionEnabled, setDualOpinionEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadPersonas();
      addWelcomeMessage();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPersonas = async () => {
    const { data } = await supabase
      .from('assistant_personas')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (data) setPersonas(data);
  };

  const addWelcomeMessage = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Advisor with dual-opinion capability. I can provide you with two expert perspectives on your health questions. Toggle "Second Opinion" to get comprehensive insights from multiple AI reasoning approaches.',
      timestamp: new Date()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (dualOpinionEnabled && personas.length >= 2) {
        const personaA = personas.find(p => p.reasoning_style === 'evidence_based') || personas[0];
        const personaB = personas.find(p => p.reasoning_style === 'contextual') || personas[1];

        const { opinionA, opinionB, diff } = generateDualOpinion(
          userMsg.content,
          personaA,
          personaB
        );

        const dualOpinionMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'dual-opinion',
          opinionA,
          opinionB,
          diff,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, dualOpinionMsg]);
      } else {
        const defaultPersona = personas[0] || null;
        const response = generateSingleResponse(userMsg.content, defaultPersona);

        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMsg]);
      }

      setIsLoading(false);
    }, 1500);
  };

  const generateSingleResponse = (input: string, persona: AssistantPersona | null): string => {
    const msg = input.toLowerCase();

    if (msg.includes('energy') || msg.includes('tired')) {
      return 'Afternoon energy dips are common and often related to circadian rhythms, meal composition, and sleep quality. Consider:\n\n• Balanced lunch with protein and complex carbs\n• 10-minute walk after eating\n• Hydration check (often overlooked!)\n• Consistent sleep schedule\n\nWould you like me to analyze this in more depth with two expert opinions? Toggle "Second Opinion" and ask again!';
    }

    if (msg.includes('sleep')) {
      return 'Sleep quality is multifactorial. Key evidence-based recommendations:\n\n• Fixed wake time (±15 min) including weekends\n• Cool bedroom (65-68°F)\n• Blue light reduction 2h before bed\n• Morning bright light exposure\n\nFor a comprehensive analysis with multiple perspectives, enable "Second Opinion" mode!';
    }

    return 'I\'m here to help with your wellness questions. Could you provide more details about your situation?\n\nTip: Enable "Second Opinion" mode to get two different AI perspectives - one evidence-based and one contextual/practical.';
  };

  const handleMerge = (preference: 'A' | 'B' | 'merge') => {
    const confirmMsg = {
      id: Date.now().toString(),
      role: 'system',
      content: `You've adopted ${preference === 'merge' ? 'the merged' : `Opinion ${preference}`} approach. Your preferences have been saved.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  const handleCreateReport = () => {
    const confirmMsg = {
      id: Date.now().toString(),
      role: 'system',
      content: '📊 Report generation feature coming soon! This will create a detailed health report based on our conversation.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  const handleAddGoals = (recommendations: any[]) => {
    const confirmMsg = {
      id: Date.now().toString(),
      role: 'system',
      content: `🎯 Goal creation feature coming soon! ${recommendations.length} recommendations will be converted into trackable goals.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-5xl h-[85vh] pointer-events-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-orange-600/30 flex flex-col overflow-hidden">
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-orange-600/30 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-orange-900/10"></div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/50">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">AI Health Advisor</h3>
                  <p className="text-gray-400 text-sm">Multi-Persona Doctor with Dual Opinion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur px-3 py-2 rounded-xl border border-gray-700/50">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-xs font-medium">Wellness guidance • Not medical diagnosis</span>
              </div>

              <button
                onClick={() => setDualOpinionEnabled(!dualOpinionEnabled)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${
                  dualOpinionEnabled
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/50'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-orange-600/50 hover:text-orange-400'
                }`}
              >
                <Scale className="h-5 w-5" />
                <span className="text-sm font-semibold">Second Opinion</span>
                {dualOpinionEnabled && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">ON</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950/50">
            {messages.map((message) => {
              if (message.type === 'dual-opinion') {
                return (
                  <div key={message.id} className="w-full">
                    <div className="mb-3 flex items-center space-x-2 bg-gray-800/50 backdrop-blur px-3 py-2 rounded-xl border border-orange-600/30 w-fit">
                      <Scale className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-semibold text-white">
                        Dual Opinion Analysis
                      </span>
                    </div>
                    <DualOpinionView
                      opinionA={message.opinionA}
                      opinionB={message.opinionB}
                      diff={message.diff}
                      onMerge={handleMerge}
                      onCreateReport={handleCreateReport}
                      onAddGoals={handleAddGoals}
                    />
                  </div>
                );
              }

              const isUser = message.role === 'user';
              const isSystem = message.role === 'system';

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="max-w-md bg-gray-800/50 backdrop-blur border border-orange-600/30 rounded-xl px-4 py-3">
                      <p className="text-sm text-gray-300 text-center">{message.content}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${
                    isUser
                      ? 'bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/30'
                      : 'bg-gray-800/80 backdrop-blur text-white border border-gray-700/50'
                  } rounded-2xl px-5 py-3`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur border border-gray-700/50 rounded-2xl px-5 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  {dualOpinionEnabled && (
                    <span className="text-xs text-gray-400 ml-2">Analyzing with dual models...</span>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="relative p-6 border-t border-orange-600/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/5 to-transparent"></div>

            <div className="relative flex items-center space-x-3">
              <button
                className="p-3 text-gray-400 hover:text-orange-500 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-orange-600/50 rounded-xl transition-all"
                title="Voice input (coming soon)"
              >
                <Mic className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={dualOpinionEnabled ? "Ask for dual expert opinions..." : "Ask me anything about your health..."}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                disabled={isLoading}
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/50 hover:shadow-xl hover:shadow-orange-600/60"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {dualOpinionEnabled && (
              <div className="relative mt-3 flex items-center space-x-2 bg-gray-800/50 backdrop-blur border border-orange-600/20 rounded-lg px-3 py-2 text-xs text-gray-400">
                <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                <span>Dual Opinion mode: You'll receive two expert perspectives - Evidence-Based and Contextual</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
