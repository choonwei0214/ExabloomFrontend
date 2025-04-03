import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { TbMessage2Share } from "react-icons/tb";

export const StartNode = () => {
  return (
    <div className="border bg-white px-4 py-1 rounded-md w-48 h-16">
      <div className="flex items-center gap-x-4 h-4/5 bg-black">
        {/* <div className="bg-green-200 p-1 rounded-md border border-green-200">
          <TbMessage2Share className="text-green-700 text-xl"/>
        </div>
        <div>
          <div className="">Start Node</div>
          <div>Start</div>
        </div> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};
