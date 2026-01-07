import { Tag } from "./tags";

export type Record = {
  _id: string;
  type: "in" | "out";
  description: string;
  amount: string | number;
  tag: Tag;
  currency: "USD";
   date: string;
};
