import {
  type TableCategory,
  type TableDraft,
  type TableType,
} from "../contexts/TableContext";

export const defaultNewTable: TableDraft = {
  name: "Új asztal",
  type: "foosball",
  category: "normal",
  color: "red",
  status: 10,
  position: { x: 50, y: 50 },
  isLocked: false,
};

export const typeLabels: Record<TableType, string> = {
  foosball: "Csocsó",
  snooker: "Biliárd",
  "air-hockey": "Léghoki",
};
export const categoryLabels: Record<TableCategory, string> = {
  normal: "Normál",
  competition: "Verseny",
  kids: "Gyerek",
};

export const tableDimensions = {
  snooker: { width: 190, height: 100 },
  "air-hockey": { width: 140, height: 70 },
  foosball: { width: 120, height: 60 },
};

export const tableSpaceRequirements = {
  snooker: 50,
  "air-hockey": 40,
  foosball: 30,
};

export const roomBorderThickness = 4;
