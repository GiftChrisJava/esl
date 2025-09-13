import { createClient } from './server'
import type { Database } from './types'

type OrderStatus = Database['public']['Enums']['order_status']
type PaymentStatus = Database['public']['Enums']['payment_status']

export class ServerOrdersService {
  async updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    try {
      const supabase = await createClient()
      
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

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        return false
      }

      console.log(`Order ${orderId} updated to status: ${status}`)
      return true
    } catch (error) {
      console.error('Server order update error:', error)
      return false
    }
  }

  async getOrderById(orderId: string) {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
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
        return null
      }

      return data
    } catch (error) {
      console.error('Server get order error:', error)
      return null
    }
  }
}

export const serverOrdersService = new ServerOrdersService()