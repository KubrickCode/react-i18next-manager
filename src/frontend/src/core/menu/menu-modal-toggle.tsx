import { ReactElement } from "react";

import { MenuItem, MenuItemProps } from "./menu-item";
import { ModalToggle } from "../modal";

export type MenuModalToggleProps<ModalProps> = MenuItemProps & {
  modal: ReactElement<ModalProps>;
};

export const MenuModalToggle = <ModalProps,>({
  children,
  icon,
  modal,
  ...menuItemProps
}: MenuModalToggleProps<ModalProps>) => {
  return (
    <ModalToggle modal={modal}>
      <MenuItem icon={icon} {...menuItemProps}>
        {children}
      </MenuItem>
    </ModalToggle>
  );
};
