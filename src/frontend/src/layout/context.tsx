import { createContext, PropsWithChildren, useContext, useState } from "react";

import { GetGroupsResDto, GetLocalesResDto } from "~/core/codegen";
import { useQuery } from "~/core/react-query";

type Group = {
  id: string;
  label: string;
};

type QueryState = {
  groups: GetGroupsResDto["groups"];
  locales: GetLocalesResDto["locales"];
};

type State = {
  selectedGroup: Group | null;
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
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
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
