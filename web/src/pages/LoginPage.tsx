import { createForm, Form } from "@modular-forms/solid"
import { Title } from "@solidjs/meta"
import { useLocation, useNavigate } from "@solidjs/router"
import { Component, createEffect } from "solid-js"
import toast from "solid-toast"
import { Button } from "../components/base/Button"
import FormInput from "../components/forms/FormInput"
import { LoginMutationVariables } from "../graphql-types"
import { useLoginMutation } from "../graphql/mutations/loginMutation"
import { isLoggedIn, setLoginToken } from "../utils/auth"

type LoginFormValues = LoginMutationVariables

const LoginPage: Component = () => {
  const navigate = useNavigate()
  const location = useLocation<{ returnTo?: string }>()

  const login = useLoginMutation({
    onSuccess: (data) => {
      setLoginToken(data.login)
      toast.success("Logged in")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const form = createForm<LoginFormValues>()

  createEffect(() => {
    if (isLoggedIn()) {
      navigate(location.state?.returnTo || "/")
    }
  })

  return (
    <>
      <Title>Login</Title>

      <div class="flex min-h-screen flex-col justify-center pb-20">
        <div class="m-6 rounded bg-white p-6 shadow-2xl lg:my-0 lg:mx-auto lg:w-96">
          <h1 class="mb-4 flex items-center text-lg font-bold lg:text-2xl">Login</h1>
          <Form of={form} onSubmit={login}>
            <FormInput of={form} type="text" name="email" label="Email" />
            <FormInput of={form} type="password" name="password" label="Password" />

            <Button type="submit" colorScheme="primary" disabled={login.loading}>
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
