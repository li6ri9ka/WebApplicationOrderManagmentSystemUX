import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../ProductCss/ProductList.module.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8082/api/product')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Ошибка загрузки продуктов');
                setLoading(false);
                console.error('Error:', error);
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить продукт?');
        if (!confirmDelete) return;

        axios.delete(`http://localhost:8082/api/product/deleteProduct/${id}`)
            .then(() => {
                setProducts(products.filter(p => p.id !== id));
            })
            .catch((error) => {
                alert('Не удалось удалить продукт');
                console.error('Ошибка удаления:', error);
            });
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.productList}>
            <h2 className={styles.title}>Продукты</h2>

            <div className={styles.topButtons}>
                <button
                    className={styles.addButton}
                    onClick={() => navigate('/newProduct')}
                >
                    ➕ Добавить продукт
                </button>
            </div>

            <ul className={styles.productUl}>
                {products.map(product => (
                    <li key={product.id} className={styles.productItem}>
                        <div className={styles.productInfo}>
                            <div className={styles.productDetails}>
                                <strong>{product.id}. {product.name_product}</strong>
                                <div className={styles.productMeta}>
                                    <span>Цена: {product.price} ₽</span>
                                    <span>Количество: {product.quantity}</span>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => navigate(`/updateProduct/${product.id}`)}
                                    title="Редактировать продукт"
                                >
                                    ✏️
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(product.id)}
                                    title="Удалить продукт"
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;