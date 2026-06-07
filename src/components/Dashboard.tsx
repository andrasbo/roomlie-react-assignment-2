import { useMemo } from "react";
import { useTable } from "../hooks/useTable";
import { typeLabels } from "../utils/Constants";
import type { TableType } from "../contexts/TableContext";

interface KPIProps {
  label: string;
  count: number;
  avgStatus: number;
}

const KPI = ({ label, count, avgStatus }: KPIProps) => {
  if (count === 0) return null;

  return (
    <div className="flex flex-row items-center gap-2 rounded-lg border border-[#E5E7EA] bg-[#F8F9FA] px-3 py-1.5">
      <span className="text-[13px] font-medium text-[#101827]">{label}</span>

      <div className="flex items-center rounded bg-[#EAECEE] px-1.5 py-px">
        <span className="text-[12px] font-medium text-[#69717E]">
          {count} db
        </span>
      </div>

      <span className="text-[12px] text-[#69717E]">
        Ø {avgStatus.toFixed(1)}
      </span>
    </div>
  );
};

export const Dashboard = () => {
  const { tables } = useTable();
  const totalCount = tables.length;

  const stats = useMemo(() => {
    const initialStats: Record<string, { count: number; sum: number }> = {
      foosball: { count: 0, sum: 0 },
      snooker: { count: 0, sum: 0 },
      "air-hockey": { count: 0, sum: 0 },
    };

    return tables.reduce((acc, table) => {
      if (acc[table.type]) {
        acc[table.type].count += 1;
        acc[table.type].sum += table.status;
      }
      return acc;
    }, initialStats);
  }, [tables]);

  return (
    <div className="mt-4 box-border flex w-full max-w-195 flex-col items-start gap-2 rounded-xl border border-[#E5E7EA] bg-white p-4">
      <span className="text-[11px] font-semibold uppercase leading-3.25 tracking-wider text-[#69717E]">
        Összesítő
      </span>

      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <span className="text-2xl font-bold leading-7.25 text-[#101827]">
            {totalCount}
          </span>
          <span className="text-[13px] leading-4 text-[#69717E]">
            asztal összesen
          </span>
        </div>

        {totalCount > 0 && <div className="h-8 w-px bg-[#E5E7EA]"></div>}

        {Object.entries(typeLabels).map(([key, label]) => {
          const typeKey = key as TableType;

          const { count, sum } = stats[typeKey];
          const avgStatus = count > 0 ? sum / count : 0;

          return (
            <KPI
              key={typeKey}
              label={label}
              count={count}
              avgStatus={avgStatus}
            />
          );
        })}
      </div>
    </div>
  );
};
