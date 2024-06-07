import { createContext, PropsWithChildren, useContext } from "react";

import { GetLocalesResDto } from "~/core/codegen";
import { KEY, LINK, useQuery } from "~/core/react-query";

type State = {
  locales: GetLocalesResDto["locales"];
};

const AppContext = createContext<State>({
  locales: [],
});

export const useApp = () => useContext(AppContext);

type AppContextProviderProps = PropsWithChildren;

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { data, error, isLoading } = useQuery<GetLocalesResDto>(
    LINK.GET_LOCALES,
    KEY.GET_LOCALES
  );

  if (isLoading) return <>Loading...</>;
  if (error) return <>{error.message}</>;
  if (!data) return <>ERROR</>;

  const { locales } = data;

  return (
    <AppContext.Provider
      value={{
        locales,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};