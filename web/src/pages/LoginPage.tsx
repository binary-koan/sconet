import { createForm, Form } from "@modular-forms/solid"
import { startAuthentication } from "@simplewebauthn/browser"
import { Title } from "@solidjs/meta"
import { useLocation, useNavigate } from "@solidjs/router"
import { TbFingerprint } from "solid-icons/tb"
import { Component, createEffect, createSignal, Show } from "solid-js"
import toast from "solid-toast"
import logoImage from "../assets/logo.svg"
import { Button } from "../components/base/Button"
import { FieldError } from "../components/forms/FieldError"
import FormInput from "../components/forms/FormInput"
import { LoginMutationVariables } from "../graphql-types"
import { useGenerateCredentialLoginOptionsMutation } from "../graphql/mutations/generateCredentialLoginOptions"
import { useLoginMutation } from "../graphql/mutations/loginMutation"
import { useLoginViaCredentialMutation } from "../graphql/mutations/loginViaCredentialMutation"
import { isLoggedIn, lastUserId, setLoginToken } from "../utils/auth"
import { loadTurnstile, turnstileError, turnstileLoaded } from "../utils/turnstile"

type LoginFormValues = Omit<LoginMutationVariables, "turnstileToken">

const LoginPage: Component = () => {
  loadTurnstile()

  const [token, setToken] = createSignal<string>()
  const [submittedValues, setSubmittedValues] = createSignal<{ email: string; password: string }>()

  const navigate = useNavigate()
  const location = useLocation<{ returnTo?: string }>()

  const login = useLoginMutation({
    onSuccess: (data) => {
      setLoginToken(data.login)
      setSubmittedValues(undefined)
      toast.success("Logged in")
    },
    onError: (error) => {
      setSubmittedValues(undefined)
      toast.error(error.message)
    }
  })

  const startCredentialLogin = useGenerateCredentialLoginOptionsMutation({
    onSuccess: async (data) => {
      const response = await startAuthentication(data.generateCredentialLoginOptions)
      await loginViaCredential({ response })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const loginViaCredential = useLoginViaCredentialMutation({
    onSuccess: (data) => {
      setLoginToken(data.loginViaCredential)
      setSubmittedValues(undefined)
      toast.success("Logged in")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const [form] = createForm<LoginFormValues>()

  let turnstileContainer: HTMLDivElement | undefined = undefined

  createEffect(() => {
    if (isLoggedIn()) {
      navigate(location.state?.returnTo || "/")
    }
  })

  createEffect(() => {
    if (turnstileLoaded() && turnstileContainer) {
      window.turnstile?.render(turnstileContainer, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
        callback: (token) => setToken(token)
      })
    }
  })

  createEffect(() => {
    if (token() && submittedValues()) {
      login({
        turnstileToken: token()!,
        ...submittedValues()!
      })
    }
  })

  return (
    <>
      <Title>Login</Title>

      <div class="flex min-h-screen flex-col pb-20">
        <img class="mx-auto mt-8 mb-auto w-36" src={logoImage} />

        <div class="mx-6 mt-2 mb-10 rounded bg-white p-6 shadow-2xl lg:mx-auto lg:w-96">
          <h1 class="mb-4 flex items-center text-lg font-bold lg:text-2xl">Login</h1>
          <Form
            of={form}
            onSubmit={(values) => {
              setSubmittedValues(values)
            }}
          >
            <FormInput of={form} type="text" name="email" label="Email" />
            <FormInput of={form} type="password" name="password" label="Password" />

            <div ref={turnstileContainer} />

            <Button
              type="submit"
              colorScheme="primary"
              disabled={Boolean(submittedValues() || login.loading || turnstileError())}
            >
              Login
            </Button>

            <Show when={turnstileError()}>
              <FieldError error={`Error verifying browser: ${turnstileError()}`} />
            </Show>
          </Form>
        </div>

        <Show when={lastUserId()}>
          <button
            class="mx-auto rounded-full border-2 border-gray-300 p-4 text-gray-400 transition hover:bg-gray-200"
            onClick={() => startCredentialLogin({ userId: lastUserId()! })}
          >
            <TbFingerprint size="2em" />
          </button>
        </Show>

        <div class="mt-auto" />
      </div>
    </>
  )
}

export default LoginPage
