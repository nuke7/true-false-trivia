"use client";

import { useState, ReactNode } from "react";
import { SearchContext } from "./SearchContext";
import { ApiResponse, Question } from "@/app/models/models";
import axios from "axios";

interface IProps {
  children: ReactNode;
}

const SearchContextProvider = ({ children }: IProps) => {
  const [category, setCategory] = useState(9);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `https://opentdb.com/api.php?amount=10&category=${category}&type=boolean`
      );
      if (response.data.response_code === 0) {
        setQuestions(response.data.results);
        setLoading(false);
      } else {
        console.error("Error fetching questions: Not enough questions");
        alert("Error fetching questions : Not enough questions");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const defineCategory = (category: number) => {
    setCategory(category);
  };

  return (
    <SearchContext.Provider
      value={{ category, defineCategory, questions, loading, fetchQuestions }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
