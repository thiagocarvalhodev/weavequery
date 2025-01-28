export const ARWEAVE_SCHEMA_CONTEXT = `
"""
"""
Arweave GraphQL Schema
NOTE: 
Only the following fields are required in queries by default:
  edges {
    node {
      id
      tags {
        name
        value
      }
    }
  }
All other fields are optional and included only when explicitly asked for.
"""
schema {
  query: Query
}

"""
Entry point for queries
"""
type Query {
  """
  Returns a list of transactions matching the given filters
  - Only the edges->node->id/tags are required by default.
  """
  transactions(
    first: Int
    after: String
    block: BlockFilter
    tags: [TagFilter!]
    owners: [String!]
    recipients: [String!]
    height: HeightFilter
    sort: SortOrder = HEIGHT_DESC
  ): TransactionsConnection

  """
  Fetch a specific transaction by its ID
  """
  transaction(id: ID!): Transaction

  """
  Fetch a specific block by its height
  """
  block(height: Int): Block

  """
  Returns a list of blocks matching the given filters
  """
  blocks(
    first: Int
    after: String
    filter: BlockFilter
    sort: SortOrder = HEIGHT_DESC
  ): BlocksConnection
}

"""
Defines sorting order for queries
"""
enum SortOrder {
  HEIGHT_ASC
  HEIGHT_DESC
}

"""
Pagination wrapper for Transactions
"""
type TransactionsConnection {
  pageInfo: PageInfo
  edges: [TransactionEdge!]
}

"""
Contains the cursor and actual transaction node
"""
type TransactionEdge {
  cursor: String!
  node: Transaction!
}

"""
Pagination wrapper for Blocks
"""
type BlocksConnection {
  pageInfo: PageInfo
  edges: [BlockEdge!]
}

"""
Contains the cursor and actual block node
"""
type BlockEdge {
  cursor: String!
  node: Block!
}

"""
Pagination info
"""
type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

"""
Represents an Arweave transaction
- Only id and tags (with name, value) are required by default in queries.
"""
type Transaction {
  id: ID!
  anchor: String
  signature: String
  owner: Owner
  recipient: String
  fee: Amount
  quantity: Amount
  tags: [Tag!]
  data: DataContent
  block: Block
}

"""
Represents a tag in a transaction
"""
type Tag {
  name: String!
  value: String!
}

"""
Owner of a transaction, containing address and public key
"""
type Owner {
  address: String!
  key: String!
}

"""
Fee, quantity, or any Winston/AR amount
"""
type Amount {
  winston: String!
  ar: String!
}

"""
Metadata about the transaction data
"""
type DataContent {
  size: String!
  type: String
}

"""
A block on the Arweave chain
"""
type Block {
  id: ID!
  height: Int!
  timestamp: Int!
  previous: ID
  indepHash: ID
}

"""
Filter blocks by height range
"""
input BlockFilter {
  min: Int
  max: Int
}

"""
Used to filter transactions by a specific tag name and its possible values
Example: To find transactions with App-Name = "ArDrive-App":
tags: [{ name: "App-Name", values: ["ArDrive-App"] }]
"""
input TagFilter {
  name: String!    # The tag name to filter by
  values: [String!] # Array of possible values for this tag
}

"""
Filter transactions by height range
"""
input HeightFilter {
  min: Int
  max: Int
}

Usage Examples:

1. Basic transaction query with tag filter:
query {
  transactions(
    first: 10
    tags: [{ 
      name: "App-Name", 
      values: ["ArDrive-App"] 
    }]
  ) {
    edges {
      node {
        id
        tags {
          name
          value
        }
      }
    }
  }
}

2. Query with multiple tag filters and block range:
query {
  transactions(
    first: 10,
    block: {
      min: 1000000,
      max: 1000100
    }
    tags: [
      { name: "App-Name", values: ["ArDrive-App"] },
      { name: "Content-Type", values: ["image/png", "image/jpeg"] }
    ]
  ) {
    edges {
      node {
        id
        tags {
          name
          value
        }
        block {
          height
        }
      }
    }
  }
}

3. Query with single tag value:
query {
  transactions(
    first: 10
    tags: [{ 
      name: "Entity-Type", 
      values: ["drive"] 
    }]
  ) {
    edges {
      node {
        id
        tags {
          name
          value
        }
      }
    }
  }
}

4. Query for specific tag name and values + block range:
"first 10 transactions with Entity-Type equals to drive from block min_block to max_block"

query {
  transactions(
    first: 10
    block: {
      min: min_block
      max: max_block
    }
    tags: [
      {
        name: "Entity-Type"
        values: ["drive"]
      }
    ]
  ) {
    edges {
      node {
        id
        tags {
          name
          value
        }
      }
    }
  }
}

IMPORTANT NOTES:
1. Tag filters require both name and values fields
2. The values field must be an array, even for single values
3. Default fields to include are id and tags
4. Additional fields should be explicitly requested
5. Empty arrays or undefined values should be omitted from the query
`;
//# sourceMappingURL=schema-context.js.map