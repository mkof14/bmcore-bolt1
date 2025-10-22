import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Mic, Volume2, User, Bot, Trash2, Plus, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  persona: string;
  created_at: string;
}

export default function AIHealthAdvisorSection() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<'doctor' | 'nurse' | 'coach'>('doctor');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.user.id,
          title: `New Chat ${new Date().toLocaleDateString()}`,
          persona: persona,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setConversations([data, ...conversations]);
        setCurrentConversation(data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentConversation) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { error: userMsgError } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: currentConversation.id,
          role: 'user',
          content: input,
        });

      if (userMsgError) throw userMsgError;

      const aiResponse = `As your AI Health ${persona}, I understand you're asking about "${input}". This is a simulated response. In production, this would connect to a real AI API like OpenAI GPT-4 or Claude to provide personalized health guidance based on your profile and medical history.`;

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const { error: aiMsgError } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: currentConversation.id,
          role: 'assistant',
          content: aiResponse,
        });

      if (aiMsgError) throw aiMsgError;

      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;

    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConversations(conversations.filter(c => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const getPersonaColor = (p: string) => {
    switch (p) {
      case 'doctor': return 'from-blue-600 to-blue-500';
      case 'nurse': return 'from-green-600 to-green-500';
      case 'coach': return 'from-orange-600 to-orange-500';
      default: return 'from-gray-600 to-gray-500';
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4">
      <div className="w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            Chats
          </h2>
          <button
            onClick={createNewConversation}
            className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            title="New Chat"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2">AI Persona</label>
          <div className="grid grid-cols-3 gap-2">
            {(['doctor', 'nurse', 'coach'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  persona === p
                    ? `bg-gradient-to-r ${getPersonaColor(p)} text-white`
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                currentConversation?.id === conv.id
                  ? 'bg-orange-900/30 border border-orange-600/30'
                  : 'bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0" onClick={() => setCurrentConversation(conv)}>
                  <p className="text-sm font-medium text-white truncate">{conv.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getPersonaColor(conv.persona)} text-white text-xs rounded-full`}>
                      {conv.persona}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl flex flex-col">
        {currentConversation ? (
          <>
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-gradient-to-r ${getPersonaColor(currentConversation.persona)} rounded-lg`}>
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{currentConversation.title}</h3>
                  <p className="text-xs text-gray-400">AI Health {currentConversation.persona}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Voice input feature coming soon!')}
                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => alert('Text-to-speech feature coming soon!')}
                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Text to Speech"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const chatText = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
                    const blob = new Blob([chatText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `chat-${currentConversation.id}.txt`;
                    a.click();
                  }}
                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Export Chat"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Start a conversation with your AI Health Advisor</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Ask about symptoms, medications, lifestyle advice, or health goals
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-orange-900/30 border border-orange-600/30'
                      : `bg-gradient-to-r ${getPersonaColor(currentConversation.persona)}`
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-orange-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block p-4 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-orange-900/30 border border-orange-600/30 text-white'
                          : 'bg-gray-800/50 border border-gray-700/30 text-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getPersonaColor(currentConversation.persona)}`}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-xl bg-gray-800/50 border border-gray-700/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask your AI health advisor..."
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI responses are simulated. Not medical advice. Consult healthcare professionals for medical decisions.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-20 w-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Health Advisor</h3>
              <p className="text-gray-400 mb-4">Select a conversation or create a new one to start</p>
              <button
                onClick={createNewConversation}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
