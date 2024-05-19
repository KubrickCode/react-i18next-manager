import { useState } from "react";

import { Button } from "~/core/button";
import { AddTranslationReqBodyDto } from "~/core/codegen";
import { LABELS } from "~/core/constants";
import { Input } from "~/core/input";
import { VStack } from "~/core/layout";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { useMutation } from "~/core/react-query";
import { Text } from "~/core/text";
import { useLayoutContext } from "~/layout/context";

type AddTranslationModalProps = ModalProps;

export const AddTranslationModal = ({
  isOpen,
  onClose,
}: AddTranslationModalProps) => {
  const { locales, selectedGroup } = useLayoutContext();

  const [key, setKey] = useState("");
  const [values, setValues] = useState<{ localeId: string; value: string }[]>(
    locales.map((locale) => ({ localeId: locale.id, value: "" }))
  );

  const { mutate: addTranslation } = useMutation<AddTranslationReqBodyDto>({
    refetchQueryKeys: [[`getTranslations-${selectedGroup?.id}}`]],
  });

  const handleSubmit = () => {
    addTranslation({
      link: `/translations/${selectedGroup?.id}`,
      method: "post",
      body: {
        key,
        values,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Add Translation</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" gap={5}>
          <VStack alignItems="baseline">
            <Text fontSize="xs" fontWeight="lighter">
              Group
            </Text>
            <Text fontWeight="semibold">{selectedGroup?.label}</Text>
          </VStack>
          <VStack alignItems="baseline" width="full">
            <Text fontSize="xs" fontWeight="lighter">
              Key
            </Text>
            <Input onChange={(e) => setKey(e.target.value)} value={key} />
          </VStack>
          {locales.map((locale) => (
            <VStack key={locale.id} alignItems="baseline" width="full">
              <Text fontSize="xs" fontWeight="lighter">
                {locale.label}
              </Text>
              <Input
                onChange={(e) =>
                  setValues((prev) =>
                    prev.map((val) => {
                      if (val.localeId === locale.id) {
                        return { ...val, value: e.target.value };
                      }
                      return val;
                    })
                  )
                }
                value={
                  values.find((val) => val.localeId === locale.id)?.value || ""
                }
              />
            </VStack>
          ))}
        </VStack>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="darkgray" onClick={handleSubmit}>
          {LABELS.SAVE}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
