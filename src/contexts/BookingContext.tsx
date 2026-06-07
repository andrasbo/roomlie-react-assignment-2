import { createContext, type Dispatch, type SetStateAction } from "react";

export interface Booking {
  id: number;
  tableId: number;
  tableName: string;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  headcount: number;
  notes: string;
  status: StatusType;
}

export interface Timetable {
  date: string;
  timeslots: Timeslot[];
}

export interface Timeslot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export type StatusType = "pending" | "accepted" | "declined";

export interface BookingContextType {
  getTimeslots: (id: number, date: string) => Promise<boolean>;
  getMyBookings: () => Promise<boolean>;
  getAllBookings: () => Promise<boolean>;
  createBooking: (
    tableId: number,
    date: string,
    startTime: string,
    endTime: string,
    name: string,
    email: string,
    phone: string,
    headcount: number,
    notes: string,
  ) => Promise<boolean>;
  evaluateBooking: (id: number, status: string) => Promise<boolean>;
  timeslots: Timeslot[];
  myBookings: Booking[];
  allBookings: Booking[];
  formData: {
    name: string;
    email: string;
    phone: string;
    headcount: number;
    notes: string;
  };
  setFormData: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
      phone: string;
      headcount: number;
      notes: string;
    }>
  >;
}

export const BookingContext = createContext<BookingContextType | undefined>(
  undefined,
);
