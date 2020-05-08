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
        title
        fields {
          slug
        }
      }
    }
  }
}
```

## Permalinks

Roam exports block refs as the `uid` property in the JSON, but it's only available for blocks--not pages. In Roam, daily notes use the `MM-DD-YYYY` date format for slugs, so I'll try to match those here. All other pages in Roam appear to use a unique slug, but it's not included in the export JSON. Since all page names in Roam are unique, I'm using a SHA-256 digest of the titles to construct a slug using the first 9 characters.

https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/

Tbh I'm not sure if I really needed to create special slugs for days, but it may still be handy in the future because I'll probably want to handle the day pages differently (like ordering them by date).

## Misc. thoughts/ideas

- Could use the slug/digest function to link `[[title]]`-style references.
- Create a [transformer plugin](https://www.gatsbyjs.org/tutorial/part-six/) to build links and references from Roam JSON?
- It would be interesting to try converting Roam queries to GraphQL queries.
