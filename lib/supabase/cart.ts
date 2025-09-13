import { createClient } from './client'
import type { Database } from './types'

type CartItem = Database['public']['Tables']['cart_items']['Row']

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: any
    stock_quantity: number
    is_active: boolean
  }
}

export class CartService {
  private supabase = createClient()

  async getCartItems(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            id,
            name,
            slug,
            price,
            images,
            stock_quantity,
            is_active
          )
        `)
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching cart items:', error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data as CartItemWithProduct[] || [] }
    } catch (error) {
      console.error('Cart service error:', error)
      return { success: false, error: 'Failed to fetch cart items', data: [] }
    }
  }

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await this.supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await this.supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) {
          return { success: false, error: error.message }
        }
      } else {
        // Add new item
        const { error } = await this.supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity
          })

        if (error) {
          return { success: false, error: error.message }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Add to cart error:', error)
      return { success: false, error: 'Failed to add item to cart' }
    }
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(userId, productId)
      }

      const { error } = await this.supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Update cart item error:', error)
      return { success: false, error: 'Failed to update cart item' }
    }
  }

  async removeFromCart(userId: string, productId: string) {
    try {
      const { error } = await this.supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Remove from cart error:', error)
      return { success: false, error: 'Failed to remove item from cart' }
    }
  }

  async clearCart(userId: string) {
    try {
      const { error } = await this.supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Clear cart error:', error)
      return { success: false, error: 'Failed to clear cart' }
    }
  }

  async getCartTotal(userId: string) {
    try {
      const { data, error } = await this.supabase
        .rpc('calculate_cart_total', { user_uuid: userId })

      if (error) {
        console.error('Error calculating cart total:', error)
        return { success: false, error: error.message, total: 0 }
      }

      return { success: true, total: data || 0 }
    } catch (error) {
      console.error('Cart total error:', error)
      return { success: false, error: 'Failed to calculate cart total', total: 0 }
    }
  }
}

export const cartService = new CartService()