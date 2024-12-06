export interface BookingData {
  _id: {
    $oid: string;
  };
  hotel: {
    hotelName: string;
  };
  serialNumber: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  roomCategory: string;
  numberOfRooms: number;
  numberOfPersons: number;
  bookingAmount: number;
  advanceAmount: number;
  dueAmount: number;
  advanceDate: {
    $date: string;
  };
  bookingSource: string;
  bookingBy: string;
  plan: string;
  contactNumber: string;
  remarks: string;
  addedBy: {
    $oid: string;
  };
  status: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserData {
  _id: {
    $oid: string;
  };
  username: string;
  password: string;
  role: string;
  hotel: {
    $oid: string;
  }[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
  serialNumber: string;
  isActive: boolean;
  loginTime?: {
    $date: string;
  };
  name: string;
}

export interface HotelData {
  _id: {
    $oid: string;
  };
  serialNumber: string;
  hotelName: string;
  location: string;
  ownerName: string;
  ownerContact: {
    phone: string;
    email: string;
  };
  isActive: boolean;
  GSTNumber: string;
  panNumber: string;
  aadharNumber: string;
  tradeLicense: string;
  roomCategories: string[];
  bank: string;
  accountNumber: string;
  ifscCode: string;
  otherDocuments: string;
  documentId: string;
  frontOfficeContact: string;
  addedBy: {
    $oid: string;
  };
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}
