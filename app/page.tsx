"use client";

import { useState } from "react";
import axios from "axios";
import LoadingPage from "./loading";
import { useSearchContext } from "@/context/SearchContext";
import CategorySelect from "@/components/CategorySelect";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineDoneOutline } from "react-icons/md";
import { ApiResponse, Question, categoryList } from "./models/models";

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
      <h1 className="bg-gradient-to-r from-green-300 via-blue-200 to-red-400 bg-clip-text py-4 text-center text-4xl font-bold text-transparent">
        True or False App
      </h1>
      {!currentQuestion && !loading && <CategorySelect />}
      {currentQuestion && !loading && (
        <>
          <div className="flex flex-col items-center justify-between">
            <h2 className="mx-auto mt-8 w-[90%] text-center text-2xl font-bold">
              Selected category: {categoryList[category]}
            </h2>
            <span className="mx-auto mt-8 w-[90%] text-center text-2xl font-bold">
              Question {currentQuestionIndex + 1} of 10:
            </span>
            <h3
              className="mx-auto mt-8 h-72 w-[90%] text-center text-2xl font-bold sm:h-48"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            ></h3>
            <div className="mx-auto w-[85%] py-8 text-center">
              <button
                className="mx-8 rounded-md bg-green-700 p-2 hover:bg-green-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
                onClick={() => handleAnswer(true)}
              >
                True
              </button>
              <button
                className="mx-8 rounded-md bg-red-700 p-2 hover:bg-red-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
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
        <div className="mx-auto mb-8 w-[85%] pb-8 text-center">
          <button
            className="m-2 rounded-md bg-blue-500 p-2 hover:bg-blue-200 hover:text-slate-700 active:bg-slate-900 active:text-slate-400"
            onClick={() => startNewGame()}
          >
            New Game
          </button>
          {questions.length > 0 && (
            <p className="min-h-24 mx-auto mt-8 w-[90%] bg-gradient-to-r from-green-300 via-blue-400 to-red-400 bg-clip-text text-center text-2xl font-bold text-transparent">
              No more questions! You scored {score} out of {questions.length}.
            </p>
          )}
          <div className="mx-auto w-[85%] py-8 text-center"></div>
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
                          <MdOutlineDoneOutline className="-mb-2 text-3xl text-green-500" />
                        )}
                      </span>
                      <span>
                        {userAnswers[index].charAt(0).toUpperCase() +
                          userAnswers[index].slice(1) !==
                          question.correct_answer && (
                          <RxCross2 className="-mb-2 text-3xl text-red-500" />
                        )}
                      </span>
                    </span>
                  }
                  <p
                    className="mx-auto mt-8 w-[90%] text-center text-lg font-bold"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  ></p>
                </div>
                <span>The correct answer is: </span>
                <span className="text-md mt- text-center font-bold italic">
                  {question.correct_answer === "True" ? "True" : "False"}
                </span>
                <p className="text-md text-slate-500">
                  <span>Your answer was: </span>
                  <span className="text-md text-center font-bold italic">
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

