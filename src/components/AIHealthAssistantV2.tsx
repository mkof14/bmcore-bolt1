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
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
      <div className="w-full max-w-4xl h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Health Advisor</h3>
                <p className="text-white/80 text-xs">Multi-Persona Doctor with Dual Opinion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-white/80" />
              <span className="text-white/90 text-xs">Wellness guidance • Not medical diagnosis</span>
            </div>

            <button
              onClick={() => setDualOpinionEnabled(!dualOpinionEnabled)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
                dualOpinionEnabled
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span className="text-sm font-semibold">Second Opinion</span>
              {dualOpinionEnabled && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">ON</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => {
            if (message.type === 'dual-opinion') {
              return (
                <div key={message.id} className="w-full">
                  <div className="mb-2 flex items-center space-x-2">
                    <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                  <div className="max-w-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
                    <p className="text-sm text-blue-800 dark:text-blue-200 text-center">{message.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                } rounded-2xl px-4 py-3`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                {dualOpinionEnabled && (
                  <span className="text-xs text-gray-500 ml-2">Analyzing with dual models...</span>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {dualOpinionEnabled && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <AlertCircle className="h-3 w-3" />
              <span>Dual Opinion mode: You'll receive two expert perspectives - Evidence-Based and Contextual</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
