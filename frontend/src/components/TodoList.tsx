import { useEffect, useState } from "react";
import Button from "./ui/Button";
import axiosInstance from "../config/axios.config";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/users/me?populate=todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(res.data.todos);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  //* Renders
  const renderTodos = todos.map(({ documentId, title, description }) => (
    <div key={documentId} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
      <p className="w-full font-semibold">{title}</p>
      <p className="w-full font-semibold">{description}</p>
      <div className="flex items-center justify-end w-full space-x-3">
        <Button size={"sm"}>Edit</Button>
        <Button variant={"danger"} size={"sm"}>
          Remove
        </Button>
      </div>
    </div>
  ));

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1">
      {todos.length ? renderTodos : <h3>No todos yet!</h3>}
    </div>
  );
};

export default TodoList;
