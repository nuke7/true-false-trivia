
import { createContext, useContext } from "react";

interface ISearchContext {
  category: number;
  defineCategory: (category: number) => void;
}

export const SearchContext = createContext<ISearchContext>({
  category: 9,
  defineCategory(category) {},
});

export const useSearchContext = () => useContext(SearchContext);