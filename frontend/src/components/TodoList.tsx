import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  });

  if (isLoading) return <h3>Loading...</h3>;

  //* Renders
  const renderTodos = data.todos.map(({ documentId, title, description }: { documentId: string; title: string; description: string }) => (
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

  return <div className="space-y-1">{data.todos.length ? renderTodos : <h3>No todos yet!</h3>}</div>;
};

export default TodoList;
