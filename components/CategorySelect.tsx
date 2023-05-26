"use client";
import { useSearchContext } from "@/context/SearchContext";
import { useState } from "react";

const CategorySelect = () => {
  const [triviaCategory, setTriviaCategory] = useState(9);

  const { category, defineCategory } = useSearchContext();

  return (
    <div>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] mx-auto my-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-"
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
