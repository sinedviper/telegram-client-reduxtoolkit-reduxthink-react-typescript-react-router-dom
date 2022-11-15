import { IChat } from "interface";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ChatsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  chats: IChat[] | null;
  searchContact: RefObject<HTMLInputElement>;
  setContact: Function;
  setSettings: Function;
}
