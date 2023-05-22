"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchQuestions = async (numQuestions: number) => {
      try {
        const uniqueQuestions: Question[] = [];
        while (uniqueQuestions.length < numQuestions) {
          const response = await axios.get<ApiResponse>(
            `https://opentdb.com/api.php?amount=1&type=boolean`
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
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions(10);
  }, []);

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === (currentQuestion.correct_answer === "True");
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

  return (
    <div>
      <h1>True or False App</h1>
      {currentQuestion ? (
        <>
          <h3>{currentQuestion.question}</h3>
          <button onClick={() => handleAnswer(true)}>True</button>
          <button onClick={() => handleAnswer(false)}>False</button>
        </>
      ) : (
        <p>
          No more questions! You scored {score} out of {questions.length}.
        </p>
      )}
    </div>
  );
}

