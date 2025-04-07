import "@xyflow/react/dist/style.css";
import { useEffect, useState, useCallback, useRef } from "react";
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
  ReactFlowProvider,
} from "reactflow";
import { StartNode } from "../../components/StartNode";
import { EndNode } from "../../components/EndNode";
import { AddNode } from "../../components/AddNode";
import { ActionNode } from "../../components/ActionNode";
import { Modal } from "../../components/Modal";
import { IfElseNode } from "../../components/IfElseNode";
import { BranchNode } from "../../components/BranchNode";
import { IoClose } from "react-icons/io5";

// Define nodeTypes, include all custom node created
const nodeTypes = {
  StartNode: StartNode,
  EndNode: EndNode,
  AddNode: AddNode,
  ActionNode: ActionNode,
  IfElseNode: IfElseNode,
  BranchNode: BranchNode,
};

export const Workflow = () => {
  // To keep track of the node and edge ID, to prevent duplicate by using .length
  const nodeIdCounter = useRef(1);
  const edgeIdCounter = useRef(1);
  const reactFlowWrapper = useRef(null);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const initialized = useRef(false);

  // Edit action node
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [actionNodeId, setActionNodeId] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  // If Else Node modal
  const [ifElseNodeModalOpen, setIfElseNodeModalOpen] = useState(false);
  const [ifElseAction, setIfElseAction] = useState("");
  const [ifElseNodeId, setIfElseNodeId] = useState("");
  const [currentIfElseAction, setCurrentIfElseAction] = useState("");
  const [branches, setBranches] = useState<Node[]>([]);
  const [currentBranches, setCurrentBranches] = useState<Node[]>([]);

  // Add node
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [addNodeId, setAddNodeId] = useState("");

  const addActionNode = (addNodeId: string, currentNodes: Node[]) => {
    const addNodeIndex = currentNodes.findIndex(
      (n: Node) => n.id === addNodeId
    );
    const currNode = currentNodes[addNodeIndex];
    const nextNode = currentNodes[addNodeIndex + 1];
    const newActionNodeId = `${nodeIdCounter.current++}`;
    const newAddNodeId = `${nodeIdCounter.current++}`;

    const baseX = currNode.position.x;
    const baseY = currNode.position.y;

    const newActionNode: Node = {
      id: newActionNodeId,
      type: "ActionNode",
      data: {
        label: "Action Node",
        action: "Action",
        onClick: handleClickActionNode,
      },
      position: {
        x: baseX,
        y: baseY + 70,
      },
    };

    const newAddNode: Node = {
      id: newAddNodeId,
      type: "AddNode",
      data: { label: "+", onClick: handleAddNode },
      position: {
        x: baseX,
        y: baseY + 200,
      },
    };

    // Shift nodes below
    const shiftedNodes = currentNodes.map((node: Node, index: number) => {
      if (index > addNodeIndex) {
        return {
          ...node,
          position: {
            ...node.position,
            y: node.position.y + 200,
          },
        };
      }
      return node;
    });

    const updatedNodes = [
      ...shiftedNodes.slice(0, addNodeIndex + 1),
      newActionNode,
      newAddNode,
      ...shiftedNodes.slice(addNodeIndex + 1),
    ];

    // Update edges at the same time
    setEdges((currentEdges) => {
      const currentEdge: Edge = currentEdges.filter(
        (edge: Edge) => edge.source == currNode.id
      )[0];
      const nextEdgeId = currentEdge.target;
      const filteredEdges = currentEdges.filter(
        (e: Edge) => e.source !== currentEdge.source || e.target !== nextEdgeId
      );
      // Technically this is curr, next
      // curr -> new1
      // new 1 -> new2
      // new2 -> next
      const newEdges: Edge[] = [
        {
          id: `${edgeIdCounter.current++}`,
          source: currentEdge.source,
          target: newActionNodeId,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle: "ActionNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: newActionNodeId,
          target: newAddNodeId,
          sourceHandle: "ActionNodeBottomHandle",
          targetHandle: "AddNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: newAddNodeId,
          target: nextEdgeId,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle:
            nextNode.type == "AddNode" ? "AddNodeTopHandle" : "EndNodeHandle",
          type: "step",
        },
      ];
      console.log(newEdges, "newEdges");
      return [...filteredEdges, ...newEdges];
    });

    return updatedNodes;
  };

  const addIfElseNode = (addNodeId: string, currentNodes: Node[]) => {
    const addNodeIndex = currentNodes.findIndex(
      (n: Node) => n.id === addNodeId
    );
    const currNode = currentNodes[addNodeIndex];
    const nextNode = currentNodes[addNodeIndex + 1];

    const ifElseNodeId = `${nodeIdCounter.current++}`;
    const branch1NodeId = `${nodeIdCounter.current++}`;
    const elseNodeId = `${nodeIdCounter.current++}`;
    const addNodeAfterBranch1Id = `${nodeIdCounter.current++}`;
    const addNodeAfterElseId = `${nodeIdCounter.current++}`;
    const endNodeElseId = `${nodeIdCounter.current++}`;

    const baseX = currNode.position.x;
    const baseY = currNode.position.y + 70;

    const ifElseNode: Node = {
      id: ifElseNodeId,
      type: "IfElseNode",
      data: {
        label: "If / Else",
        action: "Condition",
        onClick: handleClickIfElseNode,
      },
      position: {
        x: baseX,
        y: baseY,
      },
    };

    const branch1Node: Node = {
      id: branch1NodeId,
      type: "BranchNode",
      data: {
        label: "Branch #1",
        branchIndex: 0,
        parentNodeId: ifElseNodeId,
      },
      position: {
        x: baseX - 200,
        y: baseY + 120,
      },
    };

    const addNodeAfterBranch1: Node = {
      id: addNodeAfterBranch1Id,
      type: "AddNode",
      data: { label: "+", onClick: handleAddNode },
      position: {
        x: baseX - 200,
        y: baseY + 240,
      },
    };

    const elseNode: Node = {
      id: elseNodeId,
      type: "BranchNode",
      data: {
        label: "Else",
        branchIndex: -1,
        parentNodeId: ifElseNodeId,
      },
      position: {
        x: baseX + 200,
        y: baseY + 120,
      },
    };

    const addNodeAfterElse: Node = {
      id: addNodeAfterElseId,
      type: "AddNode",
      data: { label: "+", onClick: handleAddNode },
      position: {
        x: baseX + 200,
        y: baseY + 240,
      },
    };

    const endNodeElse: Node = {
      id: endNodeElseId,
      type: "EndNode",
      data: { label: "End" },
      position: {
        x: baseX + 200,
        y: baseY + 340,
      },
    };

    // Move all nodes after the add node to below Branch #1
    const nodesBelow = currentNodes.slice(addNodeIndex + 1);

    const movedNodes = nodesBelow.map((node, i) => ({
      ...node,
      position: {
        x: baseX - 200,
        y: addNodeAfterBranch1.position.y + 100 + i * 100,
      },
    }));

    const updatedNodes = [
      ...currentNodes.slice(0, addNodeIndex + 1),
      ifElseNode,
      branch1Node,
      addNodeAfterBranch1,
      elseNode,
      addNodeAfterElse,
      endNodeElse,
      ...movedNodes,
    ];

    // Edges
    setEdges((currentEdges) => {
      const currentEdge = currentEdges.find(
        (edge) => edge.source === currNode.id
      );
      const nextNodeId = currentEdge?.target;

      const filteredEdges = currentEdges.filter(
        (e) => e.source !== currNode.id || e.target !== nextNodeId
      );

      const newEdges: Edge[] = [
        {
          id: `${edgeIdCounter.current++}`,
          source: currNode.id,
          target: ifElseNodeId,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle: "IfElseNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: ifElseNodeId,
          target: branch1NodeId,
          sourceHandle: "IfElseNodeBottomHandle",
          targetHandle: "BranchNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: ifElseNodeId,
          target: elseNodeId,
          sourceHandle: "IfElseNodeBottomHandle",
          targetHandle: "BranchNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: branch1NodeId,
          target: addNodeAfterBranch1Id,
          sourceHandle: "BranchNodeBottomHandle",
          targetHandle: "AddNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: elseNodeId,
          target: addNodeAfterElseId,
          sourceHandle: "BranchNodeBottomHandle",
          targetHandle: "AddNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: addNodeAfterElseId,
          target: endNodeElseId,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle: "EndNodeHandle",
          type: "step",
        },
      ];

      if (nextNode) {
        newEdges.push({
          id: `${edgeIdCounter.current++}`,
          source: addNodeAfterBranch1Id,
          target: nextNode.id,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle: "AddNodeTopHandle",
          type: "step",
        });
      }

      return [...filteredEdges, ...newEdges];
    });

    return updatedNodes;
  };

  const handleAddNode = useCallback(
    (addNodeId: string, confirm: boolean, type: string) => {
      if (confirm) {
        if (type == "ActionNode") {
          setNodes((currentNodes) => {
            return addActionNode(addNodeId, currentNodes);
          });
        } else if (type == "IfElseNode") {
          setNodes((currentNodes) => {
            return addIfElseNode(addNodeId, currentNodes);
          });
        }
      } else {
        setAddNodeModalOpen(true);
        setAddNodeId(addNodeId);
      }
    },
    []
  );

  const addBranchToIfElseNode = (ifElseNodeId: string) => {
    setNodes((currentNodes) => {
      const ifElseNode = currentNodes.find((n) => n.id === ifElseNodeId);
      if (!ifElseNode) return currentNodes;

      const siblingBranches = currentNodes.filter(
        (n) =>
          n.type === "BranchNode" &&
          n.data?.parentNodeId === ifElseNodeId &&
          n.data.branchIndex >= 0
      );
      const newBranchIndex = siblingBranches.length;

      const branchSpacing = 200;
      const branchX =
        ifElseNode.position.x - 200 + newBranchIndex * branchSpacing + 100;
      const branchY = ifElseNode.position.y + 120;

      const elseNodeIndex = currentNodes.findIndex(
        (n) =>
          n.data?.branchIndex === -1 && n.data?.parentNodeId === ifElseNodeId
      );

      // Move the else node further right based on number of branches
      let updatedNodes = [...currentNodes];
      if (elseNodeIndex !== -1) {
        const originalElseNode = updatedNodes[elseNodeIndex];
        const elseAddNode = updatedNodes[elseNodeIndex + 1];
        const elseEndNode = updatedNodes[elseNodeIndex + 2];

        const newElseX =
          ifElseNode.position.x + (newBranchIndex + 1) * branchSpacing;

        updatedNodes[elseNodeIndex] = {
          ...originalElseNode,
          position: {
            ...originalElseNode.position,
            x: newElseX,
          },
        };
        if (elseAddNode?.type === "AddNode") {
          updatedNodes[elseNodeIndex + 1] = {
            ...elseAddNode,
            position: {
              ...elseAddNode.position,
              x: newElseX,
            },
          };
        }
        if (elseEndNode?.type === "EndNode") {
          updatedNodes[elseNodeIndex + 2] = {
            ...elseEndNode,
            position: {
              ...elseEndNode.position,
              x: newElseX,
            },
          };
        }
      }

      const newBranchNodeId = `${nodeIdCounter.current++}`;
      const newAddNodeId = `${nodeIdCounter.current++}`;
      const newEndNodeId = `${nodeIdCounter.current++}`;

      const branchNode: Node = {
        id: newBranchNodeId,
        type: "BranchNode",
        data: {
          label: `Branch #${newBranchIndex + 1}`,
          branchIndex: newBranchIndex,
          parentNodeId: ifElseNodeId,
        },
        position: { x: branchX, y: branchY },
      };

      const addNode: Node = {
        id: newAddNodeId,
        type: "AddNode",
        data: { label: "+", onClick: handleAddNode },
        position: { x: branchX, y: branchY + 120 },
      };

      const endNode: Node = {
        id: newEndNodeId,
        type: "EndNode",
        data: { label: "End" },
        position: { x: branchX, y: branchY + 220 },
      };

      updatedNodes.push(branchNode, addNode, endNode);

      // Add edges
      setEdges((currentEdges) => [
        ...currentEdges,
        {
          id: `${edgeIdCounter.current++}`,
          source: ifElseNodeId,
          target: newBranchNodeId,
          sourceHandle: "IfElseNodeBottomHandle",
          targetHandle: "BranchNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: newBranchNodeId,
          target: newAddNodeId,
          sourceHandle: "BranchNodeBottomHandle",
          targetHandle: "AddNodeTopHandle",
          type: "step",
        },
        {
          id: `${edgeIdCounter.current++}`,
          source: newAddNodeId,
          target: newEndNodeId,
          sourceHandle: "AddNodeBottomHandle",
          targetHandle: "EndNodeHandle",
          type: "step",
        },
      ]);

      return updatedNodes;
    });
  };

  const handleDeleteNode = useCallback((nodeIdToDelete: string) => {
    setNodes((currentNodes) => {
      const index = currentNodes.findIndex((n) => n.id === nodeIdToDelete);
      if (index === -1) return currentNodes;

      const nodeToDelete = currentNodes[index];
      const addNodeToDelete = currentNodes[index + 1];

      // Find previous and next next node
      const prevNode = currentNodes[index - 1];
      const nextNode = currentNodes[index + 2];

      const idsToRemove = [nodeToDelete.id];
      if (addNodeToDelete?.type === "AddNode") {
        idsToRemove.push(addNodeToDelete.id);
      }

      const updatedNodes = currentNodes.filter(
        (node) => !idsToRemove.includes(node.id)
      );

      setEdges((currentEdges) => {
        const filteredEdges = currentEdges.filter(
          (e) =>
            !idsToRemove.includes(e.source) && !idsToRemove.includes(e.target)
        );

        if (prevNode && nextNode) {
          filteredEdges.push({
            id: `${edgeIdCounter.current++}`,
            source: prevNode.id,
            target: nextNode.id,
            sourceHandle:
              prevNode.type === "AddNode" ? "AddNodeBottomHandle" : undefined,
            targetHandle:
              nextNode.type === "EndNode"
                ? "EndNodeHandle"
                : "AddNodeTopHandle",
          });
        }

        return filteredEdges;
      });

      return updatedNodes;
    });
    setEditModalOpen(false);
  }, []);

  const handleClickActionNode = (nodeId: string) => {
    setNodes((currentNodes) => {
      const selectedNode = currentNodes.find((node: Node) => node.id == nodeId);
      if (selectedNode) {
        setEditModalOpen(true);
        setActionNodeId(nodeId);
        setAction(selectedNode.data.action);
        setCurrentAction(selectedNode.data.action);
      }
      return currentNodes;
    });
  };

  const handleClickIfElseNode = (nodeId: string) => {
    setNodes((currentNodes) => {
      const selectedNode = currentNodes.find((node: Node) => node.id == nodeId);
      if (selectedNode) {
        setIfElseNodeModalOpen(true);
        setIfElseNodeId(nodeId);
        setIfElseAction(selectedNode.data.action);
        setCurrentIfElseAction(selectedNode.data.action);
        const relatedBranches = currentNodes.filter(
          (node: Node) =>
            node.type === "BranchNode" && node.data.parentNodeId === nodeId
        );
        const sortedBranches = [...relatedBranches].sort(
          (a, b) => (a.data.branchIndex ?? 0) - (b.data.branchIndex ?? 0)
        );

        setBranches(sortedBranches);
        setCurrentBranches(JSON.parse(JSON.stringify(sortedBranches)));
      }
      return currentNodes;
    });
  };

  useEffect(() => {
    // Ensure it only renders once
    // Instead of disabling StrictMode
    if (initialized.current) return;
    initialized.current = true;
    // Initialize nodes and edges (StartNode, AddNode and EndNode)
    const nodes: Node[] = [
      {
        id: `${nodeIdCounter.current++}`,
        type: "StartNode",
        data: { label: "Start Node" },
        position: { x: 100, y: 0 },
      },
      {
        id: `${nodeIdCounter.current++}`,
        type: "AddNode",
        data: { label: "+", onClick: handleAddNode },
        position: { x: 100, y: 100 },
      },
      {
        id: `${nodeIdCounter.current++}`,
        type: "EndNode",
        data: { label: "End Node" },
        position: { x: 100, y: 170 },
      },
    ];
    const edges: Edge[] = [
      {
        id: `${edgeIdCounter.current++}`,
        source: "1",
        target: "2",
        sourceHandle: "StartNodeHandle",
        targetHandle: "AddNodeTopHandle",
        type: "step",
      },
      {
        id: `${edgeIdCounter.current++}`,
        source: "2",
        target: "3",
        sourceHandle: "AddNodeBottomHandle",
        targetHandle: "EndNodeHandle",
        type: "step",
      },
    ];
    setNodes(nodes);
    setEdges(edges);
  }, []);

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

  const handleSaveActionNode = () => {
    setNodes((nodes: Node[]) =>
      nodes.map((node: Node) =>
        node.id === actionNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                action: action,
              },
            }
          : node
      )
    );
    setEditModalOpen(false);
  };

  const handleSaveIfElseNode = (editedBranches: Node[]) => {
    setNodes((nodes: Node[]) =>
      nodes.map((node: Node) => {
        if (node.id === ifElseNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              action: ifElseAction,
            },
          };
        }

        const updatedBranch = editedBranches.find((b) => b.id === node.id);
        if (updatedBranch) {
          return {
            ...node,
            data: {
              ...node.data,
              label: updatedBranch.data.label,
            },
          };
        }

        return node;
      })
    );
    setIfElseNodeModalOpen(false);
  };

  const updateEditedBranchLabel = (branchIndex: number, newLabel: string) => {
    setBranches((branches: Node[]) =>
      branches.map((branch: Node) =>
        branch.data.branchIndex === branchIndex
          ? {
              ...branch,
              data: {
                ...branch.data,
                label: newLabel,
              },
            }
          : branch
      )
    );
  };

  const deleteBranch = useCallback((branchId: string) => {
    setNodes((currentNodes) => {
      const index = currentNodes.findIndex((n) => n.id === branchId);
      if (index === -1) return currentNodes;

      const branchNode = currentNodes[index];
      const addNode = currentNodes[index + 1];
      const endNode = currentNodes[index + 2];

      const idsToRemove = [branchNode.id];
      if (addNode?.type === "AddNode") idsToRemove.push(addNode.id);
      if (endNode?.type === "EndNode") idsToRemove.push(endNode.id);

      const updatedNodes = currentNodes.filter(
        (n) => !idsToRemove.includes(n.id)
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (e) =>
            !idsToRemove.includes(e.source) && !idsToRemove.includes(e.target)
        )
      );

      return updatedNodes;
    });

    setBranches((prev) => prev.filter((b) => b.id !== branchId));
  }, []);

  console.log("Edges: ", edges);
  console.log("Nodes: ", nodes);

  return (
    <ReactFlowProvider>
      <div className="h-screen" ref={reactFlowWrapper}>
        <Modal
          header={<div>Select Node Type</div>}
          body={
            <div className="space-y-2 py-5">
              <button
                onClick={() => {
                  handleAddNode(addNodeId, true, "ActionNode");
                  setAddNodeModalOpen(false);
                }}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Action Node
              </button>
              <button
                onClick={() => {
                  handleAddNode(addNodeId, true, "IfElseNode");
                  setAddNodeModalOpen(false);
                }}
                className="w-full bg-yellow-500 text-white py-2 rounded"
              >
                If / Else Node
              </button>
            </div>
          }
          footer={<></>}
          visibility={addNodeModalOpen}
          closeEvent={() => setAddNodeModalOpen(false)}
        />
        <Modal
          header={
            <div>
              <div>Action</div>
              <div>{currentAction}</div>
            </div>
          }
          body={
            <>
              <div className="w-80 py-5">
                <div className="text-lg font-semibold mb-2">Action Name</div>
                <input
                  type="text"
                  placeholder="Enter action name"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 duration-200">
                  + Add field
                </button>
              </div>
            </>
          }
          footer={
            <>
              <div className="flex justify-between items-center w-full p-4">
                <button
                  onClick={() => handleDeleteNode(actionNodeId)}
                  className="border-red-500 border-2 bg-red-200 text-red-500 font-semibold px-4 py-2 rounded hover:bg-red-300 duration-200"
                >
                  Delete
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveActionNode}
                    className="border-purple-600 border-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-300 duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          }
          visibility={editModalOpen}
          closeEvent={() => setEditModalOpen(false)}
        />
        <Modal
          header={
            <div>
              <div>Action</div>
              <div>{currentIfElseAction}</div>
            </div>
          }
          body={
            <>
              <div className="w-80 py-5">
                <div className="text-lg font-semibold mb-3">Action Name</div>
                <input
                  type="text"
                  placeholder="Enter action name"
                  value={ifElseAction}
                  onChange={(e) => setIfElseAction(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-6"
                />

                <div className="text-md font-semibold mb-2">BRANCHES</div>
                <div className="space-y-3">
                  {branches
                    .filter((b) => b.data.branchIndex >= 0)
                    .map((branch, index) => (
                      <div
                        key={branch.id}
                        className="bg-gray-100 rounded p-3 relative"
                      >
                        <div className="flex">
                          <input
                            type="text"
                            value={branch.data.label}
                            onChange={(e) => {
                              updateEditedBranchLabel(
                                branch.data.branchIndex,
                                e.target.value
                              );
                            }}
                            className="w-[90%] p-2 border border-gray-300 rounded pr-10"
                          />
                          <button
                            onClick={() => {
                              deleteBranch(branch.id);
                            }}
                            className="w-[10%] flex items-center justify-center text-gray-400 hover:text-red-500 font-bold"
                          >
                            <IoClose className="text-xl" />
                          </button>
                        </div>
                        <button className="text-sm text-blue-600 mt-2 hover:underline">
                          + Add filter
                        </button>
                      </div>
                    ))}

                  <button
                    onClick={() => {
                      addBranchToIfElseNode(ifElseNodeId);
                      setIfElseNodeModalOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add branch
                  </button>
                </div>

                <div className="text-md font-semibold mt-6 mb-2">ELSE</div>
                <div className="bg-gray-100 rounded p-3">
                  <input
                    type="text"
                    value={
                      branches.find((b) => b.data.branchIndex === -1)?.data
                        .label || ""
                    }
                    onChange={(e) =>
                      updateEditedBranchLabel(-1, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </>
          }
          footer={
            <>
              <div className="flex justify-end items-center w-full p-4">
                <div className="space-x-2">
                  <button
                    onClick={() => setIfElseNodeModalOpen(false)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveIfElseNode(branches)}
                    className="border-purple-600 border-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-300 duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          }
          visibility={ifElseNodeModalOpen}
          closeEvent={() => setIfElseNodeModalOpen(false)}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={nodeTypes}
        >
          <Background variant={backgroundVariant} />
          <Controls></Controls>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};
