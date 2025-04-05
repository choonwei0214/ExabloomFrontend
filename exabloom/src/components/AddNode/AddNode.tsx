import { useNodeConnections } from "@xyflow/react";
import {
  Edge,
  Handle,
  Node,
  Position,
  useNodeId,
  useNodes,
  useEdges,
} from "reactflow";

interface NodeDataProps<T = any> {
  data: T;
}

export const AddNode = ({ data }: NodeDataProps) => {
  const nodeId = useNodeId();

  return (
    <div className="py-2 w-64" onClick={() => data.onClick(nodeId, false, null)}>
      <Handle
        isConnectable
        type="target"
        position={Position.Top}
        id="AddNodeTopHandle"
      />
      <div className="flex items-center justify-center text-gray-500">+</div>
      <Handle
        isConnectable
        type="source"
        position={Position.Bottom}
        id="AddNodeBottomHandle"
      />
    </div>
  );
};
