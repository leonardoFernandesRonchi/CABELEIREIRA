import { Calendar, Home, Users, MessageCircle, LogOut } from "react-feather";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const Main = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const logOut = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside
        className="
        fixed bottom-0 left-0 right-0 
        bg-white border-t 
        md:static md:w-64 md:border-r md:border-t-0
        p-2 md:p-4
      "
      >
        <div className="hidden md:block">
          <img src={logo} alt="Logo" />
        </div>

        <nav
          className="
          flex justify-around  
          md:flex-col md:justify-start md:gap-4 ml-10
        "
        >
          <Link
            to="/"
            className="flex flex-col items-center md:flex-row gap-1 md:gap-2 cursor-pointer"
          >
            <Calendar size={18} />
            <p className="text-xs md:text-base">Serviços</p>
          </Link>

          <Link
            to="/agenda"
            className="flex flex-col items-center md:flex-row gap-1 md:gap-2 cursor-pointer"
          >
            <Users size={18} />
            <p className="text-xs md:text-base">Agenda</p>
          </Link>

          <div
            onClick={logOut}
            className="flex flex-col items-center md:flex-row gap-1 md:gap-2 cursor-pointer"
          >
            <LogOut className="md:hidden" size={18} />
            <button className=" hidden md:inline cursor-pointer w-[50%] rounded-2xl text-white rounded bg-red-600">
              Deslogar
            </button>
          </div>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-6 bg-[#F5F8F5] pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
