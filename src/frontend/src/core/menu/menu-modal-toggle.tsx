import { Box, Flex, FlexProps, HStack, Icon } from "@chakra-ui/react";
import { createElement } from "react";
import { IconType } from "react-icons";

import { useModalToggle } from "~/core/modal";

import { MenuItem, MenuItemProps } from "./menu-item";

type ModalToggleProps<Modal extends React.ElementType = React.ElementType> =
  FlexProps & {
    modal: Modal;
    modalProps?: Omit<
      React.ComponentPropsWithoutRef<Modal>,
      "isOpen" | "onClose"
    >;
  };

export type MenuModalToggleProps = Omit<MenuItemProps, "icon"> &
  Pick<ModalToggleProps, "modal" | "modalProps"> & {
    icon?: IconType;
  };

export const MenuModalToggle = ({
  children,
  icon,
  modal,
  ...otherProps
}: MenuModalToggleProps) => {
  const { getModalProps, getToggleProps } = useModalToggle();

  return (
    <>
      <MenuItem onClick={getToggleProps().onClick}>
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
      {getModalProps().isOpen &&
        createElement(modal, {
          ...otherProps.modalProps,
          ...getModalProps(),
        })}
    </>
  );
};
