import { createContext, PropsWithChildren, useContext, useState } from "react";

import { GetGroupsResDto, GetLocalesResDto } from "~/core/codegen";
import { useQuery } from "~/core/react-query";
import { GET_GROUPS, GET_LOCALES } from "~/core/react-query/keys";

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
};

type Action = {
  handleSelectedGroup: (group: State["selectedGroup"]) => void;
};

const initialQueryState: QueryState = {
  groups: [],
  locales: [],
};

const initialState: State = {
  selectedGroup: null,
};

const initialActions: Action = {
  handleSelectedGroup: () => {},
};

const LayoutContext = createContext<QueryState & State & Action>({
  ...initialQueryState,
  ...initialState,
  ...initialActions,
});

export const useLayoutContext = () => useContext(LayoutContext);

type LayoutContextProviderProps = PropsWithChildren;

export const LayoutContextProvider = ({
  children,
}: LayoutContextProviderProps) => {
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const groupsQueryResult = useQuery<GetGroupsResDto>("/groups", GET_GROUPS);

  const localesQueryResult = useQuery<GetLocalesResDto>(
    "/locales",
    GET_LOCALES
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

  const queryStateValue: QueryState = {
    groups,
    locales,
  };

  const stateValue: State = {
    selectedGroup,
  };

  const actionValue: Action = {
    handleSelectedGroup: (group: SelectedGroup) => setSelectedGroup(group),
  };

  return (
    <LayoutContext.Provider
      value={{
        ...queryStateValue,
        ...stateValue,
        ...actionValue,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
