import { NavLink } from "react-router-dom";
import Button from "./ui/Button";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const onLogout = () => {
    localStorage.removeItem(storageKey);

    setTimeout(() => {
      location.replace("/");
    }, 1000);
  };

  return (
    <nav className="max-w-2xl mx-auto pt-7 mb-20 px-3 pb-5">
      <ul className="flex items-center flex-col md:flex-row justify-between text-gray-700 dark:text-white gap-2">
        <li className="duration-200 font-semibold text-md flex items-center gap-4">
          <NavLink to="/">Home</NavLink>
          <ThemeSwitcher />
        </li>
        {userData ? (
          <div className="flex items-center space-x-6">
            <li className="duration-200 text-md font-semibold">Welcome, {userData.user.username}</li>
            <li className="duration-200 text-md font-semibold">
              <NavLink to="/todos">Todos</NavLink>
            </li>
            <Button className="cursor-pointer" size={"sm"} onClick={onLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
