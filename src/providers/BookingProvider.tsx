import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BookingContext,
  type Booking,
  type Timeslot,
} from "../contexts/BookingContext";
import { NEPTUN_CODE } from "../hooks/useTableApi";

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    headcount: 1,
    notes: "",
  });

  useEffect(() => {
    const storedTimeslots = localStorage.getItem("timeslots");
    const storedMyBookings = localStorage.getItem("myBookings");
    const storedAllBookings = localStorage.getItem("allBookings");

    if (storedTimeslots) {
      setTimeslots(JSON.parse(storedTimeslots));
    }
    if (storedMyBookings) {
      setMyBookings(JSON.parse(storedMyBookings));
    }
    if (storedAllBookings) {
      setAllBookings(JSON.parse(storedAllBookings));
    }

    const storedForm = localStorage.getItem("bookingForm");
    if (storedForm) setFormData(JSON.parse(storedForm));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookingForm", JSON.stringify(formData));
  }, [formData]);

  const getTimeslots = useCallback(async (id: number, date: string) => {
    try {
      const response = await fetch(
        ` https://roomlie-api.gkrisz.space/api/v1/tables/${id}/timeslots?date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Neptun-Code": NEPTUN_CODE,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();
      setTimeslots(data);
      localStorage.setItem("timeslots", JSON.stringify(data));
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      return false;
    }
    return true;
  }, []);

  const getMyBookings = useCallback(async () => {
    try {
      const response = await fetch(
        ` https://roomlie-api.gkrisz.space/api/v1/bookings/my`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Neptun-Code": NEPTUN_CODE,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("myBookings", JSON.stringify(data));
      setMyBookings(data);
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      return false;
    }
    return true;
  }, []);

  const getAllBookings = useCallback(async () => {
    try {
      const response = await fetch(
        ` https://roomlie-api.gkrisz.space/api/v1/bookings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Neptun-Code": NEPTUN_CODE,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("allBookings", JSON.stringify(data));
      setAllBookings(data);
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      return false;
    }
    return true;
  }, []);

  const createBooking = async (
    tableId: number,
    date: string,
    startTime: string,
    endTime: string,
    name: string,
    email: string,
    phone: string,
    headcount: number,
    notes: string,
  ) => {
    try {
      const response = await fetch(
        ` https://roomlie-api.gkrisz.space/api/v1/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Neptun-Code": NEPTUN_CODE,
          },
          body: JSON.stringify({
            tableId,
            date,
            startTime,
            endTime,
            name,
            email,
            phone,
            headcount,
            notes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const newBooking = await response.json();

      setMyBookings((prevBookings) => {
        const updatedBookings = [...prevBookings, newBooking];
        localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
        return updatedBookings;
      });
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      return false;
    }
    return true;
  };

  const evaluateBooking = async (id: number, status: string) => {
    try {
      const response = await fetch(
        ` https://roomlie-api.gkrisz.space/api/v1/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Neptun-Code": NEPTUN_CODE,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();

      setAllBookings((prevBookings) => {
        const newBookings = prevBookings.map((booking) =>
          booking.id === id ? data : booking,
        );
        localStorage.setItem("allBookings", JSON.stringify(newBookings));
        return newBookings;
      });
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      return false;
    }
    return true;
  };

  return (
    <BookingContext.Provider
      value={{
        getTimeslots,
        getMyBookings,
        getAllBookings,
        createBooking,
        evaluateBooking,
        timeslots,
        myBookings,
        allBookings,
        formData,
        setFormData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
