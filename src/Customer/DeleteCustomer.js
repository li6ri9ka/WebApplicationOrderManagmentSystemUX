import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {useEffect} from "react";

const DeleteCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить клиента?');
        if (confirmDelete) {
            axios.delete(`http://localhost:8082/api/customers/delete/${id}`)
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

    return null;
};

export default DeleteCustomer;
