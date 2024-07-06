import { useState } from "react";

import { useApp } from "~/core/app";
import { Button } from "~/core/button";
import { AddTranslationReqBodyDto } from "~/core/codegen";
import { z } from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { Input } from "~/core/input";
import { VStack } from "~/core/layout";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, ENDPOINT, useMutation } from "~/core/react-query";
import { Text } from "~/core/text";
import { replaceBlank } from "~/core/utils";

const schema = z.object({
  key: z.string(),
  values: z.array(
    z.object({
      localeId: z.string().uuid(),
      value: z.string(),
    })
  ),
});

type AddTranslationModalProps = ModalProps & {
  selectedGroup: {
    id: string;
    label: string;
  };
};

export const AddTranslationModal = ({
  isOpen,
  onClose,
  selectedGroup,
}: AddTranslationModalProps) => {
  const { t } = useTranslation();
  const { locales } = useApp();

  const [key, setKey] = useState("");
  const [values, setValues] = useState<{ localeId: string; value: string }[]>(
    locales.map((locale) => ({ localeId: locale.id, value: "" }))
  );

  const { mutate: addTranslation } = useMutation<AddTranslationReqBodyDto>({
    refetchQueryKeys: [[KEY.GET_TRANSLATIONS(selectedGroup.id)]],
    schema,
    toastMessage: t(i18nKeys.translation.addTranslationSuccess),
  });

  const handleSubmit = () => {
    addTranslation({
      endpoint: ENDPOINT.ADD_TRANSLATION(selectedGroup.id),
      method: "post",
      body: {
        key,
        values,
      },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MutationForm>
        <ModalHeader>
          <Text>{t(i18nKeys.translation.addTranslation)}</Text>
        </ModalHeader>
        <ModalBody>
          <VStack alignItems="baseline" gap={5}>
            <VStack alignItems="baseline">
              <Text fontSize="xs" fontWeight="lighter">
                {t(i18nKeys.common.group)}
              </Text>
              <Text fontWeight="semibold">{selectedGroup.label}</Text>
            </VStack>
            <VStack alignItems="baseline" width="full">
              <Text fontSize="xs" fontWeight="lighter">
                {t(i18nKeys.common.key)}
              </Text>
              <Input
                onChange={(e) => setKey(replaceBlank(e.target.value))}
                value={key}
              />
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
                    values.find((val) => val.localeId === locale.id)?.value ||
                    ""
                  }
                />
              </VStack>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter onClose={onClose}>
          <Button colorScheme="darkgray" onClick={handleSubmit}>
            {t(i18nKeys.common.save)}
          </Button>
        </ModalFooter>
      </MutationForm>
    </Modal>
  );
};
