import { Handle, Position } from "reactflow";

interface NodeDataProps<T = any> {
  data: T;
}

export const BranchNode = ({ data }: NodeDataProps) => {
  return (
    <div className="border p-5 bg-gray-200 border-gray-500 rounded-full w-64">
      <Handle isConnectable type="target" position={Position.Top} id="BranchNodeTopHandle" />
      <div className="flex items-center justify-center text-gray-500">{data.label}</div>
      <Handle isConnectable type="source" position={Position.Bottom} id="BranchNodeBottomHandle" />
    </div>
  );
};
