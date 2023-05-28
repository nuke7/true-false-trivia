"use client";
import { useSearchContext } from "@/context/SearchContext";

const CategorySelect = () => {
  const { category, defineCategory } = useSearchContext();

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-center mb-4">Select a category</h2>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] p-2.5 mx-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-"
        value={category}
        onChange={(e) => defineCategory(+e.target.value)}
      >
        <option value={9}>General Knowledge</option>
        <option value={10}>Books</option>
        <option value={11}>Film</option>
        <option value={12}>Music</option>
        <option value={14}>Television</option>
        <option value={15}>Video Games</option>
        <option value={16}>Board Games</option>
        <option value={18}>Computers</option>
        <option value={20}>Mythology</option>
        <option value={21}>Sports</option>
      </select>
    </div>
  );
};

export default CategorySelect;
