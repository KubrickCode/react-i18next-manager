import { StackProps, VStack } from "@chakra-ui/react";
import { useQuery } from "@core/react-query";

export const Page = ({ ...otherProps }: StackProps) => {
  const { data } = useQuery("/translations", "getTranslations");
  console.log(data);
  return <VStack align="stretch" padding="1rem" width="auto" {...otherProps} />;
};
