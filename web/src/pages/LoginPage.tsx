import { Heading, Button, Box } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Title } from "@solidjs/meta"
import { useLocation, useNavigate } from "@solidjs/router"
import { Component, createEffect } from "solid-js"
import toast from "solid-toast"
import { Form } from "../components/forms/Form"
import FormInput from "../components/forms/FormInput"
import { LoginMutation, LoginMutationVariables } from "../graphql-types"
import { useMutation } from "../graphqlClient"
import { isLoggedIn, setLoginToken } from "../utils/auth"

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const LoginPage: Component = () => {
  const navigate = useNavigate()
  const location = useLocation<{ returnTo?: string }>()

  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    onSuccess: (data) => {
      setLoginToken(data.login)
      toast.success("Logged in")
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: "ALL"
  })

  createEffect(() => {
    if (isLoggedIn()) {
      navigate(location.state?.returnTo || "/")
    }
  })

  return (
    <>
      <Title>Login</Title>

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        paddingBottom="$20"
      >
        <Box
          maxWidth={{ "@initial": "none", "@lg": "48rem" }}
          margin={{ "@initial": "$6", "@lg": "0 auto" }}
          padding="$6"
          backgroundColor="$neutral1"
          boxShadow="$2xl"
          borderRadius="$md"
        >
          <Heading
            fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
            marginBottom="$4"
            display="flex"
            alignItems="center"
          >
            Login
          </Heading>
          <Form<{ email: string; password: string }> onSave={login}>
            <FormInput type="text" name="email" label="Email" />
            <FormInput type="password" name="password" label="Password" />

            <Button type="submit" colorScheme="primary" disabled={loading}>
              Login
            </Button>
          </Form>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
