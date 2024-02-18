import React from "react";
import classNames from "classnames";

export const MODAL_BOX_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

interface ModalTitleProps {
  children: React.ReactNode;
}
export const ModalTitle: React.FC<ModalTitleProps> = ({ children }) => {
  return <p className="modal-title text-xl font-bold">{children}</p>;
};

interface ModalFooterProps {
  children: React.ReactNode;
  justify?: "start" | "end" | "center" | "between" | "around" | "normal";
}
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  justify = "end",
}) => {
  return (
    <div
      className={classNames("modal-footer flex", {
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
        "justify-normal": justify === "normal",
        "justify-end": justify === "end",
      })}
    >
      {children}
    </div>
  );
};
