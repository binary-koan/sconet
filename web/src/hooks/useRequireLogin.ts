import { useNavigate, useLocation } from "@solidjs/router"
import { onMount } from "solid-js"
import { isLoggedIn } from "../utils/auth"

export function useRequireLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  onMount(() => {
    if (!isLoggedIn()) {
      navigate("/login", {
        replace: true,
        state: { returnTo: [location.pathname, location.search, location.hash].join("") }
      })
    }
  })
}
