import { createContext, PropsWithChildren, useContext, useState } from "react";

import { GetGroupsResDto, GetLocalesResDto } from "~/core/codegen";
import { useQuery } from "~/core/react-query";

type SelectedGroup = {
  id: string;
  label: string;
} | null;

type QueryState = {
  groups: GetGroupsResDto["groups"];
  locales: GetLocalesResDto["locales"];
};

type State = {
  selectedGroup: SelectedGroup;
} & QueryState;

type Action = {
  handleSelectedGroup: (group: State["selectedGroup"]) => void;
};

const initialState: State = {
  groups: [],
  locales: [],

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
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const groupsQueryResult = useQuery<GetGroupsResDto>("/groups", "getGroups");

  const localesQueryResult = useQuery<GetLocalesResDto>(
    "/locales",
    `getLocales`
  );

  if (!groupsQueryResult.data || !localesQueryResult.data) return <>ERROR</>;
  if (groupsQueryResult.error || localesQueryResult.error)
    return (
      <>
        {groupsQueryResult.error?.message ?? localesQueryResult.error?.message}
      </>
    );
  if (groupsQueryResult.isLoading || localesQueryResult.isLoading)
    return <>Loading...</>;

  const { groups } = groupsQueryResult.data;
  const { locales } = localesQueryResult.data;

  const stateValue: State = {
    groups,
    locales,
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
