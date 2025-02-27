import { Tag } from "./tags";

export type Record = {
  _id: string;
  type: "in" | "out";
  description: string;
  amount: string;
  tag: Tag;
  currency: "USD";
  createdAt: string;
};
