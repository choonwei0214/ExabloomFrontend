import { ReactElement, JSXElementConstructor } from "react";

interface ModalProps {
  header: any;
  body: ReactElement<any, string | JSXElementConstructor<any>>;
  footer: ReactElement<any, string | JSXElementConstructor<any>>;
  visibility: boolean;
  closeEvent: () => void;
}

export const Modal = ({
  header,
  body,
  footer,
  visibility,
  closeEvent,
}: ModalProps) => {
  return (
    <div className={`${visibility ? "show" : "hidden"}`} onClick={closeEvent}>
      <div className="fixed inset-0">
        <div className="absolute inset-0"></div>
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
        <div
          className={`bg-white rounded-lg shadow-lg cursor-default`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-6 border-b px-10 font-semibold text-xl flex w-full justify-between">
            {header}
          </div>
          <div className="px-10 rounded-lg">
            <div className="">{body}</div>
          </div>
          <div className="border-t min-h-fit">{footer}</div>
        </div>
      </div>
    </div>
  );
};
