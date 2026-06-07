import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useBooking } from "../hooks/useBooking";
import type { Booking } from "../contexts/BookingContext";

const BookingCard = ({ booking }: { booking: Booking }) => {
  const { role } = useAuth();
  const { evaluateBooking } = useBooking();
  const [isOpen, setIsOpen] = useState(true);
  const statusStyles = {
    pending: "bg-[#F3F4F6] text-[#1F2937]",
    accepted: "bg-[#111827] text-white",
    declined:
      role === "admin"
        ? "bg-[#E02424] text-white"
        : "bg-[#FDE8E8] text-[#E02424]",
  };

  const statusLabels = {
    pending: "Függőben",
    accepted: "Elfogadva",
    declined: "Elutasítva",
  };

  return (
    <div className="flex flex-col p-5 gap-4 w-full bg-white border border-[#E5E7EA] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div
        className="flex justify-between items-start cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <h3 className="font-semibold text-[15px] leading-5 text-[#101827]">
            {booking.tableName}
          </h3>
          <p className="font-normal text-[13px] leading-4 text-[#69717E] mt-1">
            {booking.date} · {booking.startTime}–{booking.endTime}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[12px] font-medium leading-4 ${statusStyles[booking.status]}`}
          >
            {statusLabels[booking.status]}
          </span>
          <svg
            className={`w-5 h-5 text-[#69717E] transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="w-full h-px bg-[#E5E7EA]"></div>

          <div className="flex flex-col gap-2 text-[13px] leading-4">
            <div className="flex justify-between">
              <span className="text-[#69717E]">Foglaló neve:</span>
              <span className="font-medium text-[#101827] text-right">
                {booking.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69717E]">Email:</span>
              <span className="font-medium text-[#101827] text-right">
                {booking.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69717E]">Telefon:</span>
              <span className="font-medium text-[#101827] text-right">
                {booking.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69717E]">Résztvevők:</span>
              <span className="font-medium text-[#101827] text-right">
                {booking.headcount} fő
              </span>
            </div>
            {booking.notes && (
              <div className="flex justify-between">
                <span className="text-[#69717E]">Megjegyzés:</span>
                <span className="font-medium text-[#101827] text-right">
                  {booking.notes}
                </span>
              </div>
            )}
          </div>

          {role === "admin" && booking.status === "pending" && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => evaluateBooking(booking.id, "accepted")}
                className="flex-1 flex justify-center items-center h-9 bg-[#111827] hover:bg-gray-800 transition-colors rounded-lg text-white font-medium text-[13px]"
              >
                Elfogad
              </button>
              <button
                onClick={() => evaluateBooking(booking.id, "declined")}
                className="flex-1 flex justify-center items-center h-9 bg-[#E02424] hover:bg-red-700 transition-colors rounded-lg text-white font-medium text-[13px]"
              >
                Elutasít
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const BookingView = () => {
  const { role } = useAuth();
  const { myBookings, allBookings, getMyBookings, getAllBookings } =
    useBooking();

  useEffect(() => {
    if (role === "admin") {
      getAllBookings();
    } else {
      getMyBookings();
    }
  }, [role, getAllBookings, getMyBookings]);

  const displayedBookings = role === "admin" ? allBookings : myBookings;

  const pendingCount = displayedBookings.filter(
    (b) => b.status === "pending",
  ).length;
  const subtitle =
    role === "admin"
      ? `${pendingCount} függőben lévő foglalás vár jóváhagyásra.`
      : `${displayedBookings.length} foglalás`;

  return (
    <section className="flex flex-col items-center w-full min-h-[calc(100vh-(--spacing(16)))] bg-[#F3F4F6] py-10 px-4 box-border self-stretch">
      <div className="flex flex-col items-start gap-6 w-full max-w-150">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="font-semibold text-[20px] leading-6 text-[#101827]">
            {role === "admin" ? "Beérkezett foglalások" : "Foglalásaim"}
          </h1>
          <p className="font-normal text-[14px] leading-5 text-[#69717E]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {displayedBookings.length === 0 ? (
            <p className="text-sm text-[#69717E] text-center py-10">
              Nincsenek megjeleníthető foglalások.
            </p>
          ) : (
            displayedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
