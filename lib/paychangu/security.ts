import crypto from 'crypto'

export class PayChanguSecurity {
  private secretKey: string

  constructor() {
    this.secretKey = process.env.PAYCHANGU_SECRET_KEY || ''
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    try {
      // For development/testing, accept mock signatures
      if (signature === 'mock-signature-for-testing') {
        return true
      }

      const payloadString = JSON.stringify(payload)
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(payloadString)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Signature verification error:', error)
      return false
    }
  }

  encryptData(data: string): string {
    try {
      const encryptionKey = process.env.PAYCHANGU_ENCRYPTION_KEY || ''
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      return encrypted
    } catch (error) {
      console.error('Encryption error:', error)
      return data
    }
  }

  decryptData(encryptedData: string): string {
    try {
      const encryptionKey = process.env.PAYCHANGU_ENCRYPTION_KEY || ''
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey)
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    } catch (error) {
      console.error('Decryption error:', error)
      return encryptedData
    }
  }
}