/**
 * Skills — the architectural map groups the same 26 technologies from the
 * resume into six categories. Nothing is added; no levels or percentages.
 * Coordinates are in the map's 100 × 56 viewBox.
 */
export const skillMap = {
  center: 'Generative AI Engineering',
  categories: [
    { id: 'llms', label: 'LLMs', x: 15, y: 13, skills: ['OpenAI API', 'Prompt Engineering', 'LangChain', 'Runnables & Chains'] },
    { id: 'rag', label: 'RAG', x: 50, y: 5, skills: ['Document Loaders', 'Text Splitters', 'Reranking', 'RAG Evaluation'] },
    { id: 'agents', label: 'AI Agents', x: 85, y: 13, skills: ['AI Agents', 'Tool Calling'] },
    {
      id: 'backend',
      label: 'Backend',
      x: 85,
      y: 43,
      skills: ['Python', 'FastAPI', 'REST APIs', 'API Integration', 'Streaming Responses'],
    },
    {
      id: 'frontend',
      label: 'Frontend',
      x: 50,
      y: 51,
      skills: ['React.js', 'TypeScript', 'JavaScript', 'Git', 'GitHub', 'VS Code', 'Vercel', 'Render'],
    },
    { id: 'vector', label: 'Vector Search', x: 15, y: 43, skills: ['Embeddings', 'Pinecone', 'Semantic Search'] },
  ],
  // secondary relationships between categories (drawn fainter than the spokes)
  links: [
    ['llms', 'rag'],
    ['rag', 'agents'],
    ['agents', 'backend'],
    ['backend', 'frontend'],
    ['frontend', 'vector'],
    ['vector', 'llms'],
    ['rag', 'vector'],
  ],
}

export const focusAreas = [
  'Python development',
  'Generative AI applications',
  'Large Language Models',
  'Retrieval-Augmented Generation',
  'AI agents',
  'LangChain',
  'FastAPI',
  'Vector databases',
  'Semantic search',
  'Tool calling',
  'LLM application workflows',
]

export const worldNodes = [
  {
    id: 'llm',
    label: 'LLMs',
    x: 0.5,
    y: 0.14,
    text: 'Large language models as a building block — prompt engineering, OpenAI API integrations and composable runnables & chains for LLM workflows.',
    tags: ['OpenAI API', 'Prompt Engineering', 'LangChain'],
  },
  {
    id: 'rag',
    label: 'RAG',
    x: 0.17,
    y: 0.4,
    text: 'Grounding answers in real documents: loaders, text splitters, embeddings, hybrid retrieval, reranking and evaluation — with sources attached.',
    tags: ['Embeddings', 'Reranking', 'RAG Evaluation'],
  },
  {
    id: 'agents',
    label: 'AI Agents',
    x: 0.83,
    y: 0.4,
    text: 'Agents that reason, call tools and finish multi-step tasks — with a human approving the actions that matter.',
    tags: ['Tool Calling', 'LangGraph', 'Approvals'],
  },
  {
    id: 'vector',
    label: 'Vector Search',
    x: 0.26,
    y: 0.82,
    text: 'Semantic search over embeddings with Pinecone, paired with keyword search for hybrid retrieval.',
    tags: ['Pinecone', 'Semantic Search', 'Hybrid Search'],
  },
  {
    id: 'automation',
    label: 'Automation',
    x: 0.74,
    y: 0.82,
    text: 'Multi-step workflows that run on their own — streamed live with Server-Sent Events and recorded as execution history.',
    tags: ['Workflows', 'SSE', 'Execution History'],
  },
  {
    id: 'backend',
    label: 'Backend',
    x: 0.5,
    y: 0.52,
    text: 'The services that hold the intelligence together: FastAPI, REST APIs, PostgreSQL, authentication and streaming responses.',
    tags: ['FastAPI', 'PostgreSQL', 'REST APIs'],
  },
]

export const worldEdges = [
  ['llm', 'rag'],
  ['llm', 'agents'],
  ['llm', 'backend'],
  ['rag', 'vector'],
  ['rag', 'backend'],
  ['agents', 'automation'],
  ['agents', 'backend'],
  ['vector', 'backend'],
  ['automation', 'backend'],
  ['vector', 'automation'],
]
