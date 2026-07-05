import { Component } from "solid-js"
import { CurrentUserQuery } from "../../graphql-types"

export const CurrentUserProfile: Component<{
  data: CurrentUserQuery
}> = (props) => {
  const currentUser = () => props.data.currentUser!

  return (
    <div class="mx-2 rounded-3xl border border-gray-100 bg-white py-2 px-4">
      {currentUser().email}
    </div>
  )
}
