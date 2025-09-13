import { createClient } from './client'
import type { Database } from './types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']
type OrderStatus = Database['public']['Enums']['order_status']
type PaymentStatus = Database['public']['Enums']['payment_status']

export interface CreateOrderData {
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: any
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
  }>
  subtotal: number
  tax_amount?: number
  shipping_cost?: number
  total_amount: number
  notes?: string
}

export class OrdersService {
  private supabase = createClient()

  async createOrder(userId: string, orderData: CreateOrderData) {
    try {
      // Generate order number
      const { data: orderNumber, error: orderNumberError } = await this.supabase
        .rpc('generate_order_number')

      if (orderNumberError) {
        return { success: false, error: 'Failed to generate order number' }
      }

      // Create order
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId,
          customer_email: orderData.customer_email,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount || 0,
          shipping_cost: orderData.shipping_cost || 0,
          total_amount: orderData.total_amount,
          notes: orderData.notes,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        return { success: false, error: orderError.message }
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: '', // Will be filled by trigger or separate query
        product_sku: '', // Will be filled by trigger or separate query
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity
      }))

      // Get product details for order items
      for (let i = 0; i < orderItems.length; i++) {
        const { data: product } = await this.supabase
          .from('products')
          .select('name, sku')
          .eq('id', orderData.items[i].product_id)
          .single()

        if (product) {
          orderItems[i].product_name = product.name
          orderItems[i].product_sku = product.sku
        }
      }

      const { error: itemsError } = await this.supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        // Try to clean up the order
        await this.supabase.from('orders').delete().eq('id', order.id)
        return { success: false, error: 'Failed to create order items' }
      }

      return { success: true, data: order }
    } catch (error) {
      console.error('Create order error:', error)
      return { success: false, error: 'Failed to create order' }
    }
  }

  async getOrderById(orderId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          payments:payment_transactions(*)
        `)
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return { success: false, error: error.message, data: null }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get order error:', error)
      return { success: false, error: 'Failed to fetch order', data: null }
    }
  }

  async getUserOrders(userId: string, limit?: number) {
    try {
      let query = this.supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          payments:payment_transactions(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching user orders:', error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Get user orders error:', error)
      return { success: false, error: 'Failed to fetch orders', data: [] }
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    try {
      const updates: any = { status }
      
      if (paymentStatus) {
        updates.payment_status = paymentStatus
      }

      if (status === 'shipped') {
        updates.shipped_at = new Date().toISOString()
      }

      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString()
      }

      const { error } = await this.supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Update order status error:', error)
      return { success: false, error: 'Failed to update order status' }
    }
  }

  async getAllOrders(filters?: {
    status?: OrderStatus
    payment_status?: PaymentStatus
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          payments:payment_transactions(*),
          customer:profiles(full_name, email, phone_number)
        `)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.payment_status) {
        query = query.eq('payment_status', filters.payment_status)
      }

      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all orders:', error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Get all orders error:', error)
      return { success: false, error: 'Failed to fetch orders', data: [] }
    }
  }

  async getOrderStats(userId?: string) {
    try {
      let query = this.supabase
        .from('orders')
        .select('status, payment_status, total_amount, created_at')

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching order stats:', error)
        return { 
          success: false, 
          error: error.message, 
          data: {
            totalOrders: 0,
            totalRevenue: 0,
            completedOrders: 0,
            pendingOrders: 0,
            cancelledOrders: 0
          }
        }
      }

      const stats = {
        totalOrders: data.length,
        totalRevenue: data.reduce((sum, order) => sum + (order.total_amount || 0), 0),
        completedOrders: data.filter(order => order.status === 'delivered').length,
        pendingOrders: data.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status || '')).length,
        cancelledOrders: data.filter(order => ['cancelled', 'failed'].includes(order.status || '')).length
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Get order stats error:', error)
      return { 
        success: false, 
        error: 'Failed to fetch order stats',
        data: {
          totalOrders: 0,
          totalRevenue: 0,
          completedOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0
        }
      }
    }
  }
}

export const ordersService = new OrdersService()