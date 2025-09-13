"use client";

import { cartService, type CartItemWithProduct } from '@/lib/supabase/cart'
import { useAuth } from './AuthContext'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface CartContextType {
  items: CartItemWithProduct[]
  totalItems: number
  totalAmount: number
  isLoading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; error?: string }>
  removeFromCart: (productId: string) => Promise<{ success: boolean; error?: string }>
  clearCart: () => Promise<{ success: boolean; error?: string }>
  refreshCart: () => Promise<void>
  isInCart: (productId: string) => boolean
  getCartItem: (productId: string) => CartItemWithProduct | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart()
    } else {
      setItems([])
    }
  }, [isAuthenticated, user])

  const refreshCart = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await cartService.getCartItems(user.id)
      if (result.success) {
        setItems(result.data)
      }
    } catch (error) {
      console.error('Error refreshing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      return { success: false, error: 'Please sign in to add items to cart' }
    }

    setIsLoading(true)
    try {
      const result = await cartService.addToCart(user.id, productId, quantity)
      if (result.success) {
        await refreshCart()
      }
      return result
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: 'Failed to add item to cart' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      return { success: false, error: 'Please sign in to update cart' }
    }

    setIsLoading(true)
    try {
      const result = await cartService.updateCartItem(user.id, productId, quantity)
      if (result.success) {
        await refreshCart()
      }
      return result
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error: 'Failed to update cart item' }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) {
      return { success: false, error: 'Please sign in to remove items from cart' }
    }

    setIsLoading(true)
    try {
      const result = await cartService.removeFromCart(user.id, productId)
      if (result.success) {
        await refreshCart()
      }
      return result
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error: 'Failed to remove item from cart' }
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) {
      return { success: false, error: 'Please sign in to clear cart' }
    }

    setIsLoading(true)
    try {
      const result = await cartService.clearCart(user.id)
      if (result.success) {
        setItems([])
      }
      return result
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error: 'Failed to clear cart' }
    } finally {
      setIsLoading(false)
    }
  }

  const isInCart = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  const getCartItem = (productId: string) => {
    return items.find(item => item.product_id === productId)
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
    getCartItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}