import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import cn from "classnames";

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { IChat, IMessage, IUser } from "utils/interface";
import { getHaveMessages, getMessage } from "resolvers/messages";
import { getUserSender } from "resolvers/user";
import { MessageHeader, MessageInput, MessageList } from "components/message";
import { Settings } from "components";
import {
  actionAddFetch,
  actionAddLoading,
  actionAddMessages,
  actionAddRecipient,
  getChat,
  getFetch,
  getMenuMain,
  getMessages,
  getMessagesBefore,
  getRecipient,
  getTabIndexSeventh,
  getUser,
} from "store";

import { SideRightProps } from "./SideRight.props";
import styles from "./SideRight.module.css";

export const SideRight = ({
  className,
  ...props
}: SideRightProps): JSX.Element => {
  const { username } = useParams();
  const error = useError();
  const dispatch = useAppDispatch();
  const authorization = useAuthorization();
  const authorizationHave = useAuthorizationSearch();

  //store
  const fetch: boolean = useAppSelector(getFetch);
  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);
  const messagesBegore: IMessage[] | undefined =
    useAppSelector(getMessagesBefore);
  const main: boolean = useAppSelector(getMenuMain);
  const tabIndexSeventh: number = useAppSelector(getTabIndexSeventh);
  const [haveMessage, setHaveMassge] = useState<Date | null>(null);

  const [loadHaveMessage] = useLazyQuery(getHaveMessages, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setHaveMassge(authorizationHave({ data: data.haveMessageFind }));
    },
    onError(errorData) {
      chat !== undefined && error(errorData.message);
    },
  });

  const { loading: loadingMessage } = useQuery(getMessage, {
    variables: {
      message: {
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      authorization({
        data: data.getMessages,
        actionAdd: actionAddMessages,
      });
      fetch && dispatch(actionAddFetch(false));
      await loadHaveMessage({
        variables: {
          message: {
            id: Number(
              messagesBegore !== undefined
                ? messagesBegore?.[0]?.id
                : messages?.[0]?.id
            ),
            chatId: Number(chat?.id),
            senderMessage: Number(user?.id),
          },
        },
      });
    },
    pollInterval: chat === undefined ? 30000 : 200,
  });

  const { loading: loadingSender } = useQuery(getUserSender, {
    variables: { input: { username } },
    onCompleted(data) {
      authorization({ data: data.getUser, actionAdd: actionAddRecipient });
      fetch && dispatch(actionAddFetch(false));
    },
    fetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const [settings, setSettings] = useState<boolean>(false);

  useEffect(() => {
    if (loadingMessage || loadingSender) {
      dispatch(actionAddLoading(true));
    }
    if (!loadingMessage || !loadingSender) {
      dispatch(actionAddLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessage, loadingSender]);

  return (
    <section
      className={cn(className, styles.wrapper, {
        [styles.wrapperMainOn]: main === true,
      })}
      {...props}
    >
      {user?.theme ? (
        <section className={styles.backgroundDark}></section>
      ) : (
        <section className={styles.backgroundLight}></section>
      )}
      <section className={styles.chatWrapper}>
        <MessageHeader setSettings={setSettings} settings={settings} />
        <MessageList
          chat={chat}
          haveMessage={haveMessage}
          user={user}
          messagesBegore={messagesBegore}
          messages={messages}
        />
        <div className={styles.inputWrap}>
          <MessageInput main={main} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings
          setSettings={setSettings}
          sender={sender}
          profile={true}
          tabIndex={tabIndexSeventh}
        />
      </section>
    </section>
  );
};
