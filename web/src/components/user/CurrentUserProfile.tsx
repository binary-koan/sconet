import { Component } from "solid-js"
import { CurrentUserQuery } from "../../graphql-types.ts"

export const CurrentUserProfile: Component<{
  data: CurrentUserQuery
}> = (props) => {
  const currentUser = () => props.data.currentUser!

  return <div class="bg-white py-2 px-4 shadow-sm">{currentUser().email}</div>
}
