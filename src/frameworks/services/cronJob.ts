import cron from 'node-cron';
import { couponRepository } from '../database/mongodb/repositories/couponRepository';
import { couponModel } from '../database/mongodb/models/couponModel';
import { couponInterface } from '../../types/couponInetrface';

export const scheduleDeleteExpiredCoupons = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const couponService = couponRepository(couponModel);
            const now = new Date();

            const coupons: couponInterface[] = await couponService.findAllCoupon() || [];
            const expiredCoupons = coupons.filter(coupon => new Date(coupon.expiry) < now);

            for (const coupon of expiredCoupons) {
                await couponService.deleteCoupon(coupon._id as string);
            }

            console.log(`Deleted ${expiredCoupons.length} expired coupons`);
        } catch (error) {
            console.error('Error deleting expired coupons:', error);
            throw new Error('Failed to delete expired coupons');
        }
    });
};
