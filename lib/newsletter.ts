import { NewsletterSubscriber } from '@/types'

export interface NewsletterProvider {
  subscribe(subscriber: NewsletterSubscriber): Promise<{ success: boolean; message?: string }>
}

class ResendNewsletterProvider implements NewsletterProvider {
  private apiKey: string
  private listId: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ''
    this.listId = process.env.RESEND_AUDIENCE_ID || ''
  }

  async subscribe(subscriber: NewsletterSubscriber): Promise<{ success: boolean; message?: string }> {
    if (!this.apiKey || !this.listId) {
      return {
        success: false,
        message: 'Newsletter service not configured',
      }
    }

    try {
      const response = await fetch('https://api.resend.com/audiences/' + this.listId + '/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: subscriber.email,
          firstName: subscriber.name?.split(' ')[0] || '',
          lastName: subscriber.name?.split(' ').slice(1).join(' ') || '',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          message: error.message || 'Failed to subscribe',
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      }
    }
  }
}

class MailchimpNewsletterProvider implements NewsletterProvider {
  private apiKey: string
  private serverPrefix: string
  private listId: string

  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY || ''
    this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || ''
    this.listId = process.env.MAILCHIMP_LIST_ID || ''
  }

  async subscribe(subscriber: NewsletterSubscriber): Promise<{ success: boolean; message?: string }> {
    if (!this.apiKey || !this.serverPrefix || !this.listId) {
      return {
        success: false,
        message: 'Newsletter service not configured',
      }
    }

    try {
      const response = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: subscriber.email,
            status: 'subscribed',
            merge_fields: {
              FNAME: subscriber.name?.split(' ')[0] || '',
              LNAME: subscriber.name?.split(' ').slice(1).join(' ') || '',
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          message: error.title || 'Failed to subscribe',
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      }
    }
  }
}

export function getNewsletterProvider(): NewsletterProvider {
  const provider = process.env.NEWSLETTER_PROVIDER || 'resend'

  switch (provider) {
    case 'mailchimp':
      return new MailchimpNewsletterProvider()
    case 'resend':
    default:
      return new ResendNewsletterProvider()
  }
}



