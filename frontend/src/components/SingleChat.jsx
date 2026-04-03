import React, { useEffect, useState } from "react";
import { Box, Field, Spinner, Text, Input } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
import { ArrowLeft } from "lucide-react";
import { getSender, getSenderFull } from "@/config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://talk-a-tive-9azh.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (_error) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const messageHandler = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    socket.on("message recieved", messageHandler);

    return () => {
      socket.off("message recieved", messageHandler);
    };
  }, [notification, fetchAgain, selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      setNewMessage("");
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config,
        );

        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (_error) {
        toaster.create({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={3}
            w="100%"
            fontFamily="Work sans"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <ArrowLeft
              display={{ base: "flex", md: "none" }}
              size={"38px"}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {" "}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Field.Root onKeyDown={sendMessage} required mt={3}>
              {istyping && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#f0f0f0",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "10px 16px",
                    marginBottom: 10,
                    width: "fit-content",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "#8c8c8c",
                        display: "inline-block",
                        animation: "waDot 1.2s infinite ease-in-out",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes waDot {
                      0%, 60%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
                      30% { transform: translateY(-5px) scale(1.1); opacity: 1; }
                    }
                  `}</style> 
                </div>
              )}
              <Input
                placeholder="Enter message here"
                bg={"#E0E0E0"}
                variant={"subtle"}
                onChange={typingHandler}
                value={newMessage}
              />
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
        >
          <Text fontFamily={"Work sans"} fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
