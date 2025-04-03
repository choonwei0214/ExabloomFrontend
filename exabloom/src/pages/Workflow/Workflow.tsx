import "@xyflow/react/dist/style.css";
import { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
} from "reactflow";
import { StartNode } from "../../components/StartNode";

const nodeTypes = {
  StartNode: StartNode,
};

export const Workflow = () => {
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const setInitialNode = () => {
    let newNode: Node = {
      id: "1",
      type: "StartNode",
      data: { label: "Start Node" },
      position: { x: 0, y: 0 },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  useEffect(() => {
    setInitialNode();
  }, []);

  return (
    <div className="h-screen">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background variant={backgroundVariant} />
        <Controls></Controls>
      </ReactFlow>
    </div>
  );
};
