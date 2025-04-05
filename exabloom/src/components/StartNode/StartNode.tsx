import { Handle, Position } from "reactflow";
import { TbMessage2Share } from "react-icons/tb";

export const StartNode = () => {
  return (
    <div className="border bg-white p-4 rounded-md w-64">
      <div className="flex items-stretch gap-x-2">
        <div className="bg-green-200 rounded-md border border-green-200 flex items-center px-2">
          <TbMessage2Share className="text-green-700 text-xl" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm font-semibold text-green-700">Start Node</div>
          <div className="text-sm text-gray-700">Start</div>
        </div>
      </div>
      <Handle isConnectable type="source" position={Position.Bottom} id="StartNodeHandle" />
    </div>
  );
};
