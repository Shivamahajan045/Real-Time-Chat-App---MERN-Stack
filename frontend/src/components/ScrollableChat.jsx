import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/config/ChatLogics";
import { ChatState } from "@/Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarGroup } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              width: "100%", // 🔥 IMPORTANT
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                content={m.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar.Root size={"sm"} mt={"7px"} mr={1} cursor={"pointer"}>
                  <Avatar.Image src={m.sender?.pic} />
                  <Avatar.Fallback name={m.sender?.name} />
                </Avatar.Root>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
