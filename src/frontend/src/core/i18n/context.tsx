import i18n from "i18next";
import {
  Context,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation as useTranslationI18n,
} from "react-i18next";

import resources from "./i18n.json";

const DEFAULT_LANGUAGE = "en";

const STORAGE_KEY = "i18n.lng";

i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  keySeparator: false,
  lng: localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE,
  resources,
});

type I18nContextType = {
  changeLanguage: (language: string) => void;
  language: string;
};

const I18nContext = createContext<I18nContextType>({
  changeLanguage: () => {
    throw new Error("I18nContext has not been provided!");
  },
  language: DEFAULT_LANGUAGE,
});

export const I18nProvider = ({ children }: { children?: JSX.Element }) => {
  const forceUpdate = useForceUpdate();

  const changeLanguage = useCallback(
    (language: string) => {
      localStorage.setItem(STORAGE_KEY, language);
      i18n.changeLanguage(language);

      document.documentElement.setAttribute("lang", language);

      forceUpdate();
    },
    [forceUpdate]
  );

  const context = {
    changeLanguage,
    language: i18n.language,
  };

  return (
    <I18nContext.Provider value={context}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContextOrThrow(I18nContext);

const useForceUpdate = () => {
  const [, setTick] = useState(0);

  return useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
};

const useContextOrThrow: <ContextType>(
  context: Context<ContextType>
) => ContextType = (context) => {
  const contextValue = useContext(context);
  if (contextValue == null) {
    throw new Error("Context has not been provided!");
  }
  return contextValue;
};

export const useTranslation = useTranslationI18n;
