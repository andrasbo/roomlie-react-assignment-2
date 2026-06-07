import { createContext } from "react";

export interface TableData {
  id: number;
  name: string;
  type: TableType;
  category: TableCategory;
  color: string;
  status: number;
  position: { x: number; y: number };
  isLocked: boolean;
}

export interface TableDraft {
  name: string;
  type: TableType;
  category: TableCategory;
  color: string;
  status: number;
  position: { x: number; y: number };
  isLocked: boolean;
}

export type TableType = "snooker" | "air-hockey" | "foosball";
export type TableCategory = "competition" | "normal" | "kids";

interface TableContextType {
  tables: TableData[];
  setTables: React.Dispatch<React.SetStateAction<TableData[]>>;
  activeTable: TableData | null | undefined;
  draft: Omit<TableData, "id">;
  setDraft: React.Dispatch<React.SetStateAction<Omit<TableData, "id">>>;
  resetTables: () => void;
  defaultNewTable: Omit<TableData, "id">;
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  createTable: (t: TableDraft) => void;
  synchTable: (id: number, t: Omit<TableDraft, "position">) => void;
  deleteTable: (id: number) => void;
  updateTablePosition: (id: number, x: number, y: number) => void;
  synchTablePosition: (id: number, x: number, y: number) => void;
  roomRef: React.RefObject<HTMLDivElement | null>;
  roomDimensions: { width: number; height: number };
  setRoomDimensions: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
}

export const TableContext = createContext<TableContextType | undefined>(
  undefined,
);
