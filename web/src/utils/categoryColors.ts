export type CategoryColor =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "cyan"
  | "purple"
  | "pink"

export const CATEGORY_BACKGROUND_COLORS: { [key in CategoryColor]: string } = {
  gray: "bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  purple: "bg-indigo-500",
  pink: "bg-pink-500"
}

export const CATEGORY_PALE_BACKGROUND_COLORS: { [key in CategoryColor]: string } = {
  gray: "bg-gray-200",
  red: "bg-red-200",
  orange: "bg-orange-200",
  yellow: "bg-yellow-200",
  green: "bg-green-200",
  teal: "bg-teal-200",
  blue: "bg-blue-200",
  cyan: "bg-cyan-200",
  purple: "bg-indigo-200",
  pink: "bg-pink-200"
}

export const CATEGORY_COLORS = Object.keys(CATEGORY_BACKGROUND_COLORS)
