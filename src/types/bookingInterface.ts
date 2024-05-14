import { carInterface } from "./carInterface";

export interface Booking {
    _id?:string
    carId: string | carInterface;
    userId: string;
    owner: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'On Hold' | 'In Progress';
    date: {
      start: Date;
      end: Date;
    };
    time: {
      start: string;
      end: string;
    };
    location: {
      start: string;
      end: string;
    };
    transaction: {
      _id?:string;
      transactionId: string;
      amount: number;
    };
    ownerRole:string,
    issues:string
  }

  export interface bookingDetail{
    pickupLocation?: string;
    dropOffLocation?: string;
    startDate?: Date;
    endDate?: Date;
    pickupTime?: string;
    dropOffTime?: string
    amount?:number
    discount?:number
    total?:number
    transaction: {
      _id?:string;
      transactionId: string;
      amount: number;
    };
  }

  export interface backendBooking { 
    sessionId: string,
    carId: string,
    userId: string,
    amount: number,
    currency: string,
}

export interface SessionDataInterface {
  transactionId: string;
  bookingDetails: bookingDetail;
  carId: string;
  userId: string
}

export interface RefundDetails {
  transactionId: string;
  amount: number;
  currency: string;
  created: number;
  status: string | null;
  card: {
      brand: string | null;
      last4: string | null;
      exp_month: number;
      exp_year: number;
  };
  bookingDetail?: {
      itemName: string;
      thumbnail: string;
  };
}