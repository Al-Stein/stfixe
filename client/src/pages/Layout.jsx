import { Outlet, Link } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { MdEmail } from "react-icons/md";

const Layout = () => {
  return (
    <div className="relative flex">
      <nav className="bg-orange-500 min-h-screen py-10 px-3 z-50">
        <ul className="flex flex-col gap-5">
          <li>
            <Link to="/">
              <span className="text-3xl text-white">
                <GoHomeFill />
              </span>
            </Link>
          </li>
          <li>
            <Link to="/emails">
              <div className="relative">
                <MdEmail className="text-3xl text-white" />
                {/* <span class="absolute">
                  <span class="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                    6
                  </span>
                </span> */}
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
