import { useContext } from "react";
import { TableContext } from "../contexts/TableContext";

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      "A useTable hookot csak a TableProvider-en belül lehet használni!",
    );
  }
  return context;
};
