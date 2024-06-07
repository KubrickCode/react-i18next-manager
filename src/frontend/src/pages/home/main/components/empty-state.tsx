import { useApp } from "~/core/app";
import { Button } from "~/core/button";
import { Flex } from "~/core/layout";
import { ModalToggle } from "~/core/modal";
import { Text } from "~/core/text";
import { LocaleManagementModal } from "~/shared/locale-management-modal";

export const EmptyState = () => {
  const { locales } = useApp();

  if (locales.length > 0) return null;

  return (
    <Flex gap={2}>
      <Text>Please</Text>
      <ModalToggle modal={LocaleManagementModal}>
        <Button size="sm" textDecoration="underline" variant="link">
          Add Locale
        </Button>
      </ModalToggle>
      <Text>First</Text>
    </Flex>
  );
};
