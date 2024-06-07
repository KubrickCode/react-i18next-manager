import { ComponentPropsWithoutRef, ElementType } from "react";
import { Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

import { Box, Flex, HStack } from "../layout";
import { useModal } from "../modal";
import { MenuItem, MenuItemProps } from "./menu-item";

export type MenuModalToggleProps<Modal extends ElementType = ElementType> =
  Omit<MenuItemProps, "icon"> & {
    icon?: IconType;
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
    <MenuItem onClick={handleClick}>
      {icon ? (
        <Flex alignItems="center" minWidth="100%">
          <HStack spacing={2}>
            <Icon as={icon} />
            <Box flexGrow={1}>{children}</Box>
          </HStack>
        </Flex>
      ) : (
        children
      )}
    </MenuItem>
  );
};
