import { Exercise, Solution } from "./types";

export const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Quadratic Equation Solving",
    statement:
      "Solve the quadratic equation: x² - 5x + 6 = 0. Show all steps in your solution.",
    category: "Algebra",
    level: "intermediate",
    status: "open",
    createdAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "2",
    title: "Triangle Area Calculation",
    statement:
      "Calculate the area of a triangle with sides a = 5 cm, b = 12 cm, and c = 13 cm using Heron's formula.",
    category: "Geometry",
    level: "beginner",
    status: "open",
    createdAt: new Date("2024-01-14T14:20:00Z"),
  },
  {
    id: "3",
    title: "Derivative of Composite Function",
    statement:
      "Find the derivative of f(x) = sin(3x² + 2x - 1) using the chain rule.",
    category: "Calculus",
    level: "advanced",
    status: "pending",
    createdAt: new Date("2024-01-13T09:45:00Z"),
  },
  {
    id: "4",
    title: "Linear System Solution",
    statement: "Solve the system of equations:\n2x + 3y = 7\n4x - y = 5",
    category: "Algebra",
    level: "intermediate",
    status: "finished",
    createdAt: new Date("2024-01-12T16:15:00Z"),
  },
  {
    id: "5",
    title: "Probability Calculation",
    statement:
      "A bag contains 5 red balls, 3 blue balls, and 2 green balls. What is the probability of drawing 2 red balls without replacement?",
    category: "Statistics",
    level: "intermediate",
    status: "open",
    createdAt: new Date("2024-01-11T11:30:00Z"),
  },
  {
    id: "6",
    title: "Circle Equation",
    statement:
      "Find the equation of a circle with center at (3, -2) and radius 5.",
    category: "Geometry",
    level: "beginner",
    status: "open",
    createdAt: new Date("2024-01-10T13:20:00Z"),
  },
];

export const mockSolutions: Solution[] = [
  {
    id: "1",
    exerciseId: "1",
    content:
      "Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\nFor x² - 5x + 6 = 0:\na = 1, b = -5, c = 6\nx = (5 ± √(25 - 24)) / 2 = (5 ± 1) / 2\nSolutions: x = 3 or x = 2",
    createdAt: new Date("2024-01-15T12:00:00Z"),
    isCorrect: true,
  },
  {
    id: "2",
    exerciseId: "1",
    content:
      "Factoring method:\nx² - 5x + 6 = 0\n(x - 2)(x - 3) = 0\nTherefore: x = 2 or x = 3",
    createdAt: new Date("2024-01-15T14:30:00Z"),
    isCorrect: true,
  },
  {
    id: "3",
    exerciseId: "2",
    content:
      "Using Heron's formula:\ns = (a + b + c) / 2 = (5 + 12 + 13) / 2 = 15\nArea = √(s(s-a)(s-b)(s-c)) = √(15 × 10 × 3 × 2) = √900 = 30 cm²",
    createdAt: new Date("2024-01-14T16:45:00Z"),
    isCorrect: true,
  },
  {
    id: "4",
    exerciseId: "4",
    content:
      "From equation 1: 2x + 3y = 7\nFrom equation 2: 4x - y = 5\nMultiply eq 2 by 3: 12x - 3y = 15\nAdd equations: 14x = 22, so x = 11/7\nSubstitute back: y = (7 - 2(11/7))/3 = 5/21",
    createdAt: new Date("2024-01-12T18:20:00Z"),
    isCorrect: true,
  },
];

export const categories = [
  "Algebra",
  "Geometry",
  "Calculus",
  "Statistics",
  "Number Theory",
  "Trigonometry",
];

export const levels = ["beginner", "intermediate", "advanced"] as const;
