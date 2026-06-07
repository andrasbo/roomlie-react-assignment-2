import { useTable } from "../hooks/useTable";
import { type TableDraft } from "../contexts/TableContext";
import { TableForm } from "./TableForm";
import { Modal } from "./Modal";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PreviewBox } from "./PreviewBox";
import { NoTableSelected } from "./NoTableSelected";
import { BookingForm } from "./BookingForm";

const btnBase =
  "flex h-8 flex-1 items-center justify-center rounded-md px-3 py-1.5 text-[13px] transition-all cursor-pointer";
export const btnActive = `${btnBase} bg-white font-medium text-[#101827] shadow-[0_1px_3px_rgba(0,0,0,0.08)]`;
export const btnInactive = `${btnBase} text-[#69717E] hover:text-[#101827]`;

export const SidePanel = () => {
  const {
    activeTable,
    draft,
    selectedId,
    setSelectedId,
    setTables,
    createTable,
    synchTable,
    deleteTable,
  } = useTable();
  const [, setIsModalOpen] = useState(false);
  const { role } = useAuth();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleNewSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (role !== "admin") return;

    e.preventDefault();

    const newTable = {
      ...draft,
      type: draft.type as "snooker" | "air-hockey" | "foosball",
      category: draft.category as "normal" | "competition" | "kids",
      position: { x: 50, y: 50 },
    };
    createTable(newTable as TableDraft);
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (role !== "admin") return;

    e.preventDefault();
    if (selectedId === null) return;

    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === selectedId
          ? {
              ...table,
              ...draft,
              type: draft.type as "snooker" | "air-hockey" | "foosball",
              category: draft.category as "normal" | "competition" | "kids",
            }
          : table,
      ),
    );
    synchTable(selectedId, draft as Omit<TableDraft, "position">);
  };

  const handleDelete = () => {
    if (role !== "admin") return;

    if (selectedId === null) return;
    setTables((prevTables) => prevTables.filter((t) => t.id !== selectedId));
    setSelectedId(null);
    deleteTable(selectedId);
  };

  return (
    <>
      <div className="flex w-full lg:w-[288px] flex-col gap-3 shrink-0">
        <div className="flex h-10 w-full items-center rounded-lg bg-[#F7F8FA] p-1">
          {role === "admin" && (
            <button
              onClick={() => {
                setSelectedId(null);
                setIsAdminModalOpen(true);
              }}
              className={activeTable ? btnInactive : btnActive}
            >
              Új asztal
            </button>
          )}

          <button className={activeTable ? btnActive : btnInactive}>
            Asztal adatai
          </button>
        </div>

        {role === "admin" &&
          (activeTable ? (
            <TableForm
              title="Asztal adatai"
              submitLabel="Asztal mentése"
              handleSubmit={handleEditSubmit}
              handleDelete={handleDelete}
            />
          ) : (
            <NoTableSelected />
          ))}

        {role === "user" &&
          (activeTable ? (
            <div className="flex flex-col gap-3">
              <PreviewBox />
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-[#101827] text-[13px] font-medium text-white transition-opacity hover:bg-opacity-90 cursor-pointer shadow-md"
              >
                Asztal foglalása
              </button>
            </div>
          ) : (
            <NoTableSelected />
          ))}
      </div>

      {role === "admin" && (
        <Modal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          title="Új asztal"
        >
          <div className="flex w-full lg:w-[288px] flex-col gap-3 shrink-0">
            <div className="flex flex-col rounded-xl border border-[#E5E7EA] bg-white">
              <TableForm
                title={null}
                submitLabel="Új asztal elhelyezése"
                handleSubmit={handleNewSubmit}
                handleDelete={null}
              />
            </div>
          </div>
        </Modal>
      )}

      {role === "user" && activeTable && (
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title={`${activeTable.name} foglalása`}
        >
          <div className="flex w-full sm:w-87.5 flex-col shrink-0">
            <BookingForm onClose={() => setIsBookingModalOpen(false)} />
          </div>
        </Modal>
      )}
    </>
  );
};
