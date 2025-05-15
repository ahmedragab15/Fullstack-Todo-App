import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";

const TodoList = () => {
  //* JWT
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

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

  //*fetch data
  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.documentId}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  //* Handlers

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
      [name]: value,
    });
  };

  const onSubmitUpdatedTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description, documentId } = todoToEdit;
    try {
      const res = await axiosInstance.put(
        `/todos/${documentId}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) onCloseEditModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };


  //*Remove
  const onOpenRemoveModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsRemoveModalOpen(true);
  };

  const onCloseRemoveModal = () => {
    setTodoToEdit({
      documentId: "",
      title: "",
      description: "",
    });
    setIsRemoveModalOpen(false);
  };

  const onRemoveTodo = async () => {
    setIsUpdating(true);
    try {
      const res = await axiosInstance.delete(
        `/todos/${todoToEdit.documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 204) onCloseRemoveModal();
    } catch (error) {
      console.log(error);
    }finally{
      setIsUpdating(false);
    }
  };

  //* Renders
  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div key={todo.documentId} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
            <p className="w-full font-semibold">{todo.title}</p>
            <p className="w-full font-semibold">{todo.description}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"} onClick={() => onOpenRemoveModal(todo)}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}

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
