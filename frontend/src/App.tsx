import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 ">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  );
};

export default App;
