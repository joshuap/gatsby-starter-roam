const _ = require(`lodash`)
const path = require(`path`)
const fs = require(`fs-extra`)
const crypto = require(`crypto`)

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode, createParentChildLink } = actions

  if (typeof(pluginOptions.path) === 'undefined') { pluginOptions.path = `db/roam.json` }
  if (!path.isAbsolute(pluginOptions.path)) {
    pluginOptions.path = path.resolve(process.cwd(), pluginOptions.path)
  }

  const content = await fs.readFile(pluginOptions.path, `utf-8`)
  const parsedContent = JSON.parse(content)

  function createChildren(parent, children) {
    if (!_.isArray(children)) { return }
    children.forEach((obj, i) => {
      const nodeMeta = {
        id: createNodeId(`roam-block-${parent.id}-${i}`),
        parent: parent.id,
        children: [],
        internal: {
          type: `RoamBlock`,
          contentDigest: createContentDigest(obj),
        },
      }
      const node = Object.assign({}, obj, nodeMeta)
      createNode(node)
      createParentChildLink({ parent: parent, child: node })
      createChildren(node, obj.children)
    })
  }

  parsedContent.forEach((obj, i) => {
    const nodeMeta = {
      id: createNodeId(`roam-page-${i}`),
      parent: null,
      children: [],
      internal: {
        type: `RoamPage`,
        contentDigest: createContentDigest(obj),
      },
    }
    const node = Object.assign({}, obj, nodeMeta)
    createNode(node)
    createChildren(node, obj.children)
  })
}

const roamDayRegexp = /(?<month>January|February|March|April|May|June|July|August|September|October|November|December) (?<day>[0-9]{1,2})(?:[a-z]{2})?, (?<year>[0-9]{4})/
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `RoamPage`) {
    let slug
    const dayMatch = node.title.match(roamDayRegexp)
    if (dayMatch) {
      const date = Date.parse(`${dayMatch.groups.month} ${dayMatch.groups.day}, ${dayMatch.groups.year}`)
      const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(date)
      slug = `${mo}-${da}-${ye}`
    } else {
      slug = crypto
        .createHash(`sha256`)
        .update(node.title)
        .digest(`hex`)
        .substr(0, 9)
    }
    createNodeField({
      node,
      name: `slug`,
      value: `/pages/${slug}`,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const result = await graphql(`
    query {
      allRoamPage {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allRoamPage.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}
