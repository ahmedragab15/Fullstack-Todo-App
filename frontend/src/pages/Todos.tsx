import { ChangeEvent, useState } from "react";
import Paginator from "../components/Paginator";
import TodoSkeleton from "../components/TodoSkeleton";
import useCustomQuery from "../hooks/useCustomQuery";
import { IErrorResponse, ITodo } from "../interfaces";
import Button from "../components/ui/Button";
import axiosInstance from "../config/axios.config";
import { faker } from "@faker-js/faker";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

const TodosPage = () => {
  //* JWT
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("DESC");
  const [generatedTodosNumber, setGeneratedTodosNumber] = useState(10);

  //*fetch data
  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const onClickPrev = () => setPage((prev) => prev - 1);

  const onClickNext = () => setPage((prev) => prev + 1);

  const onClickFirst = () => setPage(1);

  const onClickLast = () => setPage(data?.meta?.pagination?.pageCount);

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => setPageSize(+e.target.value);

  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);

  const onGenerateTodos = async () => {
    toast.loading(`${generatedTodosNumber} Todos been Generated..`,{
      duration:1000
    });
    for (let i = 0; i < generatedTodosNumber; i++) {
      try {
        await axiosInstance.post(
          "/todos",
          { data: { title: faker.word.words(5), description: faker.lorem.paragraph(2) } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      }
    }
    toast.success(`${generatedTodosNumber} Todos Generated Successfully`)
  };

  //* Renders
  if (isLoading)
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <section>
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center justify-between space-x-2 text-md">
          <Input className="w-20 border-2 border-blue-500 dark:border-indigo-600 rounded-md p-2 dark:bg-gray-800" max={100} type="number" value={generatedTodosNumber} onChange={(e) => (+e.target.value >= 100 ? setGeneratedTodosNumber(100) : setGeneratedTodosNumber(+e.target.value))} onKeyDown={(e) => e.key === "Enter" && onGenerateTodos()} />
          <Button size={"sm"} onClick={onGenerateTodos} title="Generate 100 records" isLoading={isLoading || isFetching}>
            Generate {generatedTodosNumber} todos
          </Button>
        </div>

        <div className="flex items-center justify-between space-x-2 text-md">
          <select className="border-2 border-blue-500 dark:border-indigo-600 rounded-md p-2 dark:bg-gray-800" value={sortBy} onChange={onChangeSortBy}>
            <option disabled>Sort by</option>
            <option value="DESC">Latest</option>
            <option value="ASC">Oldest</option>
          </select>

          <select className="border-2 border-blue-500 dark:border-indigo-600 rounded-md p-2 dark:bg-gray-800" value={pageSize} onChange={onChangePageSize}>
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="py-12 space-y-6">
        {data?.data?.length > 0 ? (
          data.data.map((todo: ITodo) => (
            <div key={todo.documentId} className="flex flex-col md:flex-row items-center justify-center md:justify-between hover:bg-gray-300 dark:hover:bg-gray-600 duration-300 p-3 rounded-md bg-gray-100 dark:bg-gray-700 even:bg-gray-200 dark:even:bg-gray-800 text-gray-800 dark:text-white">
              <h3 className="w-full font-semibold text-center md:text-left">{todo.title}</h3>
              <p className="w-full font-semibold text-center md:text-left py-3">{todo.description}</p>
            </div>
          ))
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator page={page} pageCount={data?.meta?.pagination?.pageCount} total={data?.meta?.pagination?.total} isLoading={isLoading || isFetching} onClickPrev={onClickPrev} onClickNext={onClickNext} onClickFirst={onClickFirst} onClickLast={onClickLast} />
      </div>
    </section>
  );
};

export default TodosPage;
