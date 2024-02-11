import React, { useState, useEffect } from 'react';
import './UserMessages.css';

const UserMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/messages'); // URL вашого API для повідомлень
            if (!response.ok) {
                throw new Error('Помилка при завантаженні повідомлень');
            }
            const data = await response.json();
            setMessages(data); // Оновлення списку повідомлень
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні повідомлення');
            }
            await fetchMessages(); // Оновлення списку повідомлень після видалення
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    return (
        <div className="user-messages">
            <h1>Повідомлення Користувачів</h1>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <p>{message.content}</p>
                        <button onClick={() => handleDeleteMessage(message.id)}>Видалити повідомлення</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserMessages;
