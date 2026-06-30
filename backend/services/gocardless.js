// src/services/gocardless.js
import axios from 'axios';

const GOCARDLESS_API_URL = process.env.REACT_APP_GOCARDLESS_API_URL || 'https://api.gocardless.com';
const GOCARDLESS_ACCESS_TOKEN = process.env.REACT_APP_GOCARDLESS_ACCESS_TOKEN;
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true;

class GoCardlessService {
  constructor() {
    this.client = axios.create({
      baseURL: GOCARDLESS_API_URL,
      headers: {
        Authorization: `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'GoCardless-Version': '2015-07-06',
      },
    });
  }

  async createPaymentSession(plan, user, addons = []) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const sessionId = `session_${Date.now()}`;
          const redirectUrl = `${window.location.origin}/payment/success?session_id=${sessionId}`;

          // Store session in localStorage for mock
          localStorage.setItem(
            `payment_session_${sessionId}`,
            JSON.stringify({
              plan,
              user,
              addons,
              status: 'pending',
              createdAt: new Date().toISOString(),
            })
          );

          resolve({
            sessionId,
            redirectUrl,
            checkoutUrl: `https://pay.gocardless.com/flow/${sessionId}`,
          });
        }, 500);
      });
    }

    try {
      const response = await this.client.post('/payments', {
        payments: {
          amount: this.calculateAmount(plan, addons),
          currency: 'GBP',
          description: `${plan.name} Plan - Aleyo Website Builder`,
          metadata: {
            plan_id: plan.id,
            plan_name: plan.name,
            user_id: user.id,
            user_email: user.email,
            addons: addons.map((a) => a.name).join(','),
          },
        },
        links: {
          mandate: null, // Will be created during payment flow
        },
      });

      return {
        sessionId: response.data.payments.id,
        redirectUrl: response.data.payments.links?.confirmation_url,
        checkoutUrl: response.data.payments.links?.confirmation_url,
      };
    } catch (error) {
      console.error('GoCardless payment creation error:', error);
      throw error;
    }
  }

  calculateAmount(plan, addons) {
    const planAmount = plan.priceMonthly * 100; // Convert to pence
    const addonsAmount = addons.reduce((sum, addon) => sum + addon.price, 0) * 100;
    return planAmount + addonsAmount;
  }

  async getPaymentStatus(sessionId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const session = localStorage.getItem(`payment_session_${sessionId}`);
          if (session) {
            const data = JSON.parse(session);
            resolve({
              status: data.status,
              payment: {
                id: sessionId,
                amount: this.calculateAmount(data.plan, data.addons),
                status: data.status,
              },
            });
          } else {
            resolve({ status: 'not_found' });
          }
        }, 300);
      });
    }

    try {
      const response = await this.client.get(`/payments/${sessionId}`);
      return {
        status: response.data.payments.status,
        payment: response.data.payments,
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }

  async createMandate(customerDetails) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `mandate_${Date.now()}`,
            reference: `MD-${Date.now()}`,
            status: 'pending_submission',
          });
        }, 500);
      });
    }

    try {
      const response = await this.client.post('/mandates', {
        mandates: {
          scheme: 'bacs',
          metadata: {
            customer_id: customerDetails.id,
          },
          links: {
            customer_bank_account: customerDetails.bankAccountId,
          },
        },
      });
      return response.data.mandates;
    } catch (error) {
      console.error('Error creating mandate:', error);
      throw error;
    }
  }
}

export const gocardlessService = new GoCardlessService();
