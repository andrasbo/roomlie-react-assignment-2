import { useContext } from "react";
import { BookingContext } from "../contexts/BookingContext";

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error(
      "A useBooking hookot csak a BookingProvider-en belül lehet használni!",
    );
  }
  return context;
};
