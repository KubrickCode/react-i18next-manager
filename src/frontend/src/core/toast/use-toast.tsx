import { UseToastOptions, useToast as useChakraToast } from "@chakra-ui/react";

export const useToast = () => {
  const toast = useChakraToast();
  return (props: Partial<UseToastOptions>) => {
    const { duration, isClosable, position, status, title } = props;
    toast({
      ...props,
      duration: duration ?? 3000,
      isClosable: isClosable ?? true,
      position: position ?? "bottom-left",
      status: status ?? "success",
      title,
    });
  };
};
