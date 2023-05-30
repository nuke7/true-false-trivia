"use client";

import { useState } from "react";
import axios from "axios";
import LoadingPage from "./loading";
import { useSearchContext } from "@/context/SearchContext";
import CategorySelect from "@/components/CategorySelect";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineDoneOutline } from "react-icons/md";

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

enum categoryList {
  "General Knowledge" = 9,
  "Books" = 10,
  "Film" = 11,
  "Music" = 12,
  "Television" = 14,
  "Video Games" = 15,
  "Board Games" = 16,
  "Computers" = 18,
  "Mythology" = 20,
  "Sports" = 21,
}

export default function TrueFalseApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect: boolean = answer === (currentQuestion.correct_answer === "True");
    setUserAnswers([...userAnswers, answer.toString()]);
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
      <h1 className="text-4xl py-4 font-bold text-center bg-gradient-to-r from-green-300 via-blue-200 to-red-400 bg-clip-text text-transparent">
        True or False App
      </h1>
      {!currentQuestion && !loading && <CategorySelect />}
      {currentQuestion && !loading && (
        <>
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-2xl font-bold text-center mt-8 w-[90%] mx-auto">
              Selected category: {categoryList[category]}
            </h2>
            <h3
              className="text-2xl font-bold text-center mt-8 w-[90%] sm:h-48 h-96 mx-auto"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            ></h3>
            <div className="text-center mx-auto py-8 w-[85%]">
              <button
                className="bg-green-700 p-2 m-2 hover:bg-green-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
                onClick={() => handleAnswer(true)}
              >
                True
              </button>
              <button
                className="bg-red-700 p-2 m-2 hover:bg-red-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
                onClick={() => handleAnswer(false)}
              >
                False
              </button>
            </div>
          </div>
        </>
      )}
      {loading && <LoadingPage />}
      {!loading && !currentQuestion && (
        <div className="text-center mx-auto w-[85%] pb-8 mb-8">
          {questions.length > 0 && (
            <p className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-400 to-red-400 bg-clip-text text-transparent text-center mt-8 w-[90%] min-h-24 mx-auto">
              No more questions! You scored {score} out of {questions.length}.
            </p>
          )}
          <div className="text-center mx-auto py-8 w-[85%]">
            <button
              className="bg-blue-500 p-2 m-2 hover:bg-blue-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
              onClick={() => startNewGame()}
            >
              New Game
            </button>
          </div>
          {questions.map((question, index) => {
            return (
              <div key={index}>
                <div className="flex flex-row items-baseline justify-center">
                  {
                    <span>
                      <span>
                        {userAnswers[index].charAt(0).toUpperCase() +
                          userAnswers[index].slice(1) ===
                          question.correct_answer && (
                          <MdOutlineDoneOutline className="text-green-500 text-3xl -mb-2" />
                        )}
                      </span>
                      <span>
                        {userAnswers[index].charAt(0).toUpperCase() +
                          userAnswers[index].slice(1) !==
                          question.correct_answer && (
                          <RxCross2 className="text-red-500 text-3xl -mb-2" />
                        )}
                      </span>
                    </span>
                  }
                  <p
                    className="text-lg font-bold text-center mt-8 w-[90%] mx-auto"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  ></p>
                </div>
                <span>The correct answer is: </span>
                <span className="text-md font-bold italic text-center mt-">
                  {question.correct_answer === "True" ? "True" : "False"}
                </span>
                <p className="text-md text-slate-500">
                  <span>Your answer was: </span>
                  <span className="text-md font-bold italic text-center">
                    {userAnswers[index]}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

