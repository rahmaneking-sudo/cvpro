import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, Send, User, Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminChatPanel({ adminToken }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Polling for sessions
  useEffect(() => {
    let intervalId;
    const fetchSessions = async () => {
      try {
        const res = await axios.get('/api/admin/chats', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error('Fetch sessions error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminToken) {
      fetchSessions();
      intervalId = setInterval(fetchSessions, 5000);
    }
    return () => clearInterval(intervalId);
  }, [adminToken]);

  // Polling for active session messages
  useEffect(() => {
    let intervalId;
    const fetchMessages = async () => {
      if (!activeSession) return;
      try {
        const res = await axios.get(`/api/admin/chats/${activeSession.id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.data.success) {
          setMessages(res.data.session.messages);
        }
      } catch (err) {
        console.error('Fetch messages error:', err);
      }
    };

    if (activeSession) {
      fetchMessages();
      intervalId = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(intervalId);
  }, [activeSession, adminToken]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || isSending || !activeSession) return;

    const content = reply.trim();
    setReply('');
    setIsSending(true);

    try {
      const res = await axios.post(`/api/admin/chats/${activeSession.id}/reply`, { content }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
      }
    } catch (err) {
      console.error('Admin reply error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseSession = async (sessionId) => {
    try {
      await axios.put(`/api/admin/chats/${sessionId}/close`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'closed' } : s));
      if (activeSession?.id === sessionId) {
        setActiveSession({ ...activeSession, status: 'closed' });
      }
    } catch (err) {
      console.error('Close session error:', err);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--color-champagne)]" size={32} /></div>;
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[600px]">
      {/* Sessions List */}
      <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col bg-[var(--color-obsidian)]">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="text-lg font-bold text-[var(--color-ivory)] flex items-center gap-2">
            <MessageCircle size={20} className="text-[var(--color-champagne)]" /> Tickets Support
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-white-muted)] text-sm">
              Aucune demande de support pour le moment.
            </div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session)}
                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${activeSession?.id === session.id ? 'bg-[var(--color-champagne)]/10 border-l-4 border-l-[var(--color-champagne)]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-white text-sm flex items-center gap-2">
                    <User size={14} /> {session.user?.name || 'Utilisateur'}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${session.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    {session.status === 'open' ? 'Actif' : 'Fermé'}
                  </span>
                </div>
                <div className="text-xs text-[var(--color-white-muted)] truncate mb-2">
                  {session.messages?.[0]?.content || 'Nouvelle conversation'}
                </div>
                <div className="text-[10px] text-white/40 flex items-center gap-1">
                  <Clock size={10} /> Mis à jour: {new Date(session.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Session Chat */}
      <div className="w-full md:w-2/3 flex flex-col bg-[var(--color-charcoal)] relative">
        {activeSession ? (
          <>
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">{activeSession.user?.name || 'Utilisateur anonyme'}</h4>
                <p className="text-xs text-[var(--color-white-muted)]">{activeSession.user?.email}</p>
              </div>
              {activeSession.status === 'open' && (
                <button 
                  onClick={() => handleCloseSession(activeSession.id)}
                  className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle size={14} /> Clôturer
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'admin' 
                      ? 'bg-[var(--color-champagne)] text-black rounded-br-sm' 
                      : 'bg-white/10 text-white rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[var(--color-white-muted)] mt-1 px-1">
                    {msg.sender === 'admin' ? 'Vous' : 'Client'} • {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {activeSession.status === 'open' ? (
              <div className="p-4 bg-black/20 border-t border-white/10">
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Répondre au client..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={!reply.trim() || isSending}
                    className="bg-[var(--color-champagne)] text-black rounded-xl px-6 font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-[var(--color-gold-light)] transition-colors"
                  >
                    <Send size={16} /> Envoyer
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-black/20 border-t border-white/10 text-center text-[var(--color-white-muted)] text-sm">
                Cette conversation a été clôturée.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-white-muted)]">
            <MessageCircle size={48} className="opacity-20 mb-4" />
            <p>Sélectionnez une conversation pour afficher les messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
