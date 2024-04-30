export interface Booking {
    _id?:string
    carId: string;
    userId: string;
    owner: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'On Hold' | 'In Progress';
    date: {
      start: Date;
      end: Date;
    }[];
    time: {
      start: string;
      end: string;
    }[];
    location: {
      start: string;
      end: string;
    }[];
    transaction: {
      transaction: string;
      amount: number;
    }[];
  }

  export interface bookingDetail{

  }