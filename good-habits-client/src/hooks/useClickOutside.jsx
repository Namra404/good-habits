import { useEffect } from 'react';

const useClickOutside = (ref, callback) => {
    useEffect(() => {
        // Функция для обработки клика
        const handleClickOutside = (event) => {
            // Проверяем, что клик был вне переданного рефа
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        // Добавляем обработчик события
        document.addEventListener('mousedown', handleClickOutside);

        // Убираем обработчик при размонтировании компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]); // Перезапуск хука, если ref или callback изменятся
};

export default useClickOutside;