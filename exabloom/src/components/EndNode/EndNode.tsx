import { Handle, Position } from "reactflow";

export const EndNode = () => {
  return (
    <div className="border p-5 bg-gray-200 border-gray-500 rounded-full w-64">
      <Handle isConnectable type="target" position={Position.Top} id="EndNodeHandle" />
      <div className="flex items-center justify-center text-gray-500">END</div>
    </div>
  );
};
