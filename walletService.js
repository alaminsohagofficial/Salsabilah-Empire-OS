```javascript
/**
 * Repository: Salsabilah-Empire-OS
 * File Path: services/walletService.js
 * Purpose: Unified Multi-Wallet & QR Payment Gateway for Showroom POS
 * Supported Channels: bKash (Bangla QR), Nagad, DBBL Rocket, City Bank CityTouch, Islami Bank MCash
 * Organization: Salsabilah Amin Limited | Retail: S.R. Electronics Park
 */

const crypto = require('crypto');
const axios = require('axios');
const smsService = require('./salsabilahSmsService');

class WalletService {
  constructor() {
    this.config = {
      // 1. bKash Merchant (Bangla QR)
      bkash: {
        merchantTitle: 'SR ELECTRONICS PARK 17',
        merchantNumber: '01711995940',
        personalNumber: '01719732134',
        appKey: process.env.BKASH_APP_KEY || 'bkash_app_key_placeholder',
        appSecret: process.env.BKASH_APP_SECRET || 'bkash_app_secret_placeholder',
        username: process.env.BKASH_USERNAME || '01711995940',
        password: process.env.BKASH_PASSWORD || 'bkash_secret_placeholder',
        baseURL: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
        callbackURL: process.env.BKASH_CALLBACK_URL || 'http://localhost:3000/api/pos/wallet/bkash/callback'
      },
      // 2. Nagad PGW
      nagad: {
        merchantID: process.env.NAGAD_MERCHANT_ID || 'NAGAD_SR_ELEC_01',
        merchantNumber: '01719732134',
        merchantPrivateKey: process.env.NAGAD_PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----\n...',
        nagadPublicKey: process.env.NAGAD_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\n...',
        baseURL: process.env.NAGAD_BASE_URL || 'https://api.mynagad.com/api/dfs',
        callbackURL: process.env.NAGAD_CALLBACK_URL || 'http://localhost:3000/api/pos/wallet/nagad/callback'
      },
      // 3. DBBL Rocket Personal
      rocket: {
        walletNumber: '01719732134',
        accountTitle: 'MD. AL AMIN SOHAG',
        qrType: 'Rocket Personal QR'
      },
      // 4. The City Bank PLC (CityTouch QR)
      cityBank: {
        accountHolder: 'S. R Electronics Park',
        accountNumber: '1454711402001',
        channel: 'CityTouch Commercial QR',
        routingNumber: '225261548'
      },
      // 5. Islami Bank Bangladesh PLC (MCash)
      mcash: {
        walletNumber: '017197321341',
        accountTitle: 'MD. AL AMIN SOHAG',
        channel: 'IBBL MCash QR'
      },
      // Showroom & Dealership Metadata
      showroom: {
        outletName: 'S.R. Electronics Park',
        registeredTitle: 'SR ELECTRONICS PARK 17',
        location: 'Hatboalia Bazar, Alamdanga, Chuadanga',
        hotlines: ['01719732134', '01711995940'],
        dealerCodes: {
          minister: 'DEAL002905',
          butterfly: '3000002272'
        }
      }
    };
    this.bkashToken = null;
    this.tokenExpiry = null;
  }

  // =========================================================================
  // Master QR & Channel Directory for POS Terminal Display
  // =========================================================================

  getAvailablePaymentChannels() {
    return [
      {
        id: 'bkash_merchant',
        name: 'bKash Merchant (Bangla QR)',
        identifier: this.config.bkash.merchantNumber,
        title: this.config.bkash.merchantTitle,
        type: 'MERCHANT_GATEWAY',
        instantVerify: true
      },
      {
        id: 'city_touch',
        name: 'City Bank (CityTouch QR)',
        identifier: this.config.cityBank.accountNumber,
        title: this.config.cityBank.accountHolder,
        type: 'BANK_DIRECT_QR',
        instantVerify: true
      },
      {
        id: 'nagad_merchant',
        name: 'Nagad Merchant PGW',
        identifier: this.config.nagad.merchantNumber,
        title: this.config.showroom.outletName,
        type: 'MERCHANT_GATEWAY',
        instantVerify: true
      },
      {
        id: 'dbbl_rocket',
        name: 'DBBL Rocket Personal',
        identifier: this.config.rocket.walletNumber,
        title: this.config.rocket.accountTitle,
        type: 'WALLET_DIRECT_QR',
        instantVerify: false
      },
      {
        id: 'ibbl_mcash',
        name: 'Islami Bank MCash',
        identifier: this.config.mcash.walletNumber,
        title: this.config.mcash.accountTitle,
        type: 'WALLET_DIRECT_QR',
        instantVerify: false
      }
    ];
  }

  // =========================================================================
  // bKash Tokenized Handshake & Execution
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
    return {
      ...res.data,
      merchantTitle: this.config.bkash.merchantTitle,
      merchantNumber: this.config.bkash.merchantNumber
    };
  }

  async executeBkashOrder(paymentID, customerPhone = null) {
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

    if (res.data.statusCode === '0000') {
      const targetPhone = customerPhone || res.data.customerMsisdn;
      if (targetPhone) {
        await this.dispatchPaymentSms({
          phone: targetPhone,
          provider: 'bKash (Bangla QR)',
          amount: res.data.amount,
          invoiceId: res.data.merchantInvoiceNumber,
          trxID: res.data.trxID
        });
      }
    }
    return res.data;
  }

  // =========================================================================
  // Nagad PGW Handshake & Verification
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

    const encryptedData = this.encryptWithPublicKey(JSON.stringify(sensitiveData), this.config.nagad.nagadPublicKey);
    const signature = this.signWithPrivateKey(JSON.stringify(sensitiveData), this.config.nagad.merchantPrivateKey);

    const initRes = await axios.post(
      `${this.config.nagad.baseURL}/check-out/initialize/${this.config.nagad.merchantID}/${orderId}`,
      { dateTime: datetime, sensitiveData: encryptedData, signature },
      { headers: { 'X-KM-Api-Version': 'v-0.2.0' } }
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
      { headers: { 'X-KM-Api-Version': 'v-0.2.0' } }
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

    if (res.data.status === 'Success' && res.data.clientMobileNo) {
      await this.dispatchPaymentSms({
        phone: res.data.clientMobileNo,
        provider: 'Nagad',
        amount: res.data.amount,
        invoiceId: res.data.orderId,
        trxID: res.data.issuerPaymentRefNo || paymentRefId
      });
    }
    return res.data;
  }

  // =========================================================================
  // Automated SMS Dispatch via SalsabilahSmsService
  // =========================================================================

  async dispatchPaymentSms({ phone, provider, amount, invoiceId, trxID }) {
    const message = `Prio Grahok, ${this.config.showroom.registeredTitle}-e ${provider}-e apnar BDT ${amount} payment shofol hoyeche. Invoice: ${invoiceId}, TrxID: ${trxID}. Helpline: 01719732134`;
    try {
      await smsService.sendSms(phone, message);
    } catch (err) {
      console.error(`[WalletService SMS Notification Failed]: ${err.message}`);
    }
  }

  // =========================================================================
  // Cryptographic Helpers
  // =========================================================================

  encryptWithPublicKey(data, key) {
    return crypto.publicEncrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data)).toString('base64');
  }

  decryptWithPrivateKey(data, key) {
    return crypto.privateDecrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64')).toString('utf8');
  }

  signWithPrivateKey(data, key) {
    const s = crypto.createSign('SHA256');
    s.update(data);
    s.end();
    return s.sign(key, 'base64');
  }
}

module.exports = new WalletService();
```
