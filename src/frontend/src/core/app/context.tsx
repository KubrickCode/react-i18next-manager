import { createContext, PropsWithChildren, useContext } from "react";

import { useSuspenseQuery } from "~/core/react-query";
import { SchemaDto } from "../codegen";

type State = {
  locales: SchemaDto<"GetLocalesResDto">["locales"];
};

const AppContext = createContext<State>({
  locales: [],
});

export const useApp = () => useContext(AppContext);

type AppContextProviderProps = PropsWithChildren;

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { data } =
    useSuspenseQuery<SchemaDto<"GetLocalesResDto">>("/api/locales");

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
