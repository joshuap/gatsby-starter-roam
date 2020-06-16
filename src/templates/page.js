import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Block from "../components/block"

export default function Page({ data }) {
  const page = data.roamPage
  return (
    <Layout>
      <h1>{page.title}</h1>
      <Block parent={page}></Block>
    </Layout>
  )
}

// Supports 10-levels of nesting.
// [Why can't it do infinite levels?](https://github.com/graphql/graphql-spec/issues/91#issuecomment-254895093)
export const query = graphql`
  query($slug: String!) {
    roamPage(fields: { slug: { eq: $slug } }) {
      title
      children {
        ...BlockFields
        children {
          ...BlockFields
          children {
            ...BlockFields
            children {
              ...BlockFields
              children {
                ...BlockFields
                children {
                  ...BlockFields
                  children {
                    ...BlockFields
                    children {
                      ...BlockFields
                      children {
                        ...BlockFields
                        children {
                          ...BlockFields
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment BlockFields on RoamBlock {
    id
    uid
    string
  }
`