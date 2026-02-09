# Weavy.ai Workflow Builder - Quick Start Guide

## ✅ Setup Complete!

All environment variables are configured and the database is ready. Your project is now fully operational.

## 🚀 Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to http://localhost:3000

3. **Sign in with Clerk:**
   - Click "Sign In" in the top right
   - Create an account or sign in with Google/GitHub

## 🎯 Testing the Workflow

### Quick Demo Flow:
1. Click **"Load Sample"** to load the pre-built "Product Marketing Kit" workflow
2. Click **"Run Workflow"** to execute all nodes in parallel
3. Watch the nodes pulse as they execute
4. Click **"Save"** to persist your workflow to the database
5. Check the **Right Sidebar** to see your saved workflows

### Testing Individual Nodes:
- Click the **Play button** (▶) on any node header to run just that node
- Drag nodes from the left sidebar onto the canvas
- Connect nodes by dragging from output handles to input handles

## 📦 What's Working:

✅ **Authentication**: Clerk-powered user auth  
✅ **Database**: PostgreSQL (Neon) with Prisma ORM  
✅ **Execution Engine**: Parallel DAG-based workflow execution  
✅ **Persistence**: Save/Load/Delete workflows  
✅ **6 Node Types**: Text, LLM, Upload Image/Video, Crop, Extract Frame  
✅ **Real-time Feedback**: Pulsing nodes, inline results  

## 🎨 For Your Assessment:

### Key Features to Demonstrate:
1. **Drag & Drop**: Show how nodes can be dragged from sidebar
2. **Parallel Execution**: Run the sample workflow to show concurrent processing
3. **Single Node Execution**: Click play on individual nodes
4. **Persistence**: Save and reload workflows
5. **Type-Safe Connections**: Connect compatible node handles

### Screenshots to Capture:
- Full 3-panel layout
- Sample workflow executing (with pulsing nodes)
- Workflow history panel
- Individual node details

## 🚢 Deployment (Optional)

If you need to deploy for the assessment:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Weavy.ai clone complete"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy!

## 🐛 Troubleshooting:

**If the app doesn't start:**
- Make sure all dependencies are installed: `npm install`
- Check that `.env` and `.env.local` both exist with the same credentials

**If Clerk auth fails:**
- Verify your Clerk keys are correct
- Make sure you're using the test keys (they start with `pk_test_` and `sk_test_`)

**If database operations fail:**
- Verify the Neon database is still active
- Re-run migrations: `npx prisma migrate dev`

---

**Good luck with your assessment! 🎉**
