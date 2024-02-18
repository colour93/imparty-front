import React from "react";
import { MODAL_BOX_STYLE, ModalFooter, ModalTitle } from "./frame";
import { Modal, Backdrop, Fade, Box } from "@mui/material";

interface Props {
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  title: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  afterClose?: () => void | Promise<() => void>;
}

export const CommonModal: React.FC<Props> = ({
  visible,
  setVisible,
  title,
  footer,
  children,
  afterClose,
}) => {
  return (
    <Modal
      open={visible}
      onClose={() => setVisible?.(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      onTransitionExited={() => {
        afterClose?.();
      }}
    >
      <Fade in={visible}>
        <Box sx={MODAL_BOX_STYLE}>
          <div className="flex flex-col gap-6">
            <ModalTitle>{title}</ModalTitle>
            {children}
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
