import { createContext, PropsWithChildren, useContext } from "react";

import { GetLocalesResDto } from "~/core/codegen";
import { useSuspenseQuery } from "~/core/react-query";

type State = {
  locales: GetLocalesResDto["locales"];
};

const AppContext = createContext<State>({
  locales: [],
});

export const useApp = () => useContext(AppContext);

type AppContextProviderProps = PropsWithChildren;

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { data } = useSuspenseQuery<GetLocalesResDto>("/api/locales");

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
