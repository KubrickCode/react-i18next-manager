import { ComponentPropsWithoutRef, ElementType } from "react";

import { useModal } from "../modal";
import { MenuItem, MenuItemProps } from "./menu-item";

export type MenuModalToggleProps<Modal extends ElementType = ElementType> =
  MenuItemProps & {
    modal: Modal;
    modalProps?: Omit<ComponentPropsWithoutRef<Modal>, "isOpen" | "onClose">;
  };

export const MenuModalToggle = <Modal extends ElementType>({
  children,
  icon,
  modal,
  modalProps: providedModalProps,
}: MenuModalToggleProps<Modal>) => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(modal, providedModalProps);
  };

  return (
    <MenuItem icon={icon} onClick={handleClick}>
      {children}
    </MenuItem>
  );
};
