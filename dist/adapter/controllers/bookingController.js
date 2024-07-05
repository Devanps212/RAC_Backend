"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const car_1 = require("../../app/use_case/car/car");
const booking_1 = require("../../app/use_case/booking/booking");
const coupon_1 = require("../../app/use_case/coupon/coupon");
const user_1 = require("../../app/use_case/user/user");
const __1 = require("../..");
const mongoose_1 = require("mongoose");
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
const config_1 = __importDefault(require("../../config"));
const bookingController = (bookingInterface, bookingDBRepository, bookingModel, carInterface, carRepository, carModel, userModel, userInterface, userRepository, paymentInterface, paymentServices, couponInterface, couponRepository, couponModel) => {
    const bookingService = bookingInterface(bookingDBRepository(bookingModel));
    const carService = carInterface(carRepository(carModel));
    const userService = userInterface(userRepository(userModel));
    const paymentService = paymentInterface(paymentServices());
    const couponService = couponInterface(couponRepository(couponModel));
    const findBookings = (0, express_async_handler_1.default)(async (req, res) => {
        const data = req.query.bookingData;
        if (typeof data === 'string') {
            const findingBookings = await (0, booking_1.findBooking)(data, bookingService);
            res.json({
                data: findingBookings
            });
        }
        else {
            res.status(400).json({ message: 'Invalid data provided' });
        }
    });
    const bookingPaymentUI = (0, express_async_handler_1.default)(async (req, res) => {
        const { dataString, carId, userId } = req.body;
        const bookingDetail = JSON.parse(dataString);
        const carData = await (0, car_1.findCar)(carId, carService);
        const payment = await (0, booking_1.bookingPayment)(bookingDetail, carData, userId, paymentService);
        req.session.userData = payment;
        res.json({
            sessionId: payment
        });
    });
    const bookingCompletion = (0, express_async_handler_1.default)(async (req, res) => {
        const { val, bookingDetail, session_id } = req.query;
        if (typeof val === 'string' && typeof bookingDetail === 'string' && typeof session_id === 'string') {
            const decodedVal = decodeURIComponent(val);
            const decodedBooking = decodeURIComponent(bookingDetail);
            const paymentDetail = JSON.parse(decodedVal);
            paymentDetail.bookingDetails = JSON.parse(decodedBooking);
            const carId = paymentDetail.carId;
            const carDetails = await (0, car_1.findCar)(carId, carService);
            const sesssionVerification = await (0, booking_1.stripePaymentVeification)(session_id, paymentService);
            if (sesssionVerification) {
                paymentDetail.transactionId = session_id;
            }
            const bookingId = paymentDetail.bookingDetails.bookingId || '';
            console.log(bookingId);
            const booking = await (0, booking_1.findBooking)(bookingId, bookingService);
            if (booking !== null) {
                const bookingData = paymentDetail.bookingDetails;
                if (bookingData.amount && bookingData.startDate && bookingData.endDate) {
                    const data = {
                        transaction: {
                            transactionId: session_id,
                            amount: bookingData.amount || 0,
                        },
                        date: {
                            start: new Date(bookingData.startDate),
                            end: new Date(bookingData.endDate)
                        },
                        location: {
                            start: bookingData.pickupLocation,
                            end: bookingData.dropOffLocation
                        },
                        time: {
                            start: bookingData.pickupTime,
                            end: bookingData.dropOffTime
                        },
                        _id: bookingData.bookingId
                    };
                    const updateBooking = await (0, booking_1.BookingUpdater)(data, bookingService);
                    if (updateBooking !== null) {
                        const message = encodeURIComponent(`Your booking has been successfully rescheduled to start on ${new Date(bookingData.startDate).toISOString()} and end on ${new Date(bookingData.endDate).toISOString()}.`);
                        console.log("domain : ", config_1.default.DOMAIN_URL);
                        const redirectUrl = `https://easyrentacar.shop/BookedCars?message=${message}&status=success`;
                        res.redirect(redirectUrl);
                    }
                }
                else {
                    res.json({
                        error: "no necessary data found",
                        status: "failed"
                    });
                }
            }
            else {
                const bookingCreation = await (0, booking_1.createBooking)(paymentDetail, carDetails, bookingService);
                if (bookingCreation !== null) {
                    const price = bookingCreation.transaction.amount;
                    const AllCoupons = await (0, coupon_1.findAllCoupon)(couponService);
                    if (AllCoupons && AllCoupons.length > 0) {
                        const matchedCoupons = AllCoupons.filter(coupon => {
                            return coupon.ApplyPrice.minApply <= price && coupon.ApplyPrice.maxApply >= price;
                        });
                        if (matchedCoupons.length > 0) {
                            const data = {
                                _id: new mongoose_1.Types.ObjectId(bookingCreation.userId),
                                coupons: matchedCoupons
                            };
                            const userUpdate = await (0, user_1.updateUser)(data, userService);
                            if (userUpdate === null) {
                                res.json({
                                    messgae: 'cannot apply coupon',
                                    status: 'failed'
                                });
                            }
                        }
                    }
                    const data = JSON.stringify(bookingCreation);
                    const update = { status: 'booked' };
                    const statusUpdateCar = await (0, car_1.updateCar)(carId, update, carService);
                    if (statusUpdateCar) {
                        if (bookingCreation.ownerRole === 'Admin') {
                            __1.io.emit('newBookingAdmin', { message: `New Booking Alert: A booking has been created for ${statusUpdateCar.carData?.name}. Check the details in your dashboard.` });
                        }
                        else {
                            __1.io.emit('newBookingPartner', { message: `New Booking Alert: A booking has been created for ${statusUpdateCar.carData?.name}. Check the details in your dashboard.` });
                        }
                        console.log("domain  :", config_1.default.DOMAIN_URL);
                        res.redirect(`https://easyrentacar.shop/TransactionSuccess?bokingDetail=${data}&car=${carDetails}`);
                    }
                    else {
                        res.json({
                            statusUpdateCar
                        });
                    }
                }
            }
        }
    });
    const bookingFindingBasedOnRole = (0, express_async_handler_1.default)(async (req, res) => {
        const { bookingData } = req.body;
        console.log("booking data :", bookingData);
        const findBooking = await (0, booking_1.bookingBasedOnRole)(bookingData, bookingService);
        res.json({
            data: findBooking
        });
    });
    const bookingUpdater = (0, express_async_handler_1.default)(async (req, res) => {
        const { data, purpose } = req.body;
        const bookingDetail = data;
        if (bookingDetail && bookingDetail._id) {
            const booking = await (0, booking_1.findBooking)(bookingDetail._id, bookingService);
            if (!booking || (booking && 'message' in booking)) {
                res.status(404).json({
                    message: booking?.message || "Booking not found",
                    status: 'failed'
                });
                return;
            }
            if (Array.isArray(booking)) {
                res.status(400).json({
                    message: "Expected a single booking, but received an array.",
                    status: 'failed'
                });
                return;
            }
            if (booking.status === 'Cancelled') {
                res.status(400).json({
                    message: "Booking is already cancelled, no further action can be taken.",
                    status: 'failed'
                });
                return;
            }
            const update = await (0, booking_1.BookingUpdater)(bookingDetail, bookingService);
            if (bookingDetail.issues && bookingDetail.ownerRole === "Admin") {
                __1.io.emit("adminReport", {
                    message: `Report Alert: A new report has been filed. Please check Manage bookings`
                });
            }
            else {
                __1.io.emit("partnerReport", {
                    message: `Report Alert: A new report has been filed. Please check Manage bookings`
                });
            }
            if (!update || (update && 'message' in update)) {
                res.status(404).json({
                    message: update?.message || "Failed to update booking",
                    status: 'failed'
                });
                return;
            }
            if (update.status === 'Cancelled' && purpose === 'refund') {
                const refund = await (0, booking_1.stripeRefund)(update, paymentService);
                const refundData = {
                    Amount: refund.amount,
                    paymentId: refund.transactionId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const userId = new mongoose_1.Types.ObjectId(booking.userId);
                const data = {
                    _id: userId,
                    refund: [refundData]
                };
                const userRefundUpdate = await (0, user_1.updateUser)(data, userService);
                if (!userRefundUpdate) {
                    res.json({ error: "refund Failed", status: "failed" });
                }
                if (typeof booking.carId === 'object') {
                    refund.bookingDetail = {
                        itemName: booking.carId.name ?? '',
                        thumbnail: booking.carId.thumbnailImg ?? ''
                    };
                }
                res.json({
                    message: "Refund success",
                    data: refund
                });
            }
            else {
                res.json({
                    message: "booking update successfull",
                    status: "success"
                });
            }
        }
        else {
            res.status(400).json({
                message: "Booking ID is required",
                status: 'failed'
            });
        }
    });
    const bookingRescheduler = (0, express_async_handler_1.default)(async (req, res) => {
        const { data, userId } = req.body;
        const datas = data;
        const bookingId = datas.bookingId || '';
        if (!bookingId) {
            res.status(400).json({
                message: "Booking ID is required",
                status: 'failed'
            });
            return;
        }
        const booking = await (0, booking_1.findBooking)(bookingId, bookingService);
        if (!booking || (booking && 'message' in booking)) {
            res.status(404).json({
                message: booking?.message || "Booking not found",
                status: 'failed'
            });
            return;
        }
        if (Array.isArray(booking)) {
            res.status(400).json({
                message: "Expected a single booking, but received an array.",
                status: 'failed'
            });
            return;
        }
        if (booking.status === 'Cancelled') {
            res.status(400).json({
                message: "Booking is already cancelled, no further action can be taken.",
                status: 'failed'
            });
            return;
        }
        if (datas && typeof datas.carId === 'object') {
            const carId = datas.carId._id;
            if (carId && typeof carId === 'string') {
                const carData = await (0, car_1.findCar)(carId, carService);
                if (!carData) {
                    res.status(400).json({
                        message: "Car not found",
                        status: 'failed'
                    });
                    return;
                }
                datas.dropOffLocation = booking.location.end;
                datas.pickupLocation = booking.location.start;
                datas.dropOffTime = booking.time.start;
                datas.pickupTime = booking.time.end;
                datas.discount = 0,
                    datas.bookingId = booking._id;
                const payment = await (0, booking_1.bookingReschedule)(datas, carData, userId, paymentService);
                res.json({
                    sessionId: payment
                });
                return;
            }
            else {
                res.status(400).json({
                    message: "Invalid car ID",
                    status: 'failed'
                });
                return;
            }
        }
        else {
            res.status(400).json({
                message: "Car ID is required",
                status: 'failed'
            });
            return;
        }
    });
    const carReportHandler = (0, express_async_handler_1.default)(async (req, res) => {
        const { data, bookingId } = req.body;
        const carDetails = data;
        const carResult = await (0, car_1.findCar)(String(carDetails._id), carService);
        if (carResult === undefined || carResult === null || Array.isArray(carResult)) {
            throw new appErrors_1.default('Expected a single car', httpTypes_1.HttpStatus.EXPECTATION_FAILED);
        }
        const bookingResult = await (0, booking_1.findBooking)(bookingId, bookingService);
        if (bookingResult === undefined || bookingResult === null) {
            throw new appErrors_1.default("No booking found or an error occurred.", httpTypes_1.HttpStatus.EXPECTATION_FAILED);
        }
        if ('message' in bookingResult) {
            throw new appErrors_1.default(bookingResult.message, httpTypes_1.HttpStatus.EXPECTATION_FAILED);
        }
        if (Array.isArray(bookingResult)) {
            throw new appErrors_1.default("Multiple bookings found", httpTypes_1.HttpStatus.EXPECTATION_FAILED);
        }
        if (bookingResult.status === 'Cancelled' || bookingResult.status === 'Completed') {
            carResult.status = 'maintenance';
            bookingResult.issues = '';
            const data = await (0, car_1.updateCar)(String(carResult._id), carResult, carService);
            await (0, booking_1.BookingUpdater)(bookingResult, bookingService);
            res.json({ message: 'Car status updated to maintenance' });
        }
        else {
            throw new appErrors_1.default("User hasn't cancelled or completed the renting", httpTypes_1.HttpStatus.NOT_ACCEPTABLE);
        }
    });
    const topBookedCars = (0, express_async_handler_1.default)(async (req, res) => {
        const bookingResult = await (0, booking_1.findBooking)('all', bookingService);
        const carResult = await (0, car_1.findCar)('all', carService);
        if (Array.isArray(carResult) && Array.isArray(bookingResult)) {
            const carBookingCount = {};
            bookingResult.forEach((booking) => {
                const carId = typeof booking.carId === 'string' ? booking.carId : booking.carId._id?.toString();
                if (carId) {
                    carBookingCount[carId] = (carBookingCount[carId] || 0) + 1;
                }
            });
            const sortedCars = Object.entries(carBookingCount)
                .map(([carId, count]) => ({ carId, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 4);
            const topCars = sortedCars.map(({ carId }) => carResult.find(car => car._id?.toString() === carId)).filter(car => car);
            res.status(200).json({
                car: topCars,
                status: "success"
            });
        }
        else {
            res.status(400).json({ message: 'Invalid data received' });
        }
    });
    const paginationBooking = (0, express_async_handler_1.default)(async (req, res) => {
        let { page, limit, data } = req.query;
        let parsedData = {};
        if (typeof data === 'string') {
            const decodedData = decodeURIComponent(data);
            try {
                parsedData = JSON.parse(decodedData);
            }
            catch (error) {
                parsedData = decodedData;
            }
        }
        else {
            throw new Error('Invalid data parameter');
        }
        page = typeof page === 'string' && !isNaN(parseInt(page)) ? page : '1';
        limit = typeof limit === 'string' && !isNaN(parseInt(limit)) ? limit : '10';
        const bookingPage = await (0, booking_1.bookingPagination)(parsedData, parseInt(page), parseInt(limit), bookingService);
        res.status(200)
            .json({
            message: "success",
            bookings: bookingPage.formattedBookings,
            totalCount: bookingPage.totalCount
        });
    });
    return {
        bookingUpdater,
        bookingFindingBasedOnRole,
        findBookings,
        bookingPaymentUI,
        bookingCompletion,
        bookingRescheduler,
        carReportHandler,
        topBookedCars,
        paginationBooking
    };
};
exports.bookingController = bookingController;
