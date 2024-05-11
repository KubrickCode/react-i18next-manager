import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

export type ModalProps = {
  children?: React.ReactNode;
  isOpen: ChakraModalProps["isOpen"];
  onClose: ChakraModalProps["onClose"];
  size?: ChakraModalProps["size"];
};

export const Modal = ({
  children,
  isOpen,
  onClose,
  size = "md",
}: ModalProps) => {
  return (
    <ChakraModal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size={size}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </ChakraModal>
  );
};
