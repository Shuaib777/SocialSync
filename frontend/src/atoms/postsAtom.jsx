import { atom } from "recoil";

const userAtom = atom({
  key: "postsAtom",
  default: [],
});

export default userAtom;
