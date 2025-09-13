import { createClient } from './client'
import type { Database } from './types'

type Product = Database['public']['Tables']['products']['Row']
type ProductCategory = Database['public']['Tables']['product_categories']['Row']

export class ProductsService {
  private supabase = createClient()

  async getProducts(filters?: {
    category?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq('is_active', true)

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Products service error:', error)
      return { success: false, error: 'Failed to fetch products', data: [] }
    }
  }

  async getProductBySlug(slug: string) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return { success: false, error: error.message, data: null }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Product service error:', error)
      return { success: false, error: 'Failed to fetch product', data: null }
    }
  }

  async getProductById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return { success: false, error: error.message, data: null }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Product service error:', error)
      return { success: false, error: 'Failed to fetch product', data: null }
    }
  }

  async getCategories() {
    try {
      const { data, error } = await this.supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Categories service error:', error)
      return { success: false, error: 'Failed to fetch categories', data: [] }
    }
  }

  async getFeaturedProducts(limit: number = 6) {
    return this.getProducts({ featured: true, limit })
  }

  async searchProducts(query: string, limit: number = 20) {
    return this.getProducts({ search: query, limit })
  }

  async getProductsByCategory(categoryId: string, limit?: number) {
    return this.getProducts({ category: categoryId, limit })
  }
}

export const productsService = new ProductsService()