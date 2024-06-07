import { useApp } from "~/core/app";
import { Button } from "~/core/button";
import { Flex } from "~/core/layout";
import { ModalToggle } from "~/core/modal";
import { Text } from "~/core/text";
import { LocaleManagementModal } from "~/shared/locale-management-modal";

export const HomePageEmptySection = () => {
  const { locales } = useApp();

  return (
    <Flex alignItems="center" gap={2}>
      {locales.length < 1 ? (
        <>
          <Text>Please</Text>
          <ModalToggle modal={LocaleManagementModal}>
            <Button size="sm" textDecoration="underline" variant="link">
              Add Locale
            </Button>
          </ModalToggle>
          <Text>First</Text>
        </>
      ) : (
        <Text>There is no group selected</Text>
      )}
    </Flex>
  );
};
