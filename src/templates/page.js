import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default function Page({ data }) {
  const page = data.roamJson
  return (
    <Layout>
      <h1>{page.title}</h1>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    roamJson(fields: { slug: { eq: $slug } }) {
      title
    }
  }
`