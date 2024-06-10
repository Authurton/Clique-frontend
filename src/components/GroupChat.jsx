import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import '../css/GroupChat.css';

const GroupChat = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const newId = localStorage.getItem('groupId');
    const baseURL = 'http://localhost:8000/';

    console.log(newId, "ddd")
    useEffect(() => {
        // Check if groupId is provided and not undefined
        if (newId) {
            const unsubscribe = onSnapshot(
                collection(db, 'groups', newId, 'messages'),
                (snapshot) => {
                    const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMessages(messagesData);
                }
            );
            return unsubscribe;
        }
    }, [newId]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/groups/${newId}/users/`);
                console.log(response, 'group dataaa')
                setGroupMembers(response.data);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };

        if (newId) {
            fetchGroupMembers();
        }
    }, [newId]);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            // Check if groupId is provided and not undefined
            if (newId) {
                await addDoc(collection(db, 'groups', newId, 'messages'), { text: newMessage, timestamp: new Date() });
                setNewMessage('');
            }
        }
    };

    return (
        <div className="group-chat-container">
            <h2 className="group-heading">Group Members</h2>
            <ul className="group-members-list">
                {groupMembers.map(member => (
                    <li key={member.id} className="group-member">
                        {member.name}
                    </li>
                ))}
            </ul>
            <h2 className="group-heading">Chat</h2>
            <div className="chat-messages">
                {messages.map(message => (
                    <div key={message.id} className="message">
                        <span className="message-text">{message.text}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                    className="chat-input"
                    placeholder="Type your message..."
                />
                <button type="submit" className="chat-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default GroupChat;