import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GroupChat = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const baseURL = 'http://localhost:8000/';

    useEffect(() => {
        // Check if groupId is provided and not undefined
        if (groupId) {
            const unsubscribe = onSnapshot(
                collection(db, 'groups', groupId, 'messages'),
                (snapshot) => {
                    const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMessages(messagesData);
                }
            );
            return unsubscribe;
        }
    }, [groupId]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/groups/${groupId}/users/`);
                setGroupMembers(response.data);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            // Check if groupId is provided and not undefined
            if (groupId) {
                await addDoc(collection(db, 'groups', groupId, 'messages'), { text: newMessage, timestamp: new Date() });
                setNewMessage('');
            }
        }
    };

    return (
        <div>
            <h2>Group Members</h2>
            <ul>
                {groupMembers.map(member => (
                    <li key={member.id}>{member.name}</li>
                ))}
            </ul>
            <h2>Chat</h2>
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

export default GroupChat;