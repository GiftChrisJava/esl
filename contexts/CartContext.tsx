// "use client";

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import type { Product, CartItem, Cart } from '@/lib/types';
// import { SecureStorage, calculateCartTotal, getCartItemCount } from '@/lib/utils';
// import { APP_CONFIG } from '@/lib/config';

// interface CartContextType {
//   cart: Cart;
//   addToCart: (productId: number, quantity?: number) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   isInCart: (productId: number) => boolean;
//   getCartItem: (productId: number) => CartItem | undefined;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// interface CartProviderProps {
//   children: ReactNode;
//   products: Product[]; // We need products to calculate totals
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children, products }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // Initialize cart from local storage
//   useEffect(() => {
//     const storedCart = SecureStorage.getItem<CartItem[]>(APP_CONFIG.storage.cart);
//     if (storedCart) {
//       setCartItems(storedCart);
//     }
//   }, []);

//   // Save cart to local storage whenever it changes
//   useEffect(() => {
//     SecureStorage.setItem(APP_CONFIG.storage.cart, cartItems);
//   }, [cartItems]);

//   // Calculate cart totals
//   const cart: Cart = {
//     items: cartItems,
//     totalItems: getCartItemCount(cartItems),
//     totalAmount: calculateCartTotal(cartItems, products),
//   };

//   const addToCart = (productId: number, quantity: number = 1) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.productId === productId);

//       if (existingItem) {
//         // Update existing item quantity
//         return prevItems.map(item =>
//           item.productId === productId
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // Add new item
//         return [...prevItems, { productId, quantity }];
//       }
//     });
//   };

//   const removeFromCart = (productId: number) => {
//     setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     if (quantity > APP_CONFIG.ui.maxCartItems) {
//       quantity = APP_CONFIG.ui.maxCartItems;
//     }

//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.productId === productId
//           ? { ...item, quantity }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const isInCart = (productId: number) => {
//     return cartItems.some(item => item.productId === productId);
//   };

//   const getCartItem = (productId: number) => {
//     return cartItems.find(item => item.productId === productId);
//   };

//   const contextValue: CartContextType = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     isInCart,
//     getCartItem,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };
