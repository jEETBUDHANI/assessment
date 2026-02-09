# Weavy.ai Workflow Builder Clone

A pixel-perfect, fully functional clone of the Weavy.ai workflow builder built for technical assessment.

## 🎯 Project Overview

This is a production-ready workflow automation platform that allows users to create, execute, and manage AI-powered workflows through an intuitive drag-and-drop interface.

## ✨ Key Features

- **6 Custom Node Types**: Text, LLM (Gemini), Upload Image/Video, Crop Image, Extract Frame
- **Parallel Execution Engine**: DAG-based workflow orchestration with concurrent node processing
- **Real-time Feedback**: Pulsing node animations, inline results, loading states
- **Full Persistence**: Save, load, and manage workflows with PostgreSQL
- **Type-Safe Architecture**: End-to-end TypeScript with Zod validation
- **Secure Authentication**: Clerk-powered user auth with per-user isolation

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React Flow
- Tailwind CSS
- Zustand (State Management)
- Lucide Icons

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)
- Clerk Auth

**APIs:**
- Google Gemini API
- Trigger.dev (Background Tasks)

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Open http://localhost:3000**

## 📖 Usage

1. Sign in with Clerk
2. Click "Load Sample" to see the pre-built workflow
3. Click "Run Workflow" to execute
4. Save your workflows for later

## 🏗️ Project Structure

```
assessment/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── page.tsx           # Main workflow page
├── components/
│   ├── nodes/             # Custom node components
│   └── workflow/          # Canvas & sidebars
├── lib/                   # Utilities
│   ├── dagValidator.ts    # DAG validation
│   ├── executionEngine.ts # Workflow orchestration
│   └── prisma.ts          # Database client
├── prisma/
│   └── schema.prisma      # Database schema
└── store/
    └── workflowStore.ts   # Zustand state
```

## 🎨 Architecture Highlights

- **Level-based Topological Sort**: Enables parallel execution of independent nodes
- **Reactive State Management**: Zustand for predictable state updates
- **Type-Safe API Layer**: Zod schemas for runtime validation
- **Optimistic UI Updates**: Instant feedback with background persistence

## 📝 License

Built for assessment purposes.
