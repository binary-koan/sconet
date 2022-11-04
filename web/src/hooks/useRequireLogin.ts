import { useNavigate, useLocation } from "@solidjs/router"
import { createEffect } from "solid-js"
import { isLoggedIn } from "../utils/auth"

export function useRequireLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  createEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", {
        replace: true,
        state: { returnTo: [location.pathname, location.search, location.hash].join("") }
      })
    }
  })
}
