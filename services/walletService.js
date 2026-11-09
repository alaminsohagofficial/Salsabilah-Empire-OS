```javascript
/**
 * Repository: Salsabilah-Empire-OS
 * File Path: services/walletService.js
 * Purpose: bKash Tokenized Checkout & Nagad PGW Integration Service
 * Organization: Salsabilah Amin Limited | Retail: S.R. Electronics Park
 */

const crypto = require('crypto');
const axios = require('axios');

class WalletService {
  constructor() {
    this.config = {
      bkash: {
        appKey: process.env.BKASH_APP_KEY || 'bkash_sandbox_app_key',
        appSecret: process.env.BKASH_APP_SECRET || 'bkash_sandbox_app_secret',
        username: process.env.BKASH_USERNAME || '01719732134',
        password: process.env.BKASH_PASSWORD || 'bkash_secret_password',
        baseURL: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
        callbackURL: process.env.BKASH_CALLBACK_URL || 'http://localhost:3000/api/pos/wallet/bkash/callback'
      },
      nagad: {
        merchantID: process.env.NAGAD_MERCHANT_ID || 'NAGAD_SR_ELEC_01',
        merchantPrivateKey: process.env.NAGAD_PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----\n...',
        nagadPublicKey: process.env.NAGAD_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\n...',
        baseURL: process.env.NAGAD_BASE_URL || 'https://api.mynagad.com/api/dfs',
        callbackURL: process.env.NAGAD_CALLBACK_URL || 'http://localhost:3000/api/pos/wallet/nagad/callback'
      },
      showroom: {
        outlet: 'S.R. Electronics Park — Hatboalia Bazar',
        dealerCodes: ['DEAL002905', '3000002272']
      }
    };
    this.bkashToken = null;
    this.tokenExpiry = null;
  }

  // =========================================================================
  // 1. bKash Tokenized Handshake & Execution
  // =========================================================================

  async getBkashToken() {
    if (this.bkashToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.bkashToken;
    }
    const res = await axios.post(
      `${this.config.bkash.baseURL}/tokenized/checkout/token/grant`,
      {
        app_key: this.config.bkash.appKey,
        app_secret: this.config.bkash.appSecret
      },
      {
        headers: {
          username: this.config.bkash.username,
          password: this.config.bkash.password
        }
      }
    );
    this.bkashToken = res.data.id_token;
    this.tokenExpiry = Date.now() + (res.data.expires_in - 300) * 1000;
    return this.bkashToken;
  }

  async createBkashOrder(order) {
    const token = await this.getBkashToken();
    const res = await axios.post(
      `${this.config.bkash.baseURL}/tokenized/checkout/create`,
      {
        mode: '0011',
        payerReference: order.customerPhone || '01719732134',
        callbackURL: this.config.bkash.callbackURL,
        amount: parseFloat(order.totalAmount).toFixed(2),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: order.invoiceId
      },
      {
        headers: {
          Authorization: token,
          'X-APP-Key': this.config.bkash.appKey
        }
      }
    );
    return res.data;
  }

  async executeBkashOrder(paymentID) {
    const token = await this.getBkashToken();
    const res = await axios.post(
      `${this.config.bkash.baseURL}/tokenized/checkout/execute`,
      { paymentID },
      {
        headers: {
          Authorization: token,
          'X-APP-Key': this.config.bkash.appKey
        }
      }
    );
    return res.data;
  }

  // =========================================================================
  // 2. Nagad PGW Handshake & Cryptography
  // =========================================================================

  async initNagadOrder(order) {
    const datetime = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = order.invoiceId;

    const sensitiveData = {
      merchantId: this.config.nagad.merchantID,
      datetime,
      orderId,
      challenge: crypto.randomBytes(16).toString('hex')
    };

    const encryptedData = this.encryptWithPublicKey(
      JSON.stringify(sensitiveData),
      this.config.nagad.nagadPublicKey
    );
    const signature = this.signWithPrivateKey(
      JSON.stringify(sensitiveData),
      this.config.nagad.merchantPrivateKey
    );

    const initRes = await axios.post(
      `${this.config.nagad.baseURL}/check-out/initialize/${this.config.nagad.merchantID}/${orderId}`,
      { dateTime: datetime, sensitiveData: encryptedData, signature },
      { headers: { 'X-KM-Api-Version': 'v-0.2.0', 'Content-Type': 'application/json' } }
    );

    const decryptedInit = JSON.parse(
      this.decryptWithPrivateKey(initRes.data.sensitiveData, this.config.nagad.merchantPrivateKey)
    );

    const paymentInfo = {
      merchantId: this.config.nagad.merchantID,
      orderId,
      currencyCode: '050',
      amount: parseFloat(order.totalAmount).toFixed(2),
      challenge: decryptedInit.challenge
    };

    const completeRes = await axios.post(
      `${this.config.nagad.baseURL}/check-out/complete/${decryptedInit.paymentReferenceId}`,
      {
        sensitiveData: this.encryptWithPublicKey(JSON.stringify(paymentInfo), this.config.nagad.nagadPublicKey),
        signature: this.signWithPrivateKey(JSON.stringify(paymentInfo), this.config.nagad.merchantPrivateKey),
        merchantCallbackURL: this.config.nagad.callbackURL
      },
      { headers: { 'X-KM-Api-Version': 'v-0.2.0', 'Content-Type': 'application/json' } }
    );

    return {
      paymentReferenceId: decryptedInit.paymentReferenceId,
      callBackUrl: completeRes.data.callBackUrl,
      orderId
    };
  }

  async verifyNagadOrder(paymentRefId) {
    const res = await axios.get(`${this.config.nagad.baseURL}/verify/payment/${paymentRefId}`, {
      headers: { 'X-KM-Api-Version': 'v-0.2.0' }
    });
    return res.data;
  }

  // =========================================================================
  // 3. Cryptographic Helper Functions
  // =========================================================================

  encryptWithPublicKey(data, key) {
    return crypto.publicEncrypt(
      { key, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(data)
    ).toString('base64');
  }

  decryptWithPrivateKey(data, key) {
    return crypto.privateDecrypt(
      { key, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(data, 'base64')
    ).toString('utf8');
  }

  signWithPrivateKey(data, key) {
    const s = crypto.createSign('SHA256');
    s.update(data);
    s.end();
    return s.sign(key, 'base64');
  }
}

module.exports = WalletService;
```
