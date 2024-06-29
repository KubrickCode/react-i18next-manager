export default {
  GET_GROUPS: "getGroups",
  GET_GROUPS_IN_MOVE_GROUP_MODAL: "getGroupsInMoveGroupModal",
  GET_LOCALES: "getLocales",
  GET_TRANSLATIONS: (groupId: string) => `getTranslations-${groupId}`,
};
