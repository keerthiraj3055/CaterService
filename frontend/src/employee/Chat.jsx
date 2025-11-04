import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Socket.IO event listeners
  React.useEffect(() => {
    socket.emit('join', { userId: user._id, role: 'employee' });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
      socket.emit('leave', { userId: user._id });
    };
  }, [user._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit('message', {
      userId: user._id,
      name: user.name,
      role: 'employee',
      text: message,
      timestamp: new Date(),
    });

    setMessage('');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Team Chat
      </Typography>

      <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Messages List */}
        <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((msg, i) => (
            <ListItem
              key={i}
              sx={{
                flexDirection: 'column',
                alignItems: msg.userId === user._id ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.userId === user._id ? '#3b82f6' : '#f1f5f9',
                  color: msg.userId === user._id ? 'white' : 'inherit',
                  borderRadius: 2,
                  p: 1,
                  maxWidth: '80%',
                }}
              >
                <Typography variant="caption" display="block" gutterBottom>
                  {msg.name} ({msg.role})
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={sendMessage}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!message.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;