import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/ProductCss/ProductList.module.css';
import { CartContext } from '../../Context/CartContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [currentUserRole, setCurrentUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Парсим роль из токена
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const parsedToken = JSON.parse(jsonPayload);
            setCurrentUserRole(parsedToken.role?.toUpperCase());
        } catch (e) {
            console.error('Ошибка парсинга токена', e);
            navigate('/login');
            return;
        }

        fetchProducts();
    }, [navigate]);

    const fetchProducts = () => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8082/api/product', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Ошибка загрузки продуктов');
                setLoading(false);
                console.error('Ошибка:', error);
            });
    };

    const handleAddToCart = (productId) => {
        if (currentUserRole !== 'ADMIN') {
            addToCart(productId);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8082/api/product/deleteProduct/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Ошибка удаления:', error);
            setError('Не удалось удалить товар');
        }
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.productList}>
            <h2 className={styles.title}>Продукты</h2>

            {currentUserRole === 'ADMIN' && (
                <div className={styles.topButtons}>
                    <button
                        className={styles.addButton}
                        onClick={() => navigate('/newProduct')}
                    >
                        ➕ Добавить продукт
                    </button>
                </div>
            )}

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
                                {currentUserRole === 'ADMIN' ? (
                                    <>
                                        <button
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => navigate(`/updateProduct/${product.id}`)}
                                            title="Редактировать"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(product.id)}
                                            title="Удалить"
                                        >
                                            ❌
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className={`${styles.actionButton} ${styles.addToCartButton}`}
                                        onClick={() => handleAddToCart(product.id)}
                                        title="В корзину"
                                        disabled={currentUserRole === 'ADMIN'}
                                    >
                                        ➕
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;