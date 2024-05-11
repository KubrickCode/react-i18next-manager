import { Flex, FlexProps } from "@chakra-ui/react";
import { createElement } from "react";

import { useModalToggle } from "../modal";

export type ModalToggleProps<
  Modal extends React.ElementType = React.ElementType
> = FlexProps & {
  modal: Modal;
  modalProps?: Omit<
    React.ComponentPropsWithoutRef<Modal>,
    "isOpen" | "onClose"
  >;
};

export const ModalToggle = ({
  children,
  modal,
  modalProps: providedModalProps,
  ...otherProps
}: ModalToggleProps) => {
  const { getModalProps, getToggleProps } = useModalToggle();

  return (
    <>
      <Flex
        alignItems="center"
        maxWidth="fit-content"
        tabIndex={0}
        {...getToggleProps()}
        {...otherProps}
      >
        {children}
      </Flex>
      {getModalProps().isOpen &&
        createElement(modal, {
          children,
          ...providedModalProps,
          ...getModalProps(),
        })}
    </>
  );
};
