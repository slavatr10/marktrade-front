export const getSpTagFlagKey = (contactId: string) =>
  `sp_tag_readytodep_sent:${contactId}`;

export const getChatterfyFlagKey = (clickId: string) =>
  `chatterfy_readytodep_sent:${clickId}`;

export const isFlagSet = (key: string): boolean => Boolean(localStorage.getItem(key));

export const setFlag = (key: string): void => {
  localStorage.setItem(key, "1");
};

