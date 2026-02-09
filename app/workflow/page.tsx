"use client";

import IconSidebar from "@/components/workflow/IconSidebar";
import ExpandableHistory from "@/components/workflow/ExpandableHistory";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import { UserButton } from "@clerk/nextjs";
import { useWorkflowStore } from "@/store/workflowStore";
import { ExecutionEngine } from "@/lib/executionEngine";
import { useEffect, useRef } from "react";
import { Node } from "reactflow";
import { sampleWorkflow } from "@/lib/sampleWorkflow";
import { ChevronDown, Download, Upload } from "lucide-react";

export default function WorkflowPage() {
  const { nodes, edges, updateNodeData, setRunning, isRunning, setNodes, setEdges } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with sample workflow if empty
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(sampleWorkflow.nodes);
      setEdges(sampleWorkflow.edges);
    }
  }, [nodes.length, setNodes, setEdges]);


  const handleRunWorkflow = async () => {
    setRunning(true);
    try {
      const engine = new ExecutionEngine(
        nodes,
        edges,
        (nodeId) => {
          // Mark node as executing
          updateNodeData(nodeId, { executing: true });
        },
        (nodeId, result) => {
          // Mark node as complete and store result
          updateNodeData(nodeId, {
            executing: false,
            result: result.status === 'success' ? result.output : result.error
          });
        }
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
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-base">untitled</h1>
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
            <div className="h-4 w-px bg-gray-800" />
            <div className="text-sm text-gray-400">★ 150 credits</div>
            <button className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors">
              Share
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md transition-colors">
              Tasks
              <ChevronDown size={14} />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <WorkflowCanvas />
      </div>

      <ExpandableHistory />
    </main>
  );
}
