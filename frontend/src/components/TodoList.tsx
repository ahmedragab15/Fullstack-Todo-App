import Button from "./ui/Button";
import useCustomQuery from "../hooks/useCustomQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

const TodoList = () => {
  //* JWT
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

  //*add todo
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  //*Edit Todo
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    documentId: "",
    title: "",
    description: "",
  });

  //*remove todo
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [todoToRemove, setTodoToRemove] = useState({
    documentId: "",
  });

  //*fetch data
  const { isLoading, data, status, isRefetching, refetch } = useCustomQuery({
    queryKey: ["todoList"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  //* Handlers
  //*Add
  const onOpenAddModal = () => setIsAddModalOpen(true);

  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsAddModalOpen(false);
  };

  const onChangeAddTodoHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };

  const onSubmitAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;
    try {
      if (!title.trim() || !description.trim()) {
        toast.error("Please fill in both title and description.");
        setIsUpdating(false);
        return;
      }
      const res = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status >= 200 && res.status < 300) {
        onCloseAddModal();
        await refetch();
        toast.success("Todo added successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorObject = error as AxiosError<IErrorResponse>;
        const errorMessage = errorObject?.response?.data?.error?.message;
        toast.error(`${errorMessage || "Something went wrong, please try again"}`, {
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "#E2241B",
            color: "#fff",
            width: "fit-content",
          },
        });
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  //*Edit
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const onCloseEditModal = () => {
    setTodoToEdit({
      documentId: "",
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSubmitUpdatedTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description, documentId } = todoToEdit;
    try {
      if (!title.trim() || !description.trim()) {
        toast.error("Please fill in both title and description.");
        setIsUpdating(false);
        return;
      }
      const res = await axiosInstance.put(
        `/todos/${documentId}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status >= 200 && res.status < 300) {
        onCloseEditModal();
        await refetch();
        toast.success("Todo updated successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorObject = error as AxiosError<IErrorResponse>;
        const errorMessage = errorObject?.response?.data?.error?.message;
        toast.error(`${errorMessage || "Something went wrong, please try again"}`, {
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "#E2241B",
            color: "#fff",
            width: "fit-content",
          },
        });
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  //*Remove
  const onOpenRemoveModal = (documentId: string) => {
    setTodoToRemove({ documentId });
    setIsRemoveModalOpen(true);
  };

  const onCloseRemoveModal = () => {
    setTodoToRemove({
      documentId: "",
    });
    setIsRemoveModalOpen(false);
  };

  const onRemoveTodo = async () => {
    setIsUpdating(true);
    try {
      const res = await axiosInstance.delete(`/todos/${todoToRemove.documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status >= 200 && res.status < 300) {
        onCloseRemoveModal();
        await refetch();
        toast.success("Todo removed successfully!");
      }
    } catch (error) {
      const errorObject = error as AxiosError<IErrorResponse>;
      const errorMessage = errorObject?.response?.data?.error?.message;

      toast.error(`${errorMessage || "Something went wrong, please try again"}`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#E2241B",
          color: "#fff",
          width: "fit-content",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  //* Renders
  if (status === "pending")
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 8 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1 pb-12">
      {isRefetching && (
        <div className="flex justify-center items-center py-4">
          <span className="text-sm text-gray-500 animate-pulse">🔄 Updating...</span>
        </div>
      )}
      <div className="w-fit mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={onOpenAddModal}>
              Post new todo
            </Button>
          </div>
        )}
      </div>

      {data?.todos?.length > 0 ? (
        data.todos.map((todo: ITodo) => (
          <div key={todo.documentId} className="flex flex-col md:flex-row items-center justify-center md:justify-between hover:bg-gray-300 dark:hover:bg-gray-600 duration-300 p-3 rounded-md bg-gray-100 dark:bg-gray-700 even:bg-gray-200 dark:even:bg-gray-800 text-gray-800 dark:text-white">
            <p className="w-full font-semibold text-center md:text-left">{todo.title}</p>
            <p className="w-full font-semibold text-center md:text-left py-3">{todo.description}</p>
            <div className="flex items-center justify-center md:justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"} onClick={() => onOpenRemoveModal(todo.documentId)}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}

      {/* Add Todo Modal */}
      <Modal isOpen={isAddModalOpen} closeModal={onCloseAddModal} title="Add a new Todo">
        <form className="space-y-3" onSubmit={onSubmitAddTodo}>
          <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler} />
          <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler} />
          <div className="flex items-center w-full space-x-3 mt-4">
            <Button type="submit" size={"sm"} isLoading={isUpdating}>
              Add
            </Button>
            <Button type="button" variant={"cancel"} size={"sm"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal isOpen={isEditModalOpen} closeModal={onCloseEditModal} title="Edit This Todo">
        <form className="space-y-3" onSubmit={onSubmitUpdatedTodo}>
          <Input name="title" value={todoToEdit.title} onChange={onChangeHandler} />
          <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
          <div className="flex items-center w-full space-x-3 mt-4">
            <Button type="submit" size={"sm"} isLoading={isUpdating}>
              Update
            </Button>
            <Button type="button" variant={"cancel"} size={"sm"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Todo Modal */}
      <Modal isOpen={isRemoveModalOpen} closeModal={onCloseRemoveModal} title="Are you sure you want to remove this Todo from your Store?" description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action.">
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} size={"sm"} isLoading={isUpdating} onClick={onRemoveTodo}>
            Yes, remove
          </Button>
          <Button type="button" variant={"cancel"} size={"sm"} onClick={onCloseRemoveModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
