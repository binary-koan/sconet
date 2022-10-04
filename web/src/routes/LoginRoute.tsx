import { Button, Heading } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Title } from "@solidjs/meta"
import { Route, useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import { Form } from "../components/forms/Form"
import FormInput from "../components/forms/FormInput"
import { LoginMutation, LoginMutationVariables } from "../graphql-types"
import { setLoginToken, useMutation } from "../graphqlClient"

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const LoginPage: Component = () => {
  const navigate = useNavigate()

  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    onSuccess: (data) => {
      setLoginToken(data.login)
      toast.success("Logged in")
      navigate("/")
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: "ALL"
  })

  return (
    <>
      <Title>Login</Title>

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        marginTop="$4"
        marginBottom="$4"
        paddingStart="$4"
        paddingEnd="$4"
        display="flex"
        alignItems="center"
      >
        Login
      </Heading>
      <Form<{ email: string; password: string }> onSave={login}>
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Password" />

        <Button type="submit" colorScheme="primary" disabled={loading}>
          Save
        </Button>
      </Form>
    </>
  )
}

export const LoginRoute: Component = () => {
  return <Route path="/login" component={LoginPage} />
}
