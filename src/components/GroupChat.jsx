import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../css/GroupChat.css';

const GroupChat = ({ groupId }) => {
    const location = useLocation();
    const { group } = location.state || {};
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const newId = localStorage.getItem('groupId');

    const baseURL = 'http://localhost:8000/';


    useEffect(() => {
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
            if (newId) {
                try {
                    const groupRef = doc(db, 'groups', newId);
                    const messagesRef = collection(groupRef, 'messages');
                    await addDoc(messagesRef, { text: newMessage, timestamp: new Date() });
                    setNewMessage('');
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            }
        }
    };

    return (
        <div className="group-chat-container">
            <div>
                {group? (
                    <>
                    <h1>{group.group_name} Group!!!</h1>
                    <p>Welcome to the chat for {group.group_name}!</p>
                    </>
                ): (
                    <p>No group yet</p>
                )}
            </div>
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