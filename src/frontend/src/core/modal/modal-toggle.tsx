import { ComponentPropsWithoutRef, ElementType } from "react";

import { useModal } from "./context";
import { Flex, FlexProps } from "../layout";

export type ModalToggleProps<Modal extends ElementType = ElementType> =
  FlexProps & {
    modal: Modal;
    modalProps?: Omit<ComponentPropsWithoutRef<Modal>, "isOpen" | "onClose">;
  };

export const ModalToggle = <Modal extends ElementType>({
  children,
  modal,
  modalProps: providedModalProps,
  ...otherProps
}: ModalToggleProps<Modal>) => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(modal, providedModalProps);
  };

  return (
    <Flex
      alignItems="center"
      onClick={(e) => {
        handleClick();
        e.stopPropagation();
      }}
      tabIndex={0}
      {...otherProps}
    >
      {children}
    </Flex>
  );
};
