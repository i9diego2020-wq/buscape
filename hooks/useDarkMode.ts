import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark((prev) => !prev);
    };

    return { isDark, toggleDarkMode };
};

export default useDarkMode;
