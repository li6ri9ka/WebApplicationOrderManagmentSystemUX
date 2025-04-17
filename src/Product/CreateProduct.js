import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../ProductCss/CreateProduct.module.css';

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name_product: '',
        price: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:8082/api/product/newProduct", product)
            .then(() => {
                alert('Продукт успешно создан!');
                navigate('/products');
            })
            .catch((error) => {
                setError(error.response?.data?.message || 'Ошибка при создании продукта');
                console.error('Ошибка:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Добавить новый продукт</h1>

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
                        {loading ? 'Создание...' : 'Создать продукт'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;