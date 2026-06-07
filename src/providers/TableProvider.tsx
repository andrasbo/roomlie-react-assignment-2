import { useState, useRef, type ReactNode } from "react";
import { TableContext } from "../contexts/TableContext";
import { useTableApi } from "../hooks/useTableApi";
import { defaultNewTable } from "../utils/Constants";

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const {
    tables,
    setTables,
    createTable,
    synchTable,
    deleteTable,
    synchTablePosition,
    resetTablesFromLocalStorage,
  } = useTableApi();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [roomDimensions, setRoomDimensions] = useState({
    width: 780,
    height: 500,
  });
  const roomRef = useRef<HTMLDivElement>(null);

  const activeTable = selectedId
    ? tables.find((t) => t.id === selectedId)
    : null;

  const [draft, setDraft] = useState(
    activeTable ? { ...activeTable } : { ...defaultNewTable },
  );

  const [prevSelectedId, setPrevSelectedId] = useState(selectedId);
  const [prevPosition, setPrevPosition] = useState(activeTable?.position);

  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setDraft(activeTable ? { ...activeTable } : { ...defaultNewTable });
    setPrevPosition(activeTable?.position);
  }

  if (activeTable && activeTable.position !== prevPosition) {
    setPrevPosition(activeTable.position);
    setDraft((prevDraft) => ({ ...prevDraft, position: activeTable.position }));
  }

  const resetTables = () => {
    resetTablesFromLocalStorage();
    setSelectedId(null);
  };

  const updateTablePosition = (id: number, x: number, y: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, position: { x, y } } : t)),
    );
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        setTables,
        activeTable,
        draft,
        setDraft,
        updateTablePosition,
        resetTables,
        defaultNewTable: defaultNewTable,
        selectedId,
        setSelectedId,
        createTable,
        synchTable,
        deleteTable,
        synchTablePosition,
        roomRef,
        roomDimensions,
        setRoomDimensions,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
