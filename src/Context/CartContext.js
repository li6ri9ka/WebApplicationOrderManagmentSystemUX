import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productsCache, setProductsCache] = useState({});

    // Функция для парсинга JWT токена
    const parseJwt = (token) => {
        try {
            if (!token) return null;
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
    };

    // Проверка авторизации
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в систему');
            return false;
        }

        const decoded = parseJwt(token);
        if (!decoded) {
            localStorage.removeItem('token');
            alert('Сессия истекла, войдите снова');
            return false;
        }

        setUserRole(decoded.role || null);
        return true;
    };

    // Загрузка корзины из localStorage
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error("Ошибка загрузки корзины:", error);
            }
        };
        loadCart();
    }, []);

    // Сохранение корзины в localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Альтернативный метод получения данных о товаре
    const fetchProductData = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            // Пробуем разные варианты endpoints
            const endpoints = [
                'http://localhost:8082/api/product'
            ];

            let productData;

            for (const endpoint of endpoints) {
                try {
                    const response = await axios.get(endpoint, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data && Array.isArray(response.data)) {
                        // Ищем товар, учитывая что ID может быть строкой или числом
                        const product = response.data.find(p =>
                            p.id == productId ||
                            p.productId == productId ||
                            p.id_product == productId
                        );

                        if (product) {
                            productData = product;
                            break;
                        }
                    }
                } catch (e) {
                    console.log(`Ошибка запроса к ${endpoint}`, e);
                    continue;
                }
            }

            if (!productData) {
                throw new Error('Товар не найден в ответе API');
            }

            // Нормализация данных товара
            return {
                id: productData.id || productData.productId || productData.id_product || productId,
                name: productData.name_product || productData.name || productData.productName || `Товар ${productId}`,
                price: Number(productData.price) || Number(productData.productPrice) || 0,
                image: productData.image || productData.imageUrl || null
            };
        } catch (error) {
            console.error("Ошибка получения данных товара:", error);
            return {
                id: productId,
                name: `Товар ${productId}`,
                price: 0,
                image: null
            };
        }
    };

    // Основной метод добавления в корзину
    const addToCart = async (product) => {
        if (!checkAuth()) return false;

        setIsLoading(true);
        try {
            let productToAdd;

            if (typeof product === 'string' || typeof product === 'number') {
                if (productsCache[product]) {
                    productToAdd = productsCache[product];
                } else {
                    productToAdd = await fetchProductData(product);
                    setProductsCache(prev => ({
                        ...prev,
                        [product]: productToAdd
                    }));
                }
            } else {
                // Нормализация данных при прямом добавлении объекта
                productToAdd = {
                    id: product.id || product.productId || product.id_product,
                    name: product.name_product || product.name || product.productName || `Товар ${product.id}`,
                    price: Number(product.price) || Number(product.productPrice) || 0,
                    image: product.image || product.imageUrl || null
                };
            }

            // Используем нестрогое сравнение для ID
            setCartItems(prev => {
                const existingItem = prev.find(item => item.id == productToAdd.id);
                if (existingItem) {
                    return prev.map(item =>
                        item.id == productToAdd.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { ...productToAdd, quantity: 1 }];
            });

            return true;
        } catch (error) {
            console.error("Ошибка добавления в корзину:", error);
            const productId = typeof product === 'object' ? (product.id || product.productId) : product;
            const fallbackProduct = {
                id: productId,
                name: `Товар ${productId}`,
                price: 0,
                quantity: 1,
                image: null
            };

            setCartItems(prev => {
                const existingItem = prev.find(item => item.id == productId);
                if (existingItem) {
                    return prev.map(item =>
                        item.id == productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, fallbackProduct];
            });

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Обновление количества
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );
    };

    // Удаление из корзины
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // Очистка корзины
    const clearCart = () => {
        setCartItems([]);
    };

    // Расчет общей суммы
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            userRole,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};