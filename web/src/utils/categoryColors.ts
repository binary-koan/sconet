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
  | "indigo"
  | "fuchsia"
  | "amber"
  | "lime"
  | "emerald"
  | "sky"
  | "violet"
  | "rose"

export const CATEGORY_BACKGROUND_COLORS: { [key in CategoryColor]: string } = {
  gray: "bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500"
}

export const CATEGORY_PALE_BACKGROUND_COLORS: { [key in CategoryColor]: string } = {
  gray: "bg-gray-200",
  red: "bg-red-200",
  orange: "bg-orange-200",
  amber: "bg-amber-200",
  yellow: "bg-yellow-200",
  lime: "bg-lime-200",
  emerald: "bg-emerald-200",
  green: "bg-green-200",
  teal: "bg-teal-200",
  blue: "bg-blue-200",
  cyan: "bg-cyan-200",
  sky: "bg-sky-200",
  violet: "bg-violet-200",
  purple: "bg-purple-200",
  indigo: "bg-indigo-200",
  fuchsia: "bg-fuchsia-200",
  pink: "bg-pink-200",
  rose: "bg-rose-200"
}

export const CATEGORY_COLORS = Object.keys(CATEGORY_BACKGROUND_COLORS)
