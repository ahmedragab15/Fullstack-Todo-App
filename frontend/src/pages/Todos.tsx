import { ChangeEvent, useState } from "react";
import Paginator from "../components/Paginator";
import TodoSkeleton from "../components/TodoSkeleton";
import useCustomQuery from "../hooks/useCustomQuery";
import { ITodo } from "../interfaces";

import axiosInstance from "../config/axios.config";
import { faker } from "@faker-js/faker";
import Button from "../components/ui/Button";

const TodosPage = () => {
  //* JWT
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const token = userData?.jwt;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("DESC");

  //*fetch data
  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`,`${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onGenerateTodos = async () => {
    for (let i = 0; i < 100; i++) {
      try {
        await axiosInstance.post(
          "/todos",
          { data: { title: faker.word.words(5), description: faker.lorem.paragraph(2) } },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => setPageSize(+e.target.value);

  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);

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
      <div className="flex items-center justify-between space-x-2">
        <Button size={"sm"} onClick={onGenerateTodos} title="Generate 100 records">
          Generate todos
        </Button>
        <div className="flex items-center justify-between space-x-2 text-md">
          <select className="border-2 border-indigo-600 rounded-md p-2" value={sortBy} onChange={onChangeSortBy}>
            <option disabled>Sort by</option>
            <option value="DESC">Latest</option>
            <option value="ASC">Oldest</option>
          </select>

          <select className="border-2 border-indigo-600 rounded-md p-2" value={pageSize} onChange={onChangePageSize}>
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="my-20 space-y-6">
        {data.data.length ? (
          data.data.map((todo: ITodo) => (
            <div key={todo.documentId} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
              <h3 className="w-full font-semibold">{todo.title}</h3>
              <p className="w-full font-semibold">{todo.description}</p>
            </div>
          ))
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator page={page} pageCount={data?.meta?.pagination?.pageCount} total={data?.meta?.pagination?.total} isLoading={isLoading || isFetching} onClickPrev={onClickPrev} onClickNext={onClickNext} />
      </div>
    </section>
  );
};

export default TodosPage;
