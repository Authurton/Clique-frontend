import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ChatComponent = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `groups/${groupId}/messages`),
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);
      }
    );
    return unsubscribe;
  }, [groupId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      try {
        await addDoc(collection(db, `groups/${groupId}/messages`), {
          text: newMessage,
          timestamp: new Date().toISOString(),
          // Add additional fields like senderId, senderName, etc. as needed
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
