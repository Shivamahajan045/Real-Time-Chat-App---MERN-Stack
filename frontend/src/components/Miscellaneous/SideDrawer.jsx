import {
  Box,
  Button,
  Menu,
  Text,
  Avatar,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { ChatState } from "@/Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { Drawer, Portal } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "@/config/ChatLogics";
import "../styles.css";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        description: "Please Enter something in search",
        type: "warning",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        description: error.response.data.message,
        type: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (err) {
      toaster.create({
        description: err.response.data.message,
        type: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        p={"5px 10px 5px 10px"}
        borderWidth={"2px"}
        w={"100%"}
      >
        <Tooltip content="Search Users in Chat" hasArrow placement="bottom-end">
          <span>
            <Button variant={"solid"} onClick={() => setOpen(true)}>
              {" "}
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }}>Search User</Text>
            </Button>
          </span>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Talk-A-Tive
        </Text>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <Button aria-label="Notifications">
                  <FaBell />
                </Button>
                {notification.length > 0 && (
                  <span className="notif-badge">{notification.length}</span>
                )}
              </div>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content p={2} minW="220px" borderRadius="md" boxShadow="lg">
                {notification.length === 0 ? (
                  <Menu.Item value="no-notif" disabled>
                    No new messages
                  </Menu.Item>
                ) : (
                  notification.map((notif) => (
                    <Menu.Item
                      key={notif._id}
                      value={notif._id}
                      borderRadius="md"
                      px={3}
                      py={2}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n._id !== notif._id),
                        );
                      }}
                    >
                      <Box display="flex" flexDir="column">
                        <Text fontWeight="bold" fontSize="sm" color="orange">
                          {notif.chat.isGroupChat
                            ? notif.chat.chatName
                            : getSender(user, notif.chat.users)}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="orange"
                          isTruncated
                          maxW="170px"
                        >
                          {notif.content}
                        </Text>
                      </Box>
                    </Menu.Item>
                  ))
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button>
                <Avatar.Root size="sm">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
                <ChevronDown />
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content p={2} minW="120px" borderRadius="md" boxShadow="lg">
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  px={2}
                  py={1}
                  _hover={{ bg: "red.400", color: "black" }}
                >
                  <ProfileModal user={user} />
                </Box>

                <Menu.Separator />

                <Menu.Item
                  value="logout"
                  onClick={logoutHandler}
                  borderRadius="md"
                  px={3}
                  py={2}
                  _hover={{ bg: "red.400", color: "black" }}
                  _focus={{ bg: "red.400", color: "black" }}
                >
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </div>
      </Box>
      <Box>
        <Drawer.Root
          placement="left"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger />

                <Drawer.Header>
                  Search Users
                  {/* <Button mt={4} onClick={() => setOpen(false)}>
                    Close
                  </Button> */}
                </Drawer.Header>

                <Drawer.Body>
                  <Box display="flex" pb={2}>
                    <Input
                      placeholder="Search by name or email"
                      mr={2}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                  </Box>

                  {loading ? (
                    <ChatLoading />
                  ) : (
                    searchResult.map((user) => {
                      return (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      );
                    })
                  )}
                  {loadingChat && <Spinner ml="auto" display="flex" />}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Box>
    </>
  );
};

export default SideDrawer;
