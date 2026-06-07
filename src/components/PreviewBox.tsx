import { useTable } from "../hooks/useTable";
import { categoryLabels, typeLabels } from "../utils/Constants";

export const PreviewBox = () => {
  const { draft } = useTable();

  return (
    <div className="flex h-24 w-full items-center gap-4 rounded-lg border border-[#E5E7EA] bg-[#F7F8FA] px-4">
      <div
        className={`flex shrink-0 items-center justify-center rounded-md h-10 w-16
                        ${draft.category === "competition" ? "border-4" : ""}
                        ${draft.category === "normal" ? "border-2" : ""}
                        ${draft.category === "kids" ? "border-2 border-dotted bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[8px_8px]" : ""}
                      `}
        style={{
          backgroundColor: draft.color,
          opacity: 0.2 + (draft.status / 10) * 0.8,
        }}
      ></div>

      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-[13px] font-medium leading-4 text-[#101827]">
          {typeLabels[draft.type as keyof typeof typeLabels]}
        </span>

        <span className="truncate text-[11px] leading-3 text-[#69717E]">
          {categoryLabels[draft.category as keyof typeof categoryLabels]} |{" "}
          {draft.status}/10 | ({Math.floor(draft.position.x)},{" "}
          {Math.floor(draft.position.y)})
        </span>
      </div>
    </div>
  );
};
