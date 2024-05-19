import { createContext, PropsWithChildren, useContext, useState } from "react";

import { GetGroupsResDto } from "~/core/codegen";
import { useQuery } from "~/core/react-query";

type Group = {
  id: string;
  label: string;
};

type QueryState = {
  groups: GetGroupsResDto["groups"];
};

type State = {
  selectedGroup: Group | null;
} & QueryState;

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

export const useLayoutContext = () => useContext(LayoutContext);

type LayoutContextProviderProps = PropsWithChildren;

export const LayoutContextProvider = ({
  children,
}: LayoutContextProviderProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { data, error, isLoading } = useQuery<GetGroupsResDto>(
    "/groups",
    "getGroups"
  );

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const stateValue: State = {
    groups: data.groups,
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
