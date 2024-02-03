import React, { useState, useEffect } from 'react';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Для редагування користувача

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users'); // URL вашого API
            if (!response.ok) {
                throw new Error('Помилка при завантаженні користувачів');
            }
            const data = await response.json();
            setUsers(data); // Оновлення списку користувачів
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const method = selectedUser.id ? 'PUT' : 'POST';
            const response = await fetch(`/api/users/${selectedUser.id || ''}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });

            if (!response.ok) {
                throw new Error('Помилка при обробці користувача');
            }
            await fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user); // Встановлюємо вибраного користувача для редагування
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні користувача');
            }
            await fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="manage-users">
            <h1>Управління Користувачами</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Ім'я"
                    value={selectedUser ? selectedUser.name : ''}
                    onChange={handleInputChange}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={selectedUser ? selectedUser.email : ''}
                    onChange={handleInputChange}
                />
                <button type="submit"
                        className="button-user">{selectedUser && selectedUser.id ? 'Оновити' : 'Додати користувача'}</button>

            </form>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleEditUser(user)} className="button-user">Редагувати</button>
                        <button onClick={() => handleDeleteUser(user.id)} className="button-user">Видалити</button>
                    </li>
                ))}
            </ul>
            <h2>Список Користувачів</h2>
            <ul className="user-list">
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        <div className="user-details">
                            <p><b>Ім'я:</b> {user.name}</p>
                            <p><b>Email:</b> {user.email}</p>
                            {/* Додайте інші деталі, якщо необхідно */}
                        </div>
                        <div className="user-actions">
                            <button onClick={() => handleEditUser(user)} className="button-edit">Редагувати</button>
                            <button onClick={() => handleDeleteUser(user.id)} className="button-delete">Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageUsers;
