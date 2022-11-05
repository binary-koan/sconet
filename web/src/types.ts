import { JSX } from "solid-js"

export type RefProp<T> = JSX.HTMLAttributes<T>["ref"]

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      sortable: true
      form: true
    }
  }
}
