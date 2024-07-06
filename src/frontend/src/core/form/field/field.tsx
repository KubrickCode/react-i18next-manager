import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode, createContext } from "react";

export type FieldContextType = {
  optional: boolean;
  readonly: boolean;
};

export const FieldContext = createContext<FieldContextType>({
  optional: false,
  readonly: false,
});

export type FieldProps = BoxProps & {
  children: ReactNode;
  optional?: boolean;
  readonly?: boolean;
};

export const Field = ({
  children,
  optional = false,
  readonly = false,
  ...otherProps
}: FieldProps) => {
  return (
    <Box {...otherProps}>
      <FieldContext.Provider value={{ optional, readonly }}>
        {children}
      </FieldContext.Provider>
    </Box>
  );
};
