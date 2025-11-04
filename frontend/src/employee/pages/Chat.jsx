import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Admin', text: 'Hi! Do you have any questions about your assigned event?', time: '10:30 AM' },
    { id: 2, sender: 'You', text: 'Yes, I need clarification on the event location.', time: '10:35 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          text: newMessage,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Chat</h1>
        <p className="text-gray-600">Communicate with admin and team members</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'You' && (
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                  <PersonIcon fontSize="small" />
                </div>
              )}
              <div
                className={`max-w-md rounded-lg p-4 ${
                  msg.sender === 'You'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 text-[#1E293B]'
                }`}
              >
                <p className="font-medium mb-1">{msg.sender}</p>
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
              {msg.sender === 'You' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  <PersonIcon fontSize="small" />
                </div>
              )}
            </div>
          ))}
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1e51d3] transition-colors flex items-center gap-2"
            >
              <SendIcon fontSize="small" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


