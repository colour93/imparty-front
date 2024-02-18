import { createRoot } from "react-dom/client";
import { CommonModal } from "../template";
import React, { useState } from "react";
import { Button } from "@mui/material";

interface Props {
  onOk?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  afterClose?: () => void | Promise<void>;
  content?: React.ReactNode;
  title?: React.ReactNode;
}

export const ConfirmModal = (props: Props) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  const destroy = () => {
    setTimeout(() => {
      root.unmount();
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    });
  };

  const CofirmModalContent: React.FC<{ renderProps: Props }> = ({
    renderProps,
  }) => {
    const { afterClose } = renderProps;
    const [visible, setVisible] = useState(true);
    return (
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        title={props.title ?? "二次确认"}
        footer={
          <>
            <Button
              onClick={() => {
                setVisible(false);
                props.onCancel?.();
              }}
            >
              <span>取消</span>
            </Button>
            <Button
              onClick={() => {
                setVisible(false);
                props.onOk?.();
              }}
            >
              <span>确定</span>
            </Button>
          </>
        }
        afterClose={() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          afterClose?.(...args);
          destroy();
        }}
      >
        {props.content ?? <div>您确定吗？</div>}
      </CommonModal>
    );
  };

  const render = (renderProps: Props) => {
    root.render(<CofirmModalContent renderProps={renderProps} />);
  };

  const update = (newConfig: Props) => {
    props = {
      ...props,
      ...newConfig,
    };
    render(props);
  };

  const close = () => {
    props = {
      ...props,
    };
    render(props);
  };

  render(props);

  return {
    destroy: close,
    update,
  };
};
