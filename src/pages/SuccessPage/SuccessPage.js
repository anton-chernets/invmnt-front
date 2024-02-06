import React from 'react';
import './SuccessPage.css';

const SuccessPage = () => {
    return (
        <div className="success-page">
            <h1>Дякуємо за ваше замовлення!</h1>
            <p>Ваше замовлення було успішно оформлено та буде оброблено найближчим часом.</p>
            <p>Номер вашого замовлення: #123456</p> {/* Можете додати динамічний номер замовлення */}
            {/* Тут можна додати кнопки або посилання для подальших дій користувача */}
        </div>
    );
};

export default SuccessPage;
