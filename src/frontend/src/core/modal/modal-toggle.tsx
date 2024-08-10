import { Flex, FlexProps, useDisclosure } from "@chakra-ui/react";
import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  Suspense,
  createContext,
  createElement,
  useContext,
} from "react";

import { Loader } from "../loader";
import { Modal } from "./modal";

export type ModalToggleProps<Modal extends ElementType> = FlexProps & {
  modal: Modal;
  modalProps?: ComponentPropsWithoutRef<Modal>;
};

export const ModalToggle = <Modal extends ElementType>({
  children,
  modal,
  modalProps,
  ...otherProps
}: ModalToggleProps<Modal>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" onClick={onOpen} tabIndex={0} {...otherProps}>
        {children}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalProvider onClose={onClose}>
          <Suspense fallback={<Loader.Block />}>
            {createElement(modal, {
              ...modalProps,
            })}
          </Suspense>
        </ModalProvider>
      </Modal>
    </>
  );
};

const ModalContext = createContext<{ onClose: () => void } | undefined>(
  undefined
);

type ModalProviderProps = PropsWithChildren & {
  onClose: () => void;
};

const ModalProvider = ({ children, onClose }: ModalProviderProps) => (
  <ModalContext.Provider value={{ onClose }}>{children}</ModalContext.Provider>
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
