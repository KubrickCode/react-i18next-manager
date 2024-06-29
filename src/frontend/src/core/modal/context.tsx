import {
  ElementType,
  PropsWithChildren,
  Suspense,
  createContext,
  useContext,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { ModalProps } from "./modal";
import { Loader } from "../loader";

type ModalComponentProps<T = {}> = Partial<ModalProps> & T;

type ModalContextProps = {
  openModal: <T = {}>(
    modal: ElementType,
    props?: ModalComponentProps<T>
  ) => void;
  closeModal: (id: string) => void;
};

type ModalState<T = {}> = {
  id: string;
  modal: ElementType;
  props: ModalComponentProps<T>;
};

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const openModal = <T = {},>(
    modal: ElementType,
    props: ModalComponentProps<T> = {} as ModalComponentProps<T>
  ) => {
    setModals((prev) => [...prev, { id: uuidv4(), modal, props }]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map(({ id, modal: Modal, props }) => (
        <Suspense fallback={<Loader.FullScreen />}>
          <Modal
            key={id}
            isOpen={true}
            onClose={() => closeModal(id)}
            {...props}
          />
        </Suspense>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");

  return context;
};
