import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../ProductCss/UpdateProduct.module.css';

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        name_product: '',
        price: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8082/api/product/updateProduct/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response?.data?.message || 'Не удалось загрузить данные продукта');
                setLoading(false);
                console.error('Ошибка загрузки:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.put(`http://localhost:8082/api/product/updateProduct/${id}`, product)
            .then(() => {
                alert('Продукт успешно обновлен!');
                navigate('/products');
            })
            .catch((error) => {
                setError(error.response?.data?.message || 'Не удалось обновить продукт');
                console.error('Ошибка обновления:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Редактировать продукт</h1>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Название продукта</label>
                    <input
                        type="text"
                        name="name_product"
                        value={product.name_product}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Цена (₽)</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className={styles.input}
                        min="0"
                        step="0.01"
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Количество</label>
                    <input
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        className={styles.input}
                        min="0"
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate('/products')}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Обновление...' : 'Обновить продукт'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;