"use client";

import { useState, ReactNode } from "react";
import { SearchContext } from "./SearchContext";

interface IProps {
  children: ReactNode;
}

const SearchContextProvider = ({ children }: IProps) => {
  const [category, setCategory] = useState(9);

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
