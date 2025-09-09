import { Directive } from "../types.ts"

// Because of how directive types work, TypeScript doesn't think the variable is used.
// This is just a placeholder function to prevent those unused variable warnings,
// while making sure the type of the directive is vaguely reasonable
export function usedAsDirective(directive: Directive) {
  return directive
}
