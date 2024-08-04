import { Flex, FlexProps, useDisclosure } from "@chakra-ui/react";
import {
  PropsWithChildren,
  ElementType,
  Suspense,
  createContext,
  useContext,
} from "react";

import { Modal } from "./modal";
import { Loader } from "../loader";

export type ModalToggleProps<ModalProps> = FlexProps & {
  modal: ElementType;
  modalProps?: ModalProps;
};

export const ModalToggle = <ModalProps,>({
  children,
  modal: ModalContent,
  modalProps,
  ...otherProps
}: ModalToggleProps<ModalProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" onClick={onOpen} tabIndex={0} {...otherProps}>
        {children}
      </Flex>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalProvider onClose={onClose}>
            <Suspense fallback={<Loader.Block />}>
              <ModalContent {...modalProps} />
            </Suspense>
          </ModalProvider>
        </Modal>
      )}
    </>
  );
};

const ModalContext = createContext<{ onClose: () => void } | undefined>(
  undefined
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }

  return context;
};

type ModalProviderProps = PropsWithChildren & {
  onClose: () => void;
};

const ModalProvider = ({ children, onClose }: ModalProviderProps) => {
  return (
    <ModalContext.Provider value={{ onClose }}>
      {children}
    </ModalContext.Provider>
  );
};
