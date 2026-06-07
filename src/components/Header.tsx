import { NavLink } from "react-router";
import { useTable } from "../hooks/useTable";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { roomDimensions, setRoomDimensions, resetTables } = useTable();
  const { token, role, name } = useAuth();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newWidth = Number(formData.get("width"));
    const newHeight = Number(formData.get("height"));

    if (newWidth > 0 && newHeight > 0) {
      setRoomDimensions({ width: newWidth, height: newHeight });

      resetTables();
    }
  };

  const handleReset = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.currentTarget.reset();

    setRoomDimensions({ width: 780, height: 500 });
    resetTables();
  };

  return (
    <header className="flex w-full min-h-12 flex-wrap items-center justify-between gap-3 border border-[#E5E7EA] bg-white px-4 py-2.5 box-border">
      <div className="flex items-center gap-2">
        <img src="/favicon.svg" alt="Ikon" />
        <h1 className="text-[14px] font-semibold leading-4.25 text-[#101827]">
          Roomlie
        </h1>

        <div className="hidden sm:block h-4 w-px bg-[#E5E7EA]"></div>
        <NavLink
          to="/"
          className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
        >
          Terem
        </NavLink>

        {token && role === "admin" && (
          <>
            <span className="text-[12px] font-normal leading-3.75 text-[#69717E] whitespace-nowrap">
              Terem mérete:
            </span>

            <form
              className="flex flex-1 items-center gap-3 flex-wrap"
              onSubmit={handleSubmit}
              onReset={handleReset}
            >
              <input
                type="number"
                name="width"
                defaultValue={roomDimensions.width}
                className="h-7 w-20 rounded-md border border-[#E5E7EA] bg-white px-2 text-center text-[12px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="X"
              />
              <span className="text-[12px] leading-3.75 text-[#69717E]">×</span>
              <input
                type="number"
                name="height"
                defaultValue={roomDimensions.height}
                className="h-7 w-20 rounded-md border border-[#E5E7EA] bg-white px-2 text-center text-[12px] text-[#101827] outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="Y"
              />
              <button
                type="submit"
                className="flex h-7 w-20 items-center justify-center rounded-md bg-[#F1F3F5] px-2.5 text-[12px] font-medium leading-3.75 text-[#101827] transition-colors hover:bg-gray-200 cursor-pointer"
              >
                Alkalmaz
              </button>

              <div className="hidden sm:block flex-1"></div>
              <button
                type="reset"
                className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 text-[#69717E] transition-colors hover:bg-gray-100 hover:text-[#101827] cursor-pointer"
              >
                <span className="text-[13px] leading-4">↺</span>
                <span className="text-[12px] font-medium leading-3.75">
                  Alaphelyzet
                </span>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-green-200 hover:text-[#101827] cursor-pointer bg-green-100 text-[13px] font-medium text-green-900 hover:bg-opacity-90"
              >
                Terem mentése
              </button>
            </form>
            <NavLink
              to="/bookings"
              className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
            >
              Beérkezett foglalások
            </NavLink>
          </>
        )}
        {token && role === "user" && (
          <NavLink
            to="/bookings/my"
            className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
          >
            Foglalásaim
          </NavLink>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!token && (
          <>
            <NavLink
              to="/login"
              className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
            >
              Bejelentkezés
            </NavLink>
            <NavLink
              to="/register"
              className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
            >
              Regisztráció
            </NavLink>
          </>
        )}
        {token && (
          <p>
            Üdv, {name}! {role === "admin" ? "⭐" : "👤"}
          </p>
        )}
        {token && (
          <NavLink
            to="/logout"
            className="flex items-center justify-center gap-1.25 rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-[#101827] cursor-pointer bg-gray-100 text-[13px] font-medium text-gray-900 hover:bg-opacity-90"
          >
            Kijelentkezés
          </NavLink>
        )}
      </div>
    </header>
  );
};
