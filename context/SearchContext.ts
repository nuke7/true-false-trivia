
import { Question } from "@/app/models/models";
import { createContext, useContext } from "react";

interface ISearchContext {
  category: number;
  defineCategory: (category: number) => void;
  questions: Question[],
  loading: boolean;
  fetchQuestions: () => void;
}

export const SearchContext = createContext<ISearchContext>({
  category: 9,
  defineCategory(category) {},
  questions: [],
  loading: false,
  fetchQuestions() {},
});

export const useSearchContext = () => useContext(SearchContext);