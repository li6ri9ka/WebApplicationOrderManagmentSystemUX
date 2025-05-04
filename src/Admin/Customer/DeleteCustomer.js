import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Ошибка парсинга токена', e);
        return null;
    }
}

const DeleteCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Если нет токена, редирект на страницу входа
            return;
        }

        const parsedToken = parseJwt(token);
        const role = parsedToken?.role?.toUpperCase();

        if (role !== 'ADMIN') {
            navigate('/'); // Если не админ, редирект на главную страницу
            return;
        }

        // Подтверждение удаления
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить клиента?');
        if (confirmDelete) {
            axios.delete(`http://localhost:8082/api/user/deleteUser/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    alert('Клиент удален');
                    navigate('/');
                })
                .catch(() => {
                    alert('Ошибка при удалении клиента');
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [id, navigate]);

    return null; // Компонент не рендерит ничего, если удаление не выполнено
};

export default DeleteCustomer;
