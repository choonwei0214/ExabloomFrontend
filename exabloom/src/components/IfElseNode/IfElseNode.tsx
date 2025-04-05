import { Handle, Position, useNodeId } from "reactflow";
import { TbArrowFork } from "react-icons/tb";

interface NodeDataProps<T = any> {
  data: T;
}

export const IfElseNode = ({ data }: NodeDataProps) => {
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
        id="IfElseNodeTopHandle"
      />
      <div className="flex items-stretch gap-x-2">
        <div className="bg-yellow-100 rounded-md border border-yellow-200 flex items-center px-2">
          <TbArrowFork className="text-yellow-700 text-xl" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm font-semibold text-yellow-700">If Else Node</div>
          <div className="text-sm text-gray-700">{data.action}</div>
        </div>
      </div>
      <Handle
        isConnectable
        type="source"
        position={Position.Bottom}
        id="IfElseNodeBottomHandle"
      />
    </div>
  );
};
