export const NoTableSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E5E7EA] bg-[#F7F8FA] px-6 py-10 text-center">
      <svg
        className="mb-3 h-8 w-8 text-[#69717E] opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>

      <p className="text-[13px] font-medium leading-4 text-[#101827]">
        Nincs asztal kiválasztva
      </p>
      <p className="mt-1.5 text-[11px] leading-4 text-[#69717E]">
        A szerkesztéshez kattints egy asztalra vagy hozz létre új asztalt!
      </p>
    </div>
  );
};
