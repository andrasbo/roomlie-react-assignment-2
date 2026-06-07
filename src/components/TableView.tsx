import { Dashboard } from "./Dashboard";
import { Room } from "./Room";
import { SidePanel } from "./SidePanel";
import { useAuth } from "../hooks/useAuth";

export const TableView = () => {
  const { token } = useAuth();

  return (
    <section className="flex flex-1 flex-col lg:flex-row  p-4 gap-6 overflow-hidden">
      <div className="w-full flex-1 flex flex-col items-center overflow-auto rounded-xl">
        <Room />
        <Dashboard />
      </div>
      {token && <SidePanel />}
    </section>
  );
};
