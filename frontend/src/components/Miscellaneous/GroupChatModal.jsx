import React, { useState } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { ChatState } from "@/Context/ChatProvider";
import { Field, Input, Box } from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toaster.create({
        description: error.response.data.message || "Error Occured",
        status: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toaster.create({
        description: "Please fill all fields and add at least 2 users",
        status: "warning",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      setChats([data, ...chats]);
      setOpen(false);
      toaster.create({
        description: "New Group Chat Created",
        status: "success",
        duration: 5000,
        placement: "bottom-end",
        isClosable: true,
      });
    } catch (error) {
      toaster.create({
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        description: "User already added",
        status: "warning",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title
                fontSize={"35px"}
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={"center"}
              >
                Create Group Chat
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              display={"flex"}
              flexDir={"column"}
              gap={"1rem"}
              alignItems={"center"}
            >
              <Field.Root>
                <Field.Label>Chat Name</Field.Label>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Add Users</Field.Label>
                <Input
                  mb={1}
                  placeholder="Add Users eg: John, Jane, David"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Field.Root>
              {/* selected users */}
              <Box display={"flex"} flexWrap={"wrap"} gap={2} w={"100%"}>
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {/* {render searched users} */}
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette={"blue"} onClick={handleSubmit}>
                Create Chat
              </Button>
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

export default GroupChatModal;
