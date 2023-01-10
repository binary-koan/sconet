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
  gray: "bg-gray-100",
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  teal: "bg-teal-100",
  blue: "bg-blue-100",
  cyan: "bg-cyan-100",
  purple: "bg-indigo-100",
  pink: "bg-pink-100"
}

export const CATEGORY_COLORS = Object.keys(CATEGORY_BACKGROUND_COLORS)
