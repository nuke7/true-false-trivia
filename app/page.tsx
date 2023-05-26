"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "./loading";
import { useSearchContext } from "@/context/SearchContext";
import CategorySelect from "@/components/CategorySelect";

type ApiResponse = {
  response_code: number;
  results: Question[];
};

type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export default function TrueFalseApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { category } = useSearchContext();

  const fetchQuestions = async (numQuestions: number) => {
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
  };
  useEffect(() => {
    fetchQuestions(10);
  }, []);

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect: boolean = answer === (currentQuestion.correct_answer === "True");
    setUserAnswers([...userAnswers, answer]);
    setScore(score + (isCorrect ? 1 : 0));
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const getCurrentQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      return questions[currentQuestionIndex];
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();

  const startNewGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    fetchQuestions(10);
  };

  return (
    <div>
      <h1 className="text-4xl py-4 font-bold text-center">True or False App</h1>
      <CategorySelect />
      {currentQuestion && !loading && (
        <>
          <h3
            className="text-2xl font-bold text-center mt-8 w-[90%] h-24 mx-auto"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          ></h3>
          <div className="text-center mx-auto py-8 w-[85%]">
            <button
              className="bg-green-700 p-2 m-2 hover:bg-blue-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
              onClick={() => handleAnswer(true)}
            >
              True
            </button>
            <button
              className="bg-red-700 p-2 m-2 hover:bg-blue-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
              onClick={() => handleAnswer(false)}
            >
              False
            </button>
          </div>
        </>
      )}
      {loading && <LoadingPage />}
      {!loading && !currentQuestion && (
        <div className="text-center mx-auto w-[85%]">
          <p className="text-2xl font-bold text-center mt-8 w-[90%] h-24 mx-auto">
            No more questions! You scored {score} out of {questions.length}.
          </p>
          {questions.map((question, index) => {
            return (
              <div key={index}>
                <p
                  className="text-lg font-bold text-center mt-8 w-[90%] mx-auto"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                ></p>
                <p>{question.correct_answer === "True" ? "True!" : "False!"}</p>
              </div>
            );
          })}
          <div className="text-center mx-auto py-8 w-[85%]">
            <button
              className="bg-blue-500 p-2 m-2 hover:bg-blue-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
              onClick={() => startNewGame()}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

