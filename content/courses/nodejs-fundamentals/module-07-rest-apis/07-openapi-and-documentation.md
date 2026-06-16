# OpenAPI and API Documentation

## Why It Matters

Documentation turns an API from tribal knowledge into a contract. OpenAPI describes endpoints, schemas, parameters, responses, and auth in a machine-readable format that humans and tools can use.

## Core Concepts

- OpenAPI files describe paths, operations, request bodies, responses, schemas, security, and examples.
- A schema should match runtime validation and actual responses.
- Generated docs are useful only if they stay close to code and tests.
- OpenAPI can generate clients, mock servers, contract tests, and interactive documentation.
- Examples make edge cases easier to understand than field descriptions alone.

## Flow to Remember

Design or update the OpenAPI contract, implement route validation and response shaping, then test that the implementation matches the documented contract.

## Syntax and Examples

```js
openapi: 3.1.0
info:
  title: Tasks API
  version: 1.0.0
paths:
  /api/v1/tasks:
    post:
      summary: Create a task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title]
              properties:
                title:
                  type: string
                  minLength: 1
      responses:
        '201':
          description: Created
        '400':
          description: Validation failed
```

## Use Cases and Tradeoffs

- Use OpenAPI for public APIs, partner APIs, and internal services with multiple client teams.
- Use schema references for shared response and error shapes.
- Use examples for authentication, pagination, validation failures, and webhooks.
- Use CI checks to keep the contract parseable and synced with tests.

## Common Mistakes

- Documenting ideal behavior that the code does not implement.
- Leaving error responses unspecified.
- Using one vague `object` schema for every payload.
- Forgetting auth requirements and rate limit behavior.

## Practical Challenge

Write an OpenAPI path entry for `GET /api/v1/users/{userId}` with path parameters, success response, `404`, and `401` responses.

## Recap

- OpenAPI is executable API documentation.
- Schemas should match validators and tests.
- Good docs include error behavior and realistic examples.

