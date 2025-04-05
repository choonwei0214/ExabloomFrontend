import { Handle, Position, useNodeId } from "reactflow";
import { TbUserEdit } from "react-icons/tb";

interface NodeDataProps<T = any> {
  data: T;
}

export const ActionNode = ({ data }: NodeDataProps) => {
  const nodeId = useNodeId();

  return (
    <div
      className="border bg-white p-4 rounded-md w-64"
      onClick={() => data.onClick(nodeId)}
    >
      <Handle
        isConnectable
        type="target"
        position={Position.Top}
        id="ActionNodeTopHandle"
      />
      <div className="flex items-stretch gap-x-2">
        <div className="bg-blue-200 rounded-md border border-blue-200 flex items-center px-2">
          <TbUserEdit className="text-blue-700 text-xl" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm font-semibold text-blue-700">Action Node</div>
          <div className="text-sm text-gray-700">{data.action}</div>
        </div>
      </div>
      <Handle
        isConnectable
        type="source"
        position={Position.Bottom}
        id="ActionNodeBottomHandle"
      />
    </div>
  );
};
