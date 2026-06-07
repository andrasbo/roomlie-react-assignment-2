export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium leading-4 text-[#101827]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-[#E5E7EA] bg-white px-3 py-2 text-[13px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#69717E]">
          ▼
        </div>
      </div>
    </div>
  );
};
