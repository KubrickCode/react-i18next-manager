import { ElementType } from "react";

import { MenuItem, MenuItemProps } from "./menu-item";
import { ModalToggle } from "../modal";

export type MenuModalToggleProps<ModalProps> = MenuItemProps & {
  modal: ElementType;
  modalProps?: ModalProps;
};

export const MenuModalToggle = <ModalProps,>({
  children,
  icon,
  modal,
  modalProps,
  ...menuItemProps
}: MenuModalToggleProps<ModalProps>) => {
  return (
    <ModalToggle modal={modal} modalProps={modalProps}>
      <MenuItem icon={icon} {...menuItemProps}>
        {children}
      </MenuItem>
    </ModalToggle>
  );
};
