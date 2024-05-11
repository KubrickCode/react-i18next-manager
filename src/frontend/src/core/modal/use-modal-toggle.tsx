import { useDisclosure } from "@chakra-ui/react";
import React from "react";

export const useModalToggle = () => {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const getModalProps = () => ({
    isOpen,
    onClose,
  });

  const getToggleProps = () => ({
    onClick(event: React.MouseEvent) {
      event.stopPropagation();
      onToggle();
    },
  });

  return {
    getModalProps,
    getToggleProps,
    isOpen,
    onClose,
    onToggle,
  };
};
