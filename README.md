# convo_graphql

A command-line tool that uses AI to help generate and execute GraphQL queries for Arweave. This tool simplifies the process of writing GraphQL queries by allowing you to describe what you want in natural language.

## Installation

You can install the tool globally using yarn:

```bash
git clone https://github.com/your-username/convo_graphql.git
cd convo_graphql
yarn install
yarn build
yarn install-global
```

## Usage

The CLI provides two main commands:

### Generate GraphQL Query

```bash
mycli generate-query
```

This command will:
1. Prompt you to describe the GraphQL query you want to generate
2. Use AI to generate an appropriate query based on your description
3. Show you the generated query
4. Give you the option to:
   - Execute the query directly against the Arweave GraphQL endpoint
   - Get a curl command example for manual execution

Example:

```bash
$ mycli generate-query
? Describe the Arweave GraphQL query you want to generate: Find the latest 5 transactions with their IDs and owners
# The tool will generate and show you the query, then offer to execute it

# If you choose not to execute, it will show you how to use it with curl:
curl https://arweave.net/graphql \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ transactions(first: 5) { edges { node { id owner { address } } } } }"}'
```

### Help

To see all available commands and options:

```bash
mycli --help
```

## Configuration

The tool uses the following defaults:
- GraphQL Endpoint: https://arweave.net/graphql
- AI Service: OpenAI (make sure to set your API key in the environment)

## Development

To run the project in development mode:

```bash
yarn dev
```

To watch for changes during development:

```bash
yarn watch
```

## License

[Add your license information here]
