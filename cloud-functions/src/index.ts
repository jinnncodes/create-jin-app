import { initializeApp } from 'firebase-admin/app'

initializeApp()

export { hello, onUserCreated } from './example/index.js'
export { stripeWebhook, estimateTax } from './billingTax.js'
export { exportUserData } from './dataExport.js'
