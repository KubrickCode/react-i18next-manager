import { createContext, PropsWithChildren, useContext, useState } from "react";

import { GetGroupsResDto } from "~/core/codegen";
import { KEY, LINK, useQuery } from "~/core/react-query";

type SelectedGroup = {
  id: string;
  label: string;
} | null;

type State = {
  groups: GetGroupsResDto["groups"];
  selectedGroup: SelectedGroup;
};

type Action = {
  handleSelectedGroup: (group: State["selectedGroup"]) => void;
};

const initialState: State = {
  groups: [],
  selectedGroup: null,
};

const initialActions: Action = {
  handleSelectedGroup: () => {},
};

const LayoutContext = createContext<State & Action>({
  ...initialState,
  ...initialActions,
});

export const useLayout = () => useContext(LayoutContext);

type LayoutContextProviderProps = PropsWithChildren;

export const LayoutContextProvider = ({
  children,
}: LayoutContextProviderProps) => {
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const { data, error, isLoading } = useQuery<GetGroupsResDto>(
    LINK.GET_GROUPS,
    KEY.GET_GROUPS
  );

  if (isLoading) return <>Loading...</>;
  if (error) return <>{error.message}</>;
  if (!data) return <>ERROR</>;

  const { groups } = data;

  const stateValue: State = {
    groups,
    selectedGroup,
  };

  const actionValue: Action = {
    handleSelectedGroup: (group: SelectedGroup) => setSelectedGroup(group),
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
