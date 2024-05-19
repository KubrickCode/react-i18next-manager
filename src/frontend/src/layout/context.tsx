import { createContext, PropsWithChildren, useContext, useState } from "react";

type Group = {
  id: string;
  label: string;
};

type State = {
  selectedGroup: Group | null;
};

type Action = {
  handleSelectedGroup: (group: State["selectedGroup"]) => void;
};

const initialState: State = {
  selectedGroup: null,
};

const initialActions: Action = {
  handleSelectedGroup: () => {},
};

const LayoutContext = createContext<State & Action>({
  ...initialState,
  ...initialActions,
});

export const useLayoutContext = () => useContext(LayoutContext);

type LayoutContextProviderProps = PropsWithChildren;

export const LayoutContextProvider = ({
  children,
}: LayoutContextProviderProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const stateValue: State = {
    selectedGroup,
  };

  const actionValue: Action = {
    handleSelectedGroup: (group: Group | null) => setSelectedGroup(group),
  };

  return (
    <LayoutContext.Provider
      value={{
        ...stateValue,
        ...actionValue,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
