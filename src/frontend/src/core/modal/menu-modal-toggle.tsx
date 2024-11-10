import { ComponentPropsWithoutRef, ElementType } from "react";
import { MenuItem, MenuItemProps } from "@chakra-ui/react";

import { ModalToggle } from ".";

export type MenuModalToggleProps<Modal extends ElementType> = MenuItemProps & {
  modal: Modal;
  modalProps?: ComponentPropsWithoutRef<Modal>;
};

export const MenuModalToggle = <ModalProps extends ElementType>({
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
