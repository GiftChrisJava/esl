export interface PaymentData {
  amount: number
  currency: string
  reference: string
  description: string
  callback_url: string
  return_url: string
  cancel_url: string
  customer: {
    email: string
    phone?: string
    name?: string
  }
}

export interface PaymentResponse {
  success: boolean
  payment_url: string
  reference: string
  message?: string
}

export class PayChanguClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.PAYCHANGU_API_KEY || ''
    this.baseUrl = process.env.PAYCHANGU_BASE_URL || 'https://api.paychangu.com'
  }

  async initiatePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      // For development, return mock payment URL
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          payment_url: `/mock-payment?tx_ref=${data.reference}&amount=${data.amount}`,
          reference: data.reference,
          message: 'Mock payment initiated'
        }
      }

      const response = await fetch(`${this.baseUrl}/api/payment/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Payment initialization failed')
      }

      return {
        success: true,
        payment_url: result.data.payment_url,
        reference: result.data.reference,
      }
    } catch (error) {
      console.error('PayChangu payment initiation error:', error)
      return {
        success: false,
        payment_url: '',
        reference: data.reference,
        message: error instanceof Error ? error.message : 'Payment failed'
      }
    }
  }

  async verifyPayment(reference: string) {
    try {
      // For development, return mock verification
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          status: 'successful',
          reference,
          message: 'Mock payment verified'
        }
      }

      const response = await fetch(`${this.baseUrl}/api/payment/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed')
      }

      return result
    } catch (error) {
      console.error('PayChangu payment verification error:', error)
      return {
        success: false,
        status: 'failed',
        reference,
        message: error instanceof Error ? error.message : 'Verification failed'
      }
    }
  }
}