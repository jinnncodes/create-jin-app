import { onRequest } from 'firebase-functions/v2/https'
import Stripe from 'stripe'

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey)
}

export type TaxableLine = {
  amount: number
  taxCode?: string
  quantity?: number
}

export type TaxEstimate = {
  subtotal: number
  tax: number
  total: number
  currency: string
}

/**
 * Generic tax estimate helper.
 * Replace the rate source with Stripe Tax or your jurisdiction table
 * before using this in production.
 */
export function estimateTax(
  lines: TaxableLine[],
  currency = 'usd',
  taxRate = 0
): TaxEstimate {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.amount * (line.quantity ?? 1),
    0
  )
  const tax = Math.round(subtotal * taxRate)
  return { subtotal, tax, total: subtotal + tax, currency }
}

export const stripeWebhook = onRequest(
  { cors: false, invoker: 'public' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed')
      return
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' })
      return
    }

    const signature = req.headers['stripe-signature']
    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: 'Missing Stripe-Signature header' })
      return
    }

    let event: Stripe.Event
    try {
      const stripe = getStripe()
      const rawBody = req.rawBody
      if (!rawBody) {
        res.status(400).json({ error: 'Missing raw request body' })
        return
      }
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
      res.status(400).json({ error: 'Invalid Stripe webhook signature' })
      return
    }

    switch (event.type) {
      case 'checkout.session.completed':
      case 'invoice.paid':
      case 'customer.subscription.updated':
        break
      default:
        break
    }

    res.status(200).json({ received: true, type: event.type })
  }
)
