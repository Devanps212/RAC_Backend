import Stripe from "stripe";
import AppError from "../../utils/appErrors";
import { HttpStatus } from "../../types/httpTypes";
import { bookingDetail } from "../../types/bookingInterface";
import { carInterface } from "../../types/carInterface";
import configFile from "../../config";

const stripe = new Stripe(configFile.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});

export const paymentService = () => {
    const generateTransactionId = () => {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const transactionString = 'RAC-';
        
        let transactionId = '';
        for(let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionId += characters.charAt(randomIndex);
        }

        return transactionString + transactionId;
    };

    const paymentMakingService = async (bookingDetail: bookingDetail, car: carInterface | carInterface[] | null, userId: string) => {
        try {

            const transactionId = await generateTransactionId()
            if (!stripe) {
                throw new Error('Stripe is not initialized');
            }

            if (!car) {
                throw new Error('Car is not provided');
              }

            const carDetail = Array.isArray(car) ? car[0] : car;
            const carId = carDetail._id
            const carPriceData = {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: carDetail?.name || '',
                        images: carDetail?.thumbnailImg ? [carDetail.thumbnailImg] : [],
                    },
                    unit_amount: bookingDetail.total ? bookingDetail.total * 100  : carDetail.rentPricePerDay
                },
                quantity: 1,
            };
            
            const bookingDetails = encodeURIComponent(JSON.stringify(bookingDetail))
            const sessionData = {
                transactionId,
                carId,
                userId
            };

            const encodedData = encodeURIComponent(JSON.stringify(sessionData));
            
            

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [carPriceData],
                mode: "payment",
                success_url: `http://localhost:5000/api/booking/redirect-to?val=${encodedData}&bookingDetail=${bookingDetails}`,
                cancel_url: "http://localhost:5173/users/home"
            });
            

            console.log("session Id: ", session.id)
            return session.id;
        } catch (error: any) {
            console.log(error);
            throw new AppError(error.message, HttpStatus.BAD_GATEWAY);
        }
    };

    return { paymentMakingService, generateTransactionId };
};

export type paymentServiceType = typeof paymentService;
