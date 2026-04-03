import { ChatState } from "@/Context/ChatProvider";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { getSender } from "@/config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toaster.create({
        description: "Failed to loasd the chats",
        type: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });

    }
  };
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            colorPalette="teal"
            variant="solid"
            display={"flex"}
            alignItems={"center"}
            gap={2}
            size="sm"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            New Group Chat
            <i className="fas fa-plus"></i>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
      >
        {chats ? (
          <Stack overflowY={"auto"} flex={"1"} spacing={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(loggedInUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
