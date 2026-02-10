"use client";

import IconSidebar from "@/components/workflow/IconSidebar";
import ExpandableHistory from "@/components/workflow/ExpandableHistory";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import { UserButton } from "@clerk/nextjs";
import { useWorkflowStore } from "@/store/workflowStore";
import { ExecutionEngine } from "@/lib/executionEngine";
import { useRef } from "react";
import { ChevronDown, Download, Upload } from "lucide-react";

export default function WorkflowPage() {
  const { nodes, edges, updateNodeData, setRunning, isRunning, setNodes, setEdges } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas starts blank - users build their own workflows


  const handleRunWorkflow = async () => {
    let workflowId = useWorkflowStore.getState().activeWorkflowId;

    // 1. Ensure workflow is saved to get an ID
    if (!workflowId) {
      try {
        const res = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: "Demo Workflow", nodes, edges })
        });
        const data = await res.json();
        workflowId = data.id;
        useWorkflowStore.getState().setActiveWorkflowId(workflowId);
      } catch (err) {
        console.error("Failed to save workflow for history:", err);
        return;
      }
    }

    setRunning(true);
    try {
      // 2. Create Execution Record
      const execRes = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, scope: 'full', nodeCount: nodes.length })
      });
      const execData = await execRes.json();
      const executionId = execData.id;

      // 3. Run Engine
      const engine = new ExecutionEngine(
        nodes,
        edges,
        (nodeId) => {
          updateNodeData(nodeId, { executing: true });
        },
        (nodeId, result) => {
          updateNodeData(nodeId, {
            executing: false,
            result: result.status === 'success' ? result.output : result.error
          });
        },
        executionId
      );
      await engine.execute();
    } catch (error) {
      console.error("Workflow execution failed:", error);
    } finally {
      setRunning(false);
    }
  };

  const handleExportJSON = () => {
    const workflow = {
      nodes,
      edges,
      version: "1.0",
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const workflow = JSON.parse(content);

        if (workflow.nodes && workflow.edges) {
          setNodes(workflow.nodes);
          setEdges(workflow.edges);
          alert("Workflow imported successfully!");
        } else {
          alert("Invalid workflow file format");
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import workflow file");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-black text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <IconSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-black z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning || nodes.length === 0}
              className="flex items-center gap-1.5 text-sm bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed px-3 py-1.5 rounded-md transition-colors font-medium"
              title="Run entire workflow"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full" />
                  Running
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors"
              title="Export workflow as JSON"
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={handleImportJSON}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors"
              title="Import workflow from JSON"
            >
              <Upload size={14} />
              Import
            </button>
            <div className="text-sm text-gray-400">★ 150 credits</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Workflow URL copied to clipboard! 🔗");
              }}
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Share
            </button>
            <button
              onClick={() => alert("AI Tasks:\n1. Video Analysis\n2. Image Enhancement\n3. Text Summarization")}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Tasks
              <ChevronDown size={14} />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <WorkflowCanvas />
      </div >

      <ExpandableHistory />
    </main >
  );
}
