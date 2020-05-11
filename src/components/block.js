import React from "react"

export default function Block({ parent }) {
  if (!Array.isArray(parent.children)) { return ""; }
  return (
    <ul>
      {parent.children.map((node) => (
          <li key={node.id}>
            {node.string}{" "}
            <Block parent={node}></Block>
          </li>
      ))}
    </ul>
  )
}