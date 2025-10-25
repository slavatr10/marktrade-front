export interface Exercise {
  id: string;
  number: number;
  questions: Question[];
}

export interface Question {
  id: string;
  value: string;
  photo: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  value: string;
  explanation: string;
  isCorrect: boolean;
}

export interface SubmitExercise {
  correctAnswer: CorrectAnswer;
  count: number;
}

export interface CorrectAnswer extends Answer {
  questionId: string;
}
