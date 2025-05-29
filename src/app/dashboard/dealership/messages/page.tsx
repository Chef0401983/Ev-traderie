'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  vehicle_id?: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    user_id: string;
    full_name: string;
    email: string;
    user_type: string;
  };
  recipient?: {
    user_id: string;
    full_name: string;
    email: string;
    user_type: string;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    title?: string;
  };
}

export default function DealershipMessagesPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/messages');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages');
      }
      
      setMessages(data.messages || []);
      if (data.info) {
        setInfo(data.info);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setShowReply(false);
    setReplyContent('');
    if (!message.is_read && message.recipient_id === user?.id) {
      markAsRead(message.id);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;
    
    try {
      setSendingReply(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: selectedMessage.sender_id,
          vehicle_id: selectedMessage.vehicle_id,
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent.trim(),
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setShowReply(false);
        fetchMessages(); // Refresh messages to show the new reply
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dealership Messages</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dealership Messages</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dealership Messages</h1>
        <button 
          onClick={fetchMessages}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>

      {info && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">{info}</p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500 mb-4">
            Customer inquiries about your vehicle inventory will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Customer Inquiries</h2>
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!message.is_read && message.recipient_id === user?.id ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm truncate">{message.subject}</h3>
                    {!message.is_read && message.recipient_id === user?.id && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {message.sender_id === user?.id ? (
                      <span>To: {message.recipient?.full_name || 'Unknown'}</span>
                    ) : (
                      <span>From: {message.sender?.full_name || 'Unknown'} 
                        {message.sender?.user_type === 'dealership' && (
                          <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Dealer</span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </div>
                  {message.vehicle && (
                    <div className="mt-2 text-xs text-primary">
                      Re: {message.vehicle.year} {message.vehicle.make} {message.vehicle.model}
                      {message.vehicle.title && ` - ${message.vehicle.title}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="border rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedMessage.sender_id === user?.id ? (
                      <span>To: {selectedMessage.recipient?.full_name || 'Unknown'} 
                        {selectedMessage.recipient?.user_type === 'dealership' && (
                          <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Dealer</span>
                        )}
                      </span>
                    ) : (
                      <span>From: {selectedMessage.sender?.full_name || 'Unknown'} 
                        {selectedMessage.sender?.user_type === 'dealership' && (
                          <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Dealer</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                
                {selectedMessage.vehicle && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-sm text-gray-700">Vehicle Inquiry</h3>
                    <p className="text-sm">
                      {selectedMessage.vehicle.year} {selectedMessage.vehicle.make} {selectedMessage.vehicle.model}
                      {selectedMessage.vehicle.title && ` - ${selectedMessage.vehicle.title}`}
                    </p>
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                
                {selectedMessage.sender_id !== user?.id && (
                  <button 
                    onClick={() => setShowReply(true)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Reply to Customer
                  </button>
                )}
                
                {showReply && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-medium mb-2">Reply to Customer</h3>
                    <textarea 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your response to the customer..."
                      className="w-full p-4 border rounded-lg"
                      rows={5}
                    />
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={handleReply}
                        disabled={sendingReply || !replyContent.trim()}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button 
                        onClick={() => setShowReply(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-6 text-center text-gray-500">
                Select a customer inquiry to view details and respond
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
