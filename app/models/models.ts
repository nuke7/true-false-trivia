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