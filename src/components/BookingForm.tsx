import { useState, useEffect } from "react";
import { useBooking } from "../hooks/useBooking";
import { useTable } from "../hooks/useTable";
import toast from "react-hot-toast";

interface BookingFormProps {
  onClose: () => void;
}

export const BookingForm = ({ onClose }: BookingFormProps) => {
  const { activeTable } = useTable();
  const { formData, setFormData, createBooking, getTimeslots, timeslots } =
    useBooking();

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (activeTable && date) {
        setIsLoadingSlots(true);
        await getTimeslots(activeTable.id, date);
        setSelectedSlot(null);
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date, activeTable, getTimeslots]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeTable || !selectedSlot) return;

    const success = await createBooking(
      activeTable.id,
      date,
      selectedSlot.startTime,
      selectedSlot.endTime,
      formData.name,
      formData.email,
      formData.phone,
      formData.headcount,
      formData.notes,
    );

    if (success) {
      onClose();
      toast.success("Foglalás sikeresen elmentve!");
    } else {
      toast.error("Foglalás sikertelen!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium leading-4 text-[#101827]">
          Foglaló neve
        </label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[13px] font-medium leading-4 text-[#101827]">
            Email
          </label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[13px] font-medium leading-4 text-[#101827]">
            Telefon
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="h-px w-full bg-[#E5E7EA] my-1"></div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-2">
          <label className="text-[13px] font-medium leading-4 text-[#101827]">
            Dátum
          </label>
          <input
            required
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[13px] font-medium leading-4 text-[#101827]">
            Fő
          </label>
          <input
            required
            type="number"
            min="1"
            value={formData.headcount}
            onChange={(e) =>
              setFormData({ ...formData, headcount: Number(e.target.value) })
            }
            className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 min-h-20">
        <label className="text-[13px] font-medium leading-4 text-[#101827]">
          Válassz időpontot
        </label>

        {isLoadingSlots ? (
          <div className="text-[13px] text-[#69717E] flex items-center h-full">
            Időpontok betöltése...
          </div>
        ) : timeslots.length === 0 ? (
          <div className="text-[13px] text-[#E02424] bg-[#FDE8E8] p-2 rounded-md">
            Ezen a napon nincsenek elérhető idősávok.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {timeslots.map((slot, index) => {
              const isSelected =
                selectedSlot?.startTime === slot.startTime &&
                selectedSlot?.endTime === slot.endTime;

              return (
                <div
                  key={index}
                  onClick={() =>
                    slot.isAvailable &&
                    setSelectedSlot({
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                    })
                  }
                  className={`
                    flex items-center justify-center h-10 rounded-md text-[13px] font-medium border transition-all select-none
                    ${
                      !slot.isAvailable
                        ? "bg-[#F3F4F6] text-[#9CA3AF] border-transparent cursor-not-allowed line-through"
                        : isSelected
                          ? "bg-[#101827] text-white border-[#101827] cursor-pointer shadow-md"
                          : "bg-white text-[#101827] border-[#E5E7EA] cursor-pointer hover:border-blue-400"
                    }
                  `}
                >
                  {slot.startTime} - {slot.endTime}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium leading-4 text-[#101827]">
          Megjegyzés (opcionális)
        </label>
        <textarea
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={!selectedSlot}
        className={`mt-2 flex h-10 w-full items-center justify-center rounded-lg text-[13px] font-medium transition-all ${
          !selectedSlot
            ? "bg-[#E5E7EA] text-[#9CA3AF] cursor-not-allowed"
            : "bg-[#101827] text-white hover:bg-opacity-90 cursor-pointer shadow-md"
        }`}
      >
        Foglalás véglegesítése
      </button>
    </form>
  );
};
