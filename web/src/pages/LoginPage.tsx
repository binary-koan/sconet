import { createForm, Form } from "@modular-forms/solid"
import { startAuthentication } from "@simplewebauthn/browser"
import { Title } from "@solidjs/meta"
import { useLocation, useNavigate } from "@solidjs/router"
import { IconFingerprint } from "@tabler/icons-solidjs"
import { Component, createEffect, createSignal, Show } from "solid-js"
import toast from "solid-toast"
// import { TURNSTILE_SITEKEY } from "../../env"
import logoImage from "../assets/logo.svg"
import { Button } from "../components/base/Button"
// import { FieldError } from "../components/forms/FieldError"
import FormInput from "../components/forms/FormInput"
import { LoginMutationVariables } from "../graphql-types"
import { useGenerateCredentialLoginOptionsMutation } from "../graphql/mutations/generateCredentialLoginOptions"
import { useLoginMutation } from "../graphql/mutations/loginMutation"
import { useLoginViaCredentialMutation } from "../graphql/mutations/loginViaCredentialMutation"
import { isLoggedIn, lastUserEmail, setLoginToken } from "../utils/auth"
import { fixAssetPath } from "../utils/fixAssetPath"
// import { loadTurnstile, turnstileError, turnstileLoaded } from "../utils/turnstile"

type LoginFormValues = Omit<LoginMutationVariables, "turnstileToken">

const LoginPage: Component = () => {
  const [submittedValues, setSubmittedValues] = createSignal<{ email: string; password: string }>()

  const navigate = useNavigate()
  const location = useLocation<{ returnTo?: string }>()

  const login = useLoginMutation({
    onSuccess: (data) => {
      setLoginToken(data.login.user.token, data.login.user.email)
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
      const response = await startAuthentication(data.credentialLoginStart.options)
      await loginViaCredential({ email: lastUserEmail()!, response })
    }
  })

  const loginViaCredential = useLoginViaCredentialMutation({
    onSuccess: (data) => {
      setLoginToken(data.login.user.token, data.login.user.email)
      setSubmittedValues(undefined)
      toast.success("Logged in")
    }
  })

  const [form] = createForm<LoginFormValues>()

  createEffect(() => {
    if (isLoggedIn()) {
      navigate(location.state?.returnTo || "/")
    }
  })

  return (
    <>
      <Title>Login</Title>

      <div class="flex min-h-screen flex-col pb-20">
        <img class="mx-auto mb-auto mt-8 w-36" src={fixAssetPath(logoImage)} />

        <div class="mx-6 mb-10 mt-2 rounded bg-white p-6 shadow-2xl md:mx-auto md:w-96">
          <h1 class="mb-4 flex items-center text-lg font-bold md:text-2xl">Login</h1>
          <Form
            of={form}
            onSubmit={(values) => {
              setSubmittedValues(values)
              login(values)
            }}
          >
            <FormInput of={form} type="text" name="email" label="Email" />
            <FormInput of={form} type="password" name="password" label="Password" />

            <Button
              type="submit"
              colorScheme="primary"
              disabled={Boolean(submittedValues() || login.loading)}
            >
              Login
            </Button>
          </Form>
        </div>

        <Show when={lastUserEmail()}>
          <button
            class="mx-auto rounded-full border-2 border-gray-300 p-4 text-gray-400 transition hover:bg-gray-200"
            onClick={() => startCredentialLogin({ email: lastUserEmail()! })}
          >
            <IconFingerprint size="2em" />
          </button>
        </Show>

        <div class="mt-auto" />
      </div>
    </>
  )
}

export default LoginPage
