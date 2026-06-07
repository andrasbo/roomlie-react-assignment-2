import { useEffect, useState, useCallback } from "react";
import { type TableData, type TableDraft } from "../contexts/TableContext";
import toast from "react-hot-toast";

const API_URL = " https://roomlie-api.gkrisz.space/api/v1/tables";
const ORIGINAL_STATE_KEY = "roomlie-initial-tables";
export const NEPTUN_CODE = "HYCZBO";

export const useTableApi = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTables = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Neptun-Code": NEPTUN_CODE,
        },
      });

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();
      setTables(data);

      localStorage.setItem(ORIGINAL_STATE_KEY, JSON.stringify(data));
    } catch (err) {
      toast.error(`Adatbetöltési hiba: ${err}`);
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const createTable = async (t: TableDraft) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Neptun-Code": NEPTUN_CODE,
        },
        body: JSON.stringify(t),
      });

      if (response.ok) {
        toast.success("Asztal sikeresen létrehozva!");
        fetchTables();
      } else {
        throw new Error(`Szerver hiba a mentésnél: ${response.status}`);
      }
    } catch (err) {
      toast.error(`Nem sikerült az asztal létrehozása: ${err}`);
    }
  };

  const synchTable = async (id: number, t: Omit<TableDraft, "position">) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Neptun-Code": NEPTUN_CODE,
        },
        body: JSON.stringify(t),
      });

      if (!response.ok) {
        throw new Error(`Szerver hiba a mentésnél: ${response.status}`);
      }

      toast.success("Asztal sikeresen frissítve!");
    } catch (err) {
      toast.error(`Nem sikerült az asztal frissítése: ${err}`);
    }
  };

  const deleteTable = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Neptun-Code": NEPTUN_CODE,
        },
      });

      if (!response.ok) {
        throw new Error(`Szerver hiba a törlésnél: ${response.status}`);
      }

      toast.success("Asztal sikeresen törölve!");
    } catch (err) {
      toast.error(`Nem sikerült az asztal törlése: ${err}`);
    }
  };

  const synchTablePosition = async (id: number, x: number, y: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}/position`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Neptun-Code": NEPTUN_CODE,
        },
        body: JSON.stringify({ x, y }),
      });

      if (!response.ok) {
        throw new Error(`Szerver hiba a frissítésnél: ${response.status}`);
      }

      toast.success("Asztal pozíciója sikeresen frissítve!");
    } catch (err) {
      toast.error(`Nem sikerült az asztal pozíciójának frissítése: ${err}`);
    }
  };

  const resetTablesFromLocalStorage = () => {
    try {
      const originalData = localStorage.getItem(ORIGINAL_STATE_KEY);

      if (originalData) {
        setTables(JSON.parse(originalData));
        toast.success("Visszaállítás az eredetileg lekért állapotra!");
      } else {
        fetchTables();
      }
    } catch (err) {
      toast.error(`Hiba a visszaállítás során: ${err}`);
    }
  };

  return {
    tables,
    setTables,
    createTable,
    synchTable,
    deleteTable,
    synchTablePosition,
    resetTablesFromLocalStorage,
    isLoading,
  };
};
