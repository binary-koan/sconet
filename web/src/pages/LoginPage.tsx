import { createForm } from "@felte/solid"
import { Title } from "@solidjs/meta"
import { useLocation, useNavigate } from "@solidjs/router"
import { Component, createEffect } from "solid-js"
import toast from "solid-toast"
import { Button } from "../components/base/Button"
import FormInput from "../components/forms/FormInput"
import { useLoginMutation } from "../graphql/mutations/loginMutation"
import { isLoggedIn, setLoginToken } from "../utils/auth"
import { usedAsDirective } from "../utils/usedAsDirective"

const LoginPage: Component = () => {
  const navigate = useNavigate()
  const location = useLocation<{ returnTo?: string }>()

  const [login, { loading }] = useLoginMutation({
    onSuccess: (data) => {
      setLoginToken(data.login)
      toast.success("Logged in")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { form } = createForm({
    onSubmit: (values) => {
      login(values)
    }
  })

  usedAsDirective(form)

  createEffect(() => {
    if (isLoggedIn()) {
      navigate(location.state?.returnTo || "/")
    }
  })

  return (
    <>
      <Title>Login</Title>

      <div class="min-h-screen flex flex-col justify-center pb-20">
        <div class="bg-white m-6 rounded p-6 shadow-2xl lg:my-0 lg:mx-auto lg:w-96">
          <h1 class="mb-4 flex items-center text-lg font-bold lg:text-2xl">Login</h1>
          <form use:form>
            <FormInput type="text" name="email" label="Email" />
            <FormInput type="password" name="password" label="Password" />

            <Button type="submit" colorScheme="primary" disabled={loading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
