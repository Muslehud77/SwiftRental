import express from 'express';
import { Auth } from '../../Middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { bookingControllers } from './booking.controller';
import { validateRequest } from '../../Middlewares/validateRequest';
import { bookingValidation } from './booking.validation';


const router = express.Router();

router.get("/",Auth(USER_ROLE.admin),bookingControllers.getAllBookings)
router.post("/",Auth(USER_ROLE.user),validateRequest(bookingValidation.createBookingValidation),bookingControllers.bookACar)
router.get("/my-bookings",Auth(USER_ROLE.user),bookingControllers.getBookingsByUserId)


export const BookingRoutes = router;
