import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "@apollo/react-hooks"
import { getAccessToken, setAccessToken } from "./lib/accessToken"
import { App } from "./App"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink, Observable } from "apollo-link"
import { TokenRefreshLink } from "apollo-link-token-refresh"
import jwtDecode from "jwt-decode"
import { resolvers, typeDefs } from './resolvers'
import './assets/css/bootswatch.min.css'

const cache = new InMemoryCache()
// const ENDPOINT = process.env.PROD_ENDPOINT || 'http://localhost:4000'
const ENDPOINT = 'https://eat--it.herokuapp.com'

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: any, value: any) => (key === '__typename' ? undefined : value);
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  return forward(operation).map((data) => {
    return data;
  });
});



const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any
      Promise.resolve(operation)
        .then(operation => {
          const accessToken = getAccessToken()
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `bearer ${accessToken}`
              }
            })
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken()

        if (!token) {
          return true
        }

        try {
          const { exp } = jwtDecode(token)
          if (Date.now() >= exp * 1000) {
            return false
          } else {
            return true
          }
        } catch {
          return false
        }
      },
      fetchAccessToken: () => {
        return fetch(`${ENDPOINT}/refresh_token`, {
          method: "POST",
          credentials: "include"
        })
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken)
      },
      handleError: err => {
        console.warn("Your refresh token is invalid. Try to relogin")
        console.error(err)
      }
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors)
      console.log(networkError)
    }),
    cleanTypeName,
    requestLink,
    new HttpLink({
      uri: `${ENDPOINT}/graphql`,
      credentials: "include"
    })
  ]),
  cache,
  typeDefs,
  resolvers
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
)
