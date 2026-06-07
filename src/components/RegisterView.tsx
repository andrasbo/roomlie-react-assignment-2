import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export const RegisterView = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const success = await register(
      String(formData.get("username")),
      String(formData.get("email")),
      String(formData.get("password")),
    );

    if (success) {
      toast.success("Sikeres regisztráció!");
      navigate("/");
    } else {
      toast.error("Regisztráció sikertelen!");
    }
  }

  return (
    <section className="flex flex-row justify-center items-center flex-1 w-full min-h-[calc(100vh-(--spacing(16)))] bg-[#F0F0F0] self-stretch">
      <div className="box-border flex flex-col items-start p-0 w-full max-w-[384px] bg-white border border-[#E5E5E5] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[14px]">
        <div className="flex flex-col items-start p-6 gap-1.5 w-full self-stretch">
          <h1 className="font-semibold text-[20px] leading-6 text-[#0A0A0A]">
            Regisztráció
          </h1>
        </div>

        <div className="flex flex-col items-start px-6 pb-6 pt-0 w-full self-stretch">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start p-0 gap-4 w-full self-stretch"
          >
            <div className="flex flex-col items-start p-0 gap-1.5 w-full self-stretch">
              <label
                htmlFor="username"
                className="font-medium text-[14px] leading-4.25 text-[#0A0A0A]"
              >
                Felhasználónév
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Gipsz_terminator89"
                className="box-border flex flex-row items-center px-3 py-2 w-full h-10 bg-white border border-[#E5E5E5] rounded-md font-normal text-[14px] leading-4.25 text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="flex flex-col items-start p-0 gap-1.5 w-full self-stretch">
              <label
                htmlFor="email"
                className="font-medium text-[14px] leading-4.25 text-[#0A0A0A]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                className="box-border flex flex-row items-center px-3 py-2 w-full h-10 bg-white border border-[#E5E5E5] rounded-md font-normal text-[14px] leading-4.25 text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="flex flex-col items-start p-0 gap-1.5 w-full self-stretch">
              <label
                htmlFor="password"
                className="font-medium text-[14px] leading-4.25 text-[#0A0A0A]"
              >
                Jelszó
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="box-border flex flex-row items-center px-3 py-2 w-full h-10 bg-white border border-[#E5E5E5] rounded-md font-normal text-[14px] leading-4.25 text-[#0A0A0A] placeholder:text-[#737373] focus:outline-none focus:border-neutral-400"
              />
            </div>

            <button
              type="submit"
              className="flex flex-row justify-center items-center p-0 w-full h-9 bg-[#171717] rounded-lg text-[#FAFAFA] font-medium text-[14px] leading-4.25 hover:bg-neutral-800 transition-colors self-stretch"
            >
              Regisztráció
            </button>

            <div className="flex flex-col items-center pt-4 pb-0 px-0 gap-2 w-full self-stretch">
              <NavLink
                to="/login"
                className="font-normal text-[14px] leading-4.25 text-center text-[#737373] hover:underline"
              >
                Van már fiókod? Jelentkezz be
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
