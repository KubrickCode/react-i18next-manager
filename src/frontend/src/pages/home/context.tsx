import { createContext, PropsWithChildren, useContext, useState } from "react";
import { SchemaDto } from "~/core/codegen";

import { useSuspenseQuery } from "~/core/react-query";

type SelectedGroup = {
  id: string;
  label: string;
} | null;

type State = {
  groups: SchemaDto<"GetGroupsResDto">["groups"];
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

const HomePageContext = createContext<State & Action>({
  ...initialState,
  ...initialActions,
});

export const useHomePageContext = () => useContext(HomePageContext);

type HomePageContextProviderProps = PropsWithChildren;

export const HomePageContextProvider = ({
  children,
}: HomePageContextProviderProps) => {
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const { data } =
    useSuspenseQuery<SchemaDto<"GetGroupsResDto">>("/api/groups");

  const { groups } = data;

  const stateValue: State = {
    groups,
    selectedGroup,
  };

  const actionValue: Action = {
    handleSelectedGroup: (group: SelectedGroup) => setSelectedGroup(group),
  };

  return (
    <HomePageContext.Provider
      value={{
        ...stateValue,
        ...actionValue,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};
