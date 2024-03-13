import React from "react";
import { useTheme } from '../../components/ThemeContext/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme(); // Destructure to get the current theme as well

    // Determine button text based on the current theme
    const buttonText = theme === 'dark' ? 'Світла тема' : 'Темна тема';

    return (
        <button className="custom-btn btn-7" onClick={toggleTheme}><span>{buttonText}</span></button>
    );
};

export default ThemeToggle;
