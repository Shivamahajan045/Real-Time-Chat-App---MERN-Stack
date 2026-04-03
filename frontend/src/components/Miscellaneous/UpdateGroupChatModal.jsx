import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { EyeIcon } from "lucide-react";
import { ChatState } from "@/Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toaster.create({
        description: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        placement: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config,
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      fetchMessages();
    } catch (error) {
      toaster.create({
        description: error.response?.data?.message || "Error Occured",
        status: "error",
        duration: 5000,
        placement: "bottom",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toaster.create({
        description: "User Already in group!",
        status: "error",
        duration: 5000,
        placement: "bottom",
        isClosable: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        description: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        placement: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        description: error.response?.data?.message || "Error Occured",
        status: "error",
        duration: 5000,
        placement: "bottom",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      setOpen(false);
    } catch (error) {
      toaster.create({
        description: error.response?.data?.message || "Error Occured",
        status: "error",
        duration: 5000,
        placement: "bottom",
        isClosable: true,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

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
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        placement: "bottom-left",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button display={{ base: "flex" }} onClick={() => setOpen(true)}>
          <EyeIcon />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                {selectedChat.chatName}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" flexDir="column" alignItems="center">
              <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>

              <Box display="flex" w="100%" pb={3}>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorPalette="teal"
                  ml={1}
                  loading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </Box>

              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
              )}
            </Dialog.Body>
            <Dialog.Footer
              display="flex"
              justifyContent="space-between"
              mt={4}
              borderTop="1px solid #e0e0e0"
              pt={4}
            >
              <Button onClick={() => handleRemove(user)} colorPalette="red">
                Leave Group
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Close</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UpdateGroupChatModal;
