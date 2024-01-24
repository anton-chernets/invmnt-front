import React, { useState } from 'react';
import './ManageUsers.css'

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    const handleInputChange = (event) => {
        setNewUser({ ...newUser, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!newUser.name || !newUser.email) {
            // Добавьте проверку на пустые поля, если требуется
            return;
        }
        setUsers([...users, { ...newUser, id: Date.now() }]);
        setNewUser({ name: '', email: '' }); // Очистка формы
    };

    const handleDelete = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    // Опционально: функция для редактирования пользователя

    return (
        <div className="manage-users">
            <h1>Управление Пользователями</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Имя пользователя"
                    value={newUser.name}
                    onChange={handleInputChange}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                />
                <button type="submit">Добавить пользователя</button>
            </form>
            <div>
                {users.map((user) => (
                    <div key={user.id}>
                        <h3>{user.name} - {user.email}</h3>
                        <button onClick={() => handleDelete(user.id)}>Удалить</button>
                        {/* Кнопка редактирования */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;
