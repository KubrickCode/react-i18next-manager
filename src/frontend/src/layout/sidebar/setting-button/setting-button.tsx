import { IoIosSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineFileSync } from "react-icons/ai";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuModalToggle,
} from "~/core/menu";
import { LABELS } from "~/core/constants";
import { Text } from "~/core/text";
import { useColorMode, useColorModeValue } from "~/core/color-mode";
import { IconButton } from "~/core/button";
import { LINK, useMutation } from "~/core/react-query";
import { useToast } from "~/core/toast";

import { LocaleManagementModal } from "./locale-management-modal";

export const SettingButton = () => {
  const { toggleColorMode } = useColorMode();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode size="1rem" />,
    <CiLight color="white" size="1rem" />
  );
  const darkModeLabel = useColorModeValue("Dark Mode", "Light Mode");

  const { mutate: generateI18nJson } = useMutation({});
  const toast = useToast();

  const handleGenerateI18nJson = () => {
    generateI18nJson({
      link: LINK.GENERATE_I18N_JSON,
      method: "post",
    });
    toast({ description: "i18n.json generated" });
  };

  return (
    <Menu>
      <MenuButton
        aria-label="setting-menu-button"
        as={IconButton}
        colorScheme="gray"
        icon={<IoIosSettings />}
        size="sm"
        variant="outline"
      />
      <MenuList>
        <MenuItem
          closeOnSelect={false}
          icon={darkModeIcon}
          onClick={() => toggleColorMode()}
        >
          <Text>{darkModeLabel}</Text>
        </MenuItem>
        <MenuModalToggle icon={FaLanguage} modal={LocaleManagementModal}>
          {LABELS.LOCALE_MANAGEMENT}
        </MenuModalToggle>
        <MenuItem icon={<AiOutlineFileSync />} onClick={handleGenerateI18nJson}>
          <Text>Generate I18n Json</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
