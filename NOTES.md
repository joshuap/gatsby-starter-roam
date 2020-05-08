# Notes

I'm new to Gatsby. These are my dumb notes.

## Getting data from Roam into Gatsby

I'm sourcing the raw JSON from the filestem into Gatsby's GraphQL schema with the following plugins:

- https://www.gatsbyjs.org/packages/gatsby-source-filesystem/
- https://www.gatsbyjs.org/packages/gatsby-transformer-json/

Here's how to export your database in Roam and import it into this Gatsby project:

1. Go to https://roamresearch.com/#/app/yourdb -> Export All
   1. Select JSON as the export format
2. Save export JSON file to db/roam.json

Restart the dev server, then navigate here:

http://localhost:8000/___graphql

...and inspect your database with this query:

```graphql
{
  allRoamJson {
    edges {
      node {
        id
        title
      }
    }
  }
}
```