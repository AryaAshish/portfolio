export interface PaymentProvider {
  createCheckoutSession(params: {
    priceId: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<{ sessionId: string; url: string } | null>
}

class StripePaymentProvider implements PaymentProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.STRIPE_SECRET_KEY || ''
  }

  async createCheckoutSession(params: {
    priceId: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<{ sessionId: string; url: string } | null> {
    if (!this.apiKey) {
      return null
    }

    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'payment',
          'payment_method_types[]': 'card',
          'line_items[0][price]': params.priceId,
          'line_items[0][quantity]': '1',
          'success_url': params.successUrl,
          'cancel_url': params.cancelUrl,
          ...(params.metadata && {
            'metadata[course_id]': params.metadata.course_id || '',
          }),
        }),
      })

      if (!response.ok) {
        return null
      }

      const session = await response.json()
      return {
        sessionId: session.id,
        url: session.url,
      }
    } catch (error) {
      return null
    }
  }
}

export function getPaymentProvider(): PaymentProvider | null {
  const provider = process.env.PAYMENT_PROVIDER || 'stripe'

  if (provider === 'stripe' && process.env.STRIPE_SECRET_KEY) {
    return new StripePaymentProvider()
  }

  return null
}



