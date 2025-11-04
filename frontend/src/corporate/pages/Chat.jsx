import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import axiosInstance from '../../api/axiosInstance';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/corporate/chat');
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Mock messages
      setMessages([
        {
          _id: '1',
          sender: 'admin',
          senderName: 'Admin',
          message: 'Hi! How can I help you today?',
          timestamp: new Date(Date.now() - 3600000),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: 'corporate',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date(),
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage('');

    try {
      await axiosInstance.post('/corporate/chat', { message: messageToSend });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Admin Communication</h1>
          <p className="text-gray-600">Chat with admin for support and customization requests</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No messages yet. Start a conversation!</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-3 ${msg.sender === 'corporate' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender !== 'corporate' && (
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
                      <PersonIcon />
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-lg p-4 ${
                      msg.sender === 'corporate' ? 'bg-[#3B82F6] text-white' : 'bg-gray-100 text-[#0F172A]'
                    } ${msg.pending ? 'opacity-60' : ''}`}
                  >
                    <p className="font-medium mb-1">{msg.senderName}</p>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-2 ${msg.sender === 'corporate' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {msg.sender === 'corporate' && (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                      <PersonIcon />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2"
              >
                <SendIcon />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Chat;











