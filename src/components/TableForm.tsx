import type { TableCategory, TableType } from "../contexts/TableContext";
import { useTable } from "../hooks/useTable";
import { categoryLabels, typeLabels } from "../utils/Constants";
import { PreviewBox } from "./PreviewBox";
import { SelectField } from "./SelectField";

interface TableFormProps {
  title: string | null;
  submitLabel: string;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  handleDelete: (() => void) | null;
}

export const TableForm = ({
  title,
  submitLabel,
  handleSubmit,
  handleDelete,
}: TableFormProps) => {
  const { draft, setDraft, selectedId } = useTable();

  return (
    <div className="flex w-full lg:w-[288px] flex-col gap-3 shrink-0">
      <div className="flex flex-col rounded-xl border border-[#E5E7EA] bg-white">
        {title && (
          <div className="px-4 pt-4">
            <h2 className="text-[14px] font-semibold leading-4.25 text-[#101827]">
              {draft.name}
            </h2>
          </div>
        )}

        <div className="flex flex-col gap-4 px-4 py-4">
          <PreviewBox />

          <div className="h-px w-full bg-[#E5E7EA]"></div>

          <form
            key={selectedId || "new-table"}
            className="flex flex-col gap-3"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium leading-4 text-[#101827]">
                Név
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Asztal neve"
                className="h-9 w-full rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <SelectField
              label="Típus"
              value={draft.type}
              onChange={(val: string) =>
                setDraft({
                  ...draft,
                  type: val as TableType,
                })
              }
              options={Object.entries(typeLabels).map(([key, val]) => ({
                value: key,
                label: val,
              }))}
            />

            <SelectField
              label="Kategória"
              value={draft.category}
              onChange={(val: string) =>
                setDraft({
                  ...draft,
                  category: val as TableCategory,
                })
              }
              options={Object.entries(categoryLabels).map(([key, val]) => ({
                value: key,
                label: val,
              }))}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium leading-4 text-[#101827]">
                Szín
              </label>

              <div className="relative">
                <input
                  type="color"
                  name="color"
                  value={draft.color}
                  onChange={(e) =>
                    setDraft({ ...draft, color: e.target.value })
                  }
                  className="h-9 w-full appearance-none rounded-md border border-[#E5E7EA] bg-white pl-3 pr-8 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#69717E]">
                  ▼
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 pb-1">
              <div className="flex w-full items-center justify-between">
                <label className="text-[13px] font-medium leading-4 text-[#101827]">
                  Állapot
                </label>
                <span className="text-[13px] font-semibold text-[#101827]">
                  {draft.status} / 10
                </span>
              </div>
              <input
                type="range"
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: Number(e.target.value) })
                }
                min="1"
                max="10"
                className="w-full accent-[#101827] cursor-pointer"
              />
              <div className="flex w-full justify-between text-[10px] leading-3 text-[#69717E]">
                <span>Rossz</span>
                <span>Kiváló</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={draft.isLocked}
                onChange={(e) =>
                  setDraft({ ...draft, isLocked: e.target.checked })
                }
                id="isLocked"
                className="h-3.5 w-3.5 cursor-pointer rounded-[3px] border-black accent-[#101827]"
              />
              <label
                htmlFor="isLocked"
                className="flex cursor-pointer items-center gap-1.5"
              >
                <span className="text-[12px] font-medium leading-3.75 text-[#101827]">
                  Rögzített
                </span>
                <span className="text-[10px] font-medium leading-3 text-[#69717E]">
                  (nem mozgatható)
                </span>
              </label>
            </div>
            {handleDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-[#FDE6E7] text-[13px] font-medium text-[#FF0000] transition-opacity hover:bg-opacity-90 cursor-pointer"
              >
                Asztal törlése
              </button>
            )}

            <button
              type="submit"
              className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-[#101827] text-[13px] font-medium text-white transition-opacity hover:bg-opacity-90 cursor-pointer"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
