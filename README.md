# Knowledge Graph Generator

A simple app to generate Knowledge Graphs (KGs) in accordance to the user's prompts and inputs utilizing OpenAI's LLM services.

## Setup

### Installation

Install all the packages using npm

```bash
  cd <dir>/<to>/<frontend>
  npm install
  cd <dir>/<to>/<backend>
  npm install
```

### Run Locally

1. Run your neo4j instance (if needed)

2. Use two different terminals to run both frontend and backend.

```bash
  cd <dir>/<to>/<frontend>
  npm run dev
  cd <dir>/<to>/<backend>
  npm start
```

- Access the frontend via `http://localhost:5173`
- Access the backend via `http://localhost:3000`

### Environment Variables

Change the variables according to your system.

```bash
AZURE_API_KEY=
AZURE_API_ENDPOINT=
NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=
NEO4J_DATABASE=
```

### Running Tests

To run tests, run the following command

```bash
  cd <dir>/<to>/<backend>
  npm run test
```

## System Requirements

- Node >= 20.10.7
- Neo4j >= 5.12.0
- Java SE 17 Platform

## Tech Stack

**Client:** React, Vite, TailwindCSS

**Server:** Node, Nest

**Database:** Neo4j

**Others:** Azure OpenAI Service
