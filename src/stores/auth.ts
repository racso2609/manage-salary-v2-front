import { atomWithStorage } from "jotai/utils";

export const SESSION_TOKEN_KEY = "manage-salary-v2-jwt";

export const sessionTokenAtom = atomWithStorage<string>(
  SESSION_TOKEN_KEY,
  "",
  undefined,
  {
    getOnInit: true,
  },
);
