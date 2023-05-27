import { Component, ComponentProps, JSX, ValidComponent } from "solid-js"

export type AsProp = keyof JSX.IntrinsicElements | Component<any>

export type RefProp<T> = JSX.HTMLAttributes<T>["ref"]

export interface ClassProps {
  class?: string
  classList?: { [className: string]: boolean | undefined }
}

export type BasicElementProps<
  T extends ValidComponent,
  // eslint-disable-next-line @typescript-eslint/ban-types
  CustomProps = {}
> = CustomProps &
  ClassProps &
  Omit<ComponentProps<T>, keyof ClassProps | keyof CustomProps> & {
    // TODO: Infer type of 'ref' based on 'as'
    as?: T
    ref?: T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T] extends JSX.HTMLAttributes<infer U>
        ? RefProp<U>
        : never
      : any
    children?: JSX.Element
  }

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      sortable: true
    }
  }
}

export type Directive = (node: any) => {
  destroy: () => void
}
