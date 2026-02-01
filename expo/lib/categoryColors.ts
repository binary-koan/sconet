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
  gray: "bg-gray-500/40",
  red: "bg-red-500/40",
  orange: "bg-orange-500/40",
  amber: "bg-amber-500/40",
  yellow: "bg-yellow-500/40",
  lime: "bg-lime-500/40",
  green: "bg-green-500/40",
  emerald: "bg-emerald-500/40",
  teal: "bg-teal-500/40",
  cyan: "bg-cyan-500/40",
  sky: "bg-sky-500/40",
  blue: "bg-blue-500/40",
  indigo: "bg-indigo-500/40",
  violet: "bg-violet-500/40",
  purple: "bg-purple-500/40",
  fuchsia: "bg-fuchsia-500/40",
  pink: "bg-pink-500/40",
  rose: "bg-rose-500/40"
}
