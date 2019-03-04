/*

    https://developers.google.com/pay/api/web/guides/tutorial

*/
import {html} from '@polymer/lit-element'
import {default as ComponentBase} from './component-base'
const componentName = 'google-pay'
// require(`../../styles/components/${componentName}.scss`)

const environment = 'TEST'
// const environment = 'PRODUCTION'

/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
}

/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"]

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"]

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway|PaymentMethodTokenizationSpecification}
 */
const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        // 'gateway': 'example',
        // 'gatewayMerchantId': 'exampleGatewayMerchantId'
        "gateway": "stripe",
        "stripe:version": "2018-10-31",
        "stripe:publishableKey": "pk_live_jZKKFzftiylue9eSTOKL2Z8g"
    }
}

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
}

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const cardPaymentMethod = Object.assign({},
    baseCardPaymentMethod, {
        tokenizationSpecification: tokenizationSpecification
    }
)

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
 */
let paymentsClient = null

class GooglePay extends ComponentBase {

    constructor() {
        super()
        window.onGooglePayLoaded = this.onGooglePayLoaded
        const script = document.createElement('script')
        script.addEventListener('load', this.onGooglePayLoaded.bind(this))
        document.head.appendChild(script)
        script.src = 'https://pay.google.com/gp/p/js/pay.js'
    }

    render() {
        return html ``
    }

    /**
     * Configure your site's support for payment methods supported by the Google Pay
     * API.
     *
     * Each member of allowedPaymentMethods should contain only the required fields,
     * allowing reuse of this base request when determining a viewer's ability
     * to pay and later requesting a supported payment method
     *
     * @returns {object} Google Pay API version, payment methods supported by the site
     */
    getGoogleIsReadyToPayRequest() {
        return Object.assign({},
            baseRequest, {
                allowedPaymentMethods: [baseCardPaymentMethod]
            }
        )
    }

    /**
     * Configure support for the Google Pay API
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|PaymentDataRequest}
     * @returns {object} PaymentDataRequest fields
     */
    getGooglePaymentDataRequest() {
        const paymentDataRequest = Object.assign({}, baseRequest)
        paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod]
        paymentDataRequest.transactionInfo = this.getGoogleTransactionInfo()
        paymentDataRequest.merchantInfo = {
            // @todo a merchant ID is available for a production environment after approval by Google
            // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
            // merchantId: '01234567890123456789',
            merchantName: 'Lightpaint Live'
        }
        return paymentDataRequest
    }

    /**
     * Return an active PaymentsClient or initialize
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
     * @returns {google.payments.api.PaymentsClient} Google Pay API client
     */
    getGooglePaymentsClient() {
        if (paymentsClient === null) {
            paymentsClient = new google.payments.api.PaymentsClient({
                environment
            })
        }
        return paymentsClient
    }

    /**
     * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
     *
     * Display a Google Pay payment button after confirmation of the viewer's
     * ability to pay.
     */
    onGooglePayLoaded() {
        console.log('onGooglePayLoaded')
        const paymentsClient = this.getGooglePaymentsClient()
        paymentsClient.isReadyToPay(this.getGoogleIsReadyToPayRequest())
            .then((response) => {
                if (response.result) {
                    this.addGooglePayButton()
                    // prefetch payment data to improve performance after confirming site functionality
                    this.prefetchGooglePaymentData()
                }
            })
            .catch((err) => {
                console.error('isReadyToPay error:', err)
            })
    }

    /**
     * Add a Google Pay purchase button alongside an existing checkout button
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/object#ButtonOptions|Button options}
     * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
     */
    addGooglePayButton() {
        const paymentsClient = this.getGooglePaymentsClient()
        const button =
            paymentsClient.createButton({
                onClick: this.onGooglePaymentButtonClicked.bind(this)
            })
        this.appendChild(button)
    }

    /**
     * Provide Google Pay API with a payment amount, currency, and amount status
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/object#TransactionInfo|TransactionInfo}
     * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
     */
    getGoogleTransactionInfo() {
        return {
            currencyCode: 'USD',
            totalPriceStatus: 'FINAL',
            totalPrice: '30.00'
        }
    }

    /**
     * Prefetch payment data to improve performance
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
     */
    prefetchGooglePaymentData() {
        console.log('prefetchGooglePaymentData')
        const paymentDataRequest = this.getGooglePaymentDataRequest()
        // transactionInfo must be set but does not affect cache
        paymentDataRequest.transactionInfo = {
            totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
            currencyCode: 'USD'
        }
        const paymentsClient = this.getGooglePaymentsClient()
        paymentsClient.prefetchPaymentData(paymentDataRequest)
    }

    /**
     * Show Google Pay payment sheet when Google Pay payment button is clicked
     */
    onGooglePaymentButtonClicked() {
        console.log('onGooglePaymentButtonClicked')
        const paymentDataRequest = this.getGooglePaymentDataRequest()
        paymentDataRequest.transactionInfo = this.getGoogleTransactionInfo()
        console.log(paymentDataRequest)

        const paymentsClient = this.getGooglePaymentsClient()
        paymentsClient.loadPaymentData(paymentDataRequest)
            .then((paymentData) => {
                this.processPayment(paymentData)
            })
            .catch((err) => {
                console.error('loadPaymentData error', err)
            })
    }

    /**
     * Process payment data returned by the Google Pay API
     *
     * @param {object} paymentData response from Google Pay API after user approves payment
     * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentData|PaymentData object reference}
     */
    processPayment(paymentData) {
        console.log('paymentData', paymentData)
        // pass payment data response to your gateway to process payment
        this.emit('buy', {token: paymentData.paymentMethodData.tokenizationData.token})
    }
}

customElements.define(componentName, GooglePay)
export default GooglePay

