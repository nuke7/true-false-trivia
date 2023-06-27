"use client";

import { useState, ReactNode } from "react";
import { SearchContext } from "./SearchContext";

interface IProps {
  children: ReactNode;
}

const SearchContextProvider = ({ children }: IProps) => {
  const [category, setCategory] = useState(9);

  //TODO - add a fetch here

  /*   const fetchQuestions = async (numQuestions: number) => {
    try {
      const uniqueQuestions: Question[] = [];
      while (uniqueQuestions.length < numQuestions) {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `https://opentdb.com/api.php?amount=1&category=${category}&type=boolean`
        );
        const newQuestion = response.data.results[0];
        const isDuplicate = uniqueQuestions.some(
          (question) => question.question === newQuestion.question
        );
        if (!isDuplicate) {
          uniqueQuestions.push(newQuestion);
        }
      }
      setQuestions(uniqueQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }; */

  const defineCategory = (category: number) => {
    setCategory(category);
  };

  return (
    <SearchContext.Provider value={{ category, defineCategory }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
