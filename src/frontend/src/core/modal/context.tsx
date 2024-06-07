import {
  ElementType,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { ModalProps } from "./modal";

type ModalComponentProps<T = {}> = Partial<ModalProps> & T;

type ModalContextProps = {
  openModal: <T = {}>(
    Component: ElementType,
    props?: ModalComponentProps<T>
  ) => void;
  closeModal: (id: string) => void;
};

type ModalState<T = {}> = {
  id: string;
  Component: ElementType;
  props: ModalComponentProps<T>;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const openModal = <T = {},>(
    Component: ElementType,
    props: ModalComponentProps<T> = {} as ModalComponentProps<T>
  ) => {
    const id = uuidv4();
    setModals((prev) => [...prev, { id, Component, props }]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map(({ id, Component, props }) => (
        <Component
          key={id}
          isOpen={true}
          onClose={() => closeModal(id)}
          {...props}
        />
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");

  return context;
};
