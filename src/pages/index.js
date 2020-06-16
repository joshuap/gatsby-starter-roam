import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function IndexPage({ data }) {
  return (
    <Layout>
      <SEO title="Home" />
      <div>
        <h1>
          All Pages
        </h1>
        <h4>{data.allRoamPage.totalCount} Pages</h4>
        {data.allRoamPage.edges.map(({ node }) => (
          <div key={node.id}>
            <Link to={node.fields.slug}>
              <h3>
                {node.title}{" "}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allRoamPage {
      totalCount
      edges {
        node {
          id
          title
          fields {
            slug
          }
        }
      }
    }
  }
`