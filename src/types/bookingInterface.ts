export interface Booking {
    _id?:string
    carId: string;
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
      transaction: string;
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