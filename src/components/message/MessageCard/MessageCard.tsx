import React, { useState } from "react";
import cn from "classnames";
import { useParams } from "react-router-dom";

import { IMessage } from "utils/interface";
import { formatHours } from "utils/helpers";
import { MessageEdit } from "components/message";
import { CheckIcon, TailIcon } from "assets";

import { MessageCardProps } from "./MessageCard.props";
import styles from "./MessageCard.module.css";
import { useAppDispatch, useAppSelector } from "utils/hooks";
import { actionMenuMessage, getMenuMessage } from "store";

export const MessageCard = ({
  chat,
  message,
  index,
  messages,
  user,
  className,
  ...props
}: MessageCardProps): JSX.Element => {
  const { username } = useParams();
  const dispatch = useAppDispatch();

  const getMenuEdit: number | null = useAppSelector(getMenuMessage);

  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);
  const [position, setPosition] = useState<boolean>(false);
  const [client, setClient] = useState<{
    id: number;
    chatId: number;
    senderMessage: number;
    text: string;
    user: number;
  }>({
    id: 0,
    chatId: 0,
    senderMessage: 0,
    text: "",
    user: 0,
  });
  let timer: any;
  //keeps track of the right mouse button, if pressed, it sends data to the interaction menu block with the sent message, also fixed to the screen size
  const handleMouseDown = (e, message: IMessage) => {
    if (e.buttons === 2) {
      if (getMenuEdit === null) {
        dispatch(actionMenuMessage(message?.id));
        setEditMessage(true);
        setClientX(e.nativeEvent.layerX);
        setClientY(e.nativeEvent.layerY);
        if (e.nativeEvent.screenY > 400) {
          setPosition(true);
        }
        setClient({
          id: message?.id,
          chatId: chat?.id ? chat.id : 0,
          senderMessage: message?.senderMessage.id,
          user: Number(user?.id),
          text: message?.text,
        });
      }
    }
  };

  return (
    <li
      className={cn(className, styles.message, {
        [styles.messageUser]: username === message?.senderMessage?.username,
        [styles.messageDown]:
          messages[Number(index + 1)]?.senderMessage?.username !==
            message?.senderMessage.username &&
          messages[Number(index + 1)]?.senderMessage?.username !== undefined,
        [styles.wrapperReply]: message?.reply !== null,
        [styles.wrapperUserId]: message?.senderMessage.id === user?.id,
      })}
      onMouseMove={(e: any) => {
        if (!editMessage) {
          setClientX(e.nativeEvent.layerX);
          if (e.nativeEvent.screenY > 400)
            setClientY(
              message?.senderMessage.id === user?.id
                ? e.nativeEvent.layerY - 120
                : e.nativeEvent.layerY - 65
            );
        }
      }}
      onMouseLeave={() => {
        dispatch(actionMenuMessage(null));
        setEditMessage(false);
      }}
      onBlur={() => {
        dispatch(actionMenuMessage(null));
        setEditMessage(false);
      }}
      onMouseDown={(e) => message && handleMouseDown(e, message)}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onTouchEnd={() => {
        clearTimeout(timer);
      }}
      onTouchStart={(e: any) => {
        timer = setTimeout(() => {
          if (getMenuEdit === null) {
            setEditMessage(true);
            setClientX(e.nativeEvent.layerX);
            setClientY(e.nativeEvent.layerY);
            if (e.nativeEvent.screenY > 400) {
              setPosition(true);
            }
            setClient({
              id: message?.id,
              chatId: chat?.id ? chat.id : 0,
              senderMessage: message?.senderMessage?.id,
              user: Number(user?.id),
              text: message?.text,
            });
          }
        }, 1000);
      }}
      {...props}
    >
      {message?.reply ? (
        <div className={styles.messageReply}>
          <div className={cn(styles.textWrapper)}>
            <p
              className={cn(styles.messageWrapperEdit, {
                [styles.messageWrapperUser]:
                  user?.username === message?.senderMessage.username,
              })}
            >
              {message?.reply.senderMessage.name}
            </p>
            <p
              className={cn(styles.textMessage, {
                [styles.messageWrapperUser]:
                  user?.username === message?.senderMessage?.username,
              })}
            >
              {message?.reply.text}
            </p>
          </div>
        </div>
      ) : null}
      <div
        className={cn(styles.textMessageWrap, {
          [styles.messageTextWrap]: message?.text.length < 45,
        })}
      >
        <span className={cn(styles.messageText)}>{message?.text}</span>
        <div
          className={cn(styles.bottoMessage, {
            [styles.messageTextLen]: message?.text.length < 45,
          })}
        >
          <span
            className={cn(styles.messageEdit, {
              [styles.receipt]:
                message?.senderMessage?.username !== user?.username,
            })}
          >
            {message?.createdAt !== message?.dateUpdate ? "edited" : null}
          </span>
          <span
            className={cn(styles.messageDate, {
              [styles.receipt]:
                message?.senderMessage?.username !== user?.username,
            })}
          >
            {message && formatHours(new Date(message?.createdAt))}
          </span>
          <span
            className={cn(styles.messageRead, {
              [styles.readMessage]: message?.read === true,
              [styles.readMessageUser]:
                message?.read === true &&
                username !== message?.senderMessage?.username,
            })}
          >
            <CheckIcon />
          </span>
        </div>
      </div>
      <TailIcon
        className={cn(
          styles.tailIcon,
          messages[Number(index + 1)]?.senderMessage?.username !==
            user?.username &&
            user?.username === message?.senderMessage?.username
            ? styles.messageStyleLeft
            : null,
          messages[Number(index + 1)]?.senderMessage?.username ===
            user?.username &&
            user?.username !== message?.senderMessage?.username
            ? styles.messageStyleRight
            : null,
          messages[Number(index + 1)]?.senderMessage?.username === undefined
            ? message?.senderMessage?.username === user?.username
              ? styles.messageStyleLeft
              : styles.messageStyleRight
            : null,
          new Date(message?.createdAt).getDate() !==
            new Date(messages[index + 1]?.createdAt).getDate()
            ? message?.senderMessage?.username === user?.username
              ? styles.messageStyleLeft
              : styles.messageStyleRight
            : null
        )}
      />
      <MessageEdit
        editMessage={editMessage}
        client={client}
        clientX={clientX}
        clientY={clientY}
        position={position}
        setEditMessage={setEditMessage}
      />
    </li>
  );
};
