"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
const config_1 = __importDefault(require("../../config"));
const stripe = new stripe_1.default(config_1.default.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});
const paymentService = () => {
    const generateTransactionId = () => {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const transactionString = 'RAC-';
        let transactionId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionId += characters.charAt(randomIndex);
        }
        return transactionString + transactionId;
    };
    const paymentMakingService = async (bookingDetail, car, userId) => {
        try {
            const transactionId = await generateTransactionId();
            if (!stripe) {
                throw new Error('Stripe is not initialized');
            }
            if (!car) {
                throw new Error('Car is not provided');
            }
            const carDetail = Array.isArray(car) ? car[0] : car;
            const carId = carDetail._id;
            const carPriceData = {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: carDetail?.name || '',
                        images: carDetail?.thumbnailImg ? [carDetail.thumbnailImg] : [],
                    },
                    unit_amount: bookingDetail.total ? Math.round(bookingDetail.total * 100) : carDetail.rentPricePerDay
                },
                quantity: 1,
            };
            const bookingDetails = encodeURIComponent(JSON.stringify(bookingDetail));
            const sessionData = {
                transactionId,
                carId,
                userId
            };
            console.log("session detail : ", sessionData);
            const encodedData = encodeURIComponent(JSON.stringify(sessionData));
            console.log("making payment request to stripe");
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [carPriceData],
                mode: "payment",
                success_url: `http://easyrentacar.shop/api/booking/redirect-to?val=${encodedData}&bookingDetail=${bookingDetails}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: config_1.default.CANCEL_URI
            });
            console.log("payment session details : ", session);
            console.log("session Id: ", session.id);
            return session.id;
        }
        catch (error) {
            console.error(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_GATEWAY);
        }
    };
    const PaymentRefund = async (booking) => {
        console.log("refund starting");
        if (!booking) {
            throw new appErrors_1.default('no booking found', httpTypes_1.HttpStatus.NOT_FOUND);
        }
        console.log(booking);
        if (booking.transaction && booking.transaction.transactionId && booking.transaction.amount) {
            const paymentDetail = await stripe.checkout.sessions.retrieve(booking.transaction.transactionId);
            if (!paymentDetail.payment_intent) {
                throw new appErrors_1.default('No payment intent found for the session', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            const paymentIntentId = paymentDetail.payment_intent;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            const latestChargeId = paymentIntent.latest_charge;
            if (!latestChargeId) {
                throw new appErrors_1.default('No charge associated with the payment intent', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            const charge = await stripe.charges.retrieve(latestChargeId);
            const card = charge.payment_method_details?.card;
            if (!card) {
                console.log('No card details found');
                throw new appErrors_1.default('No card details found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            try {
                const refundAmount = Math.round(booking.transaction.amount * 100);
                ;
                const refund = await stripe.refunds.create({
                    charge: latestChargeId,
                    amount: refundAmount
                });
                console.log('Refund successful:', refund.amount);
                console.log(`Card Brand: ${card.brand}`);
                console.log(`Last 4 Digits: ${card.last4}`);
                console.log(`Expiry: ${card.exp_month}/${card.exp_year}`);
                const refundDetails = {
                    transactionId: refund.id,
                    amount: parseFloat((refundAmount / 100).toFixed(2)),
                    currency: refund.currency,
                    created: refund.created,
                    status: refund.status,
                    card: {
                        brand: card.brand,
                        last4: card.last4,
                        exp_month: card.exp_month,
                        exp_year: card.exp_year,
                    },
                };
                console.log('Refund Details:', refundDetails);
                return refundDetails;
            }
            catch (error) {
                console.error('Error creating refund:', error);
                throw new appErrors_1.default('Failed to create refund', httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            throw new appErrors_1.default('no amount and transactionId found', httpTypes_1.HttpStatus.NOT_FOUND);
        }
    };
    const paymentExtent = async (bookingDetail, car, userId) => {
        try {
            console.log("payment extending");
            const transactionId = await generateTransactionId();
            if (!stripe) {
                throw new Error('Stripe is not initialized');
            }
            if (!car) {
                throw new Error('Car is not provided');
            }
            const carDetail = Array.isArray(car) ? car[0] : car;
            const carId = carDetail._id;
            const carPriceData = {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: carDetail?.name || '',
                        images: carDetail?.thumbnailImg ? [carDetail.thumbnailImg] : [],
                    },
                    unit_amount: bookingDetail.total ? Math.round(bookingDetail.total * 100) : carDetail.rentPricePerDay
                },
                quantity: 1,
            };
            console.log(bookingDetail);
            const bookingData = {
                pickupLocation: bookingDetail.pickupLocation,
                dropOffLocation: bookingDetail.dropOffLocation,
                startDate: bookingDetail.startDate,
                endDate: bookingDetail.endDate,
                pickupTime: bookingDetail.pickupTime,
                dropOffTime: bookingDetail.dropOffTime,
                amount: bookingDetail.total,
                discount: bookingDetail.discount,
                bookingId: bookingDetail.bookingId,
            };
            console.log("bookingDetail : ", bookingData);
            const bookingDetails = encodeURIComponent(JSON.stringify(bookingData));
            const sessionData = {
                transactionId,
                carId,
                userId
            };
            console.log("session detail : ", sessionData);
            const encodedData = encodeURIComponent(JSON.stringify(sessionData));
            console.log("making payment request to stripe");
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [carPriceData],
                mode: "payment",
                success_url: `http://easyrentacar.shop/api/booking/redirect-to?val=${encodedData}&bookingDetail=${bookingDetails}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: config_1.default.CANCEL_URI
            });
            console.log("session Id: ", session.id);
            return session.id;
        }
        catch (error) {
            console.error(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_GATEWAY);
        }
    };
    const partnerPaymentForSignUp = async (paymentData) => {
        try {
            console.log("Payment service reached");
            if (!paymentData || !paymentData.amount || !paymentData.role) {
                throw new appErrors_1.default('Invalid payment data', httpTypes_1.HttpStatus.BAD_REQUEST);
            }
            const payment = {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "SignUp Payment",
                    },
                    unit_amount: Math.round(paymentData.amount * 100) || 250
                },
                quantity: 1,
            };
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [payment],
                mode: "payment",
                success_url: `http://easyrentacar.shop/api/partner/redirect-to/{CHECKOUT_SESSION_ID}/${paymentData.userId}`,
                cancel_url: config_1.default.CANCEL_URI
            });
            console.log("Checkout session created:", session);
            return session;
        }
        catch (error) {
            console.error("Error creating checkout session:", error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };
    const stripeSessionVerify = async (session_id) => {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            throw new appErrors_1.default('Invalid stripe sessionId', httpTypes_1.HttpStatus.BAD_REQUEST);
        }
        return session;
    };
    return {
        paymentMakingService,
        partnerPaymentForSignUp,
        generateTransactionId,
        stripeSessionVerify,
        PaymentRefund,
        paymentExtent
    };
};
exports.paymentService = paymentService;
