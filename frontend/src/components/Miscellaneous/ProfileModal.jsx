import {
  IconButton,
  Image,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Eye } from "lucide-react";
import React, { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)}>{children}</span>
      ) : (
        <IconButton
          bg="black"
          aria-label="View Profile"
          onClick={() => setOpen(true)}
          _hover={{ bg: "gray.800" }}
        >
          <Eye bg="red.800" size={16} color="white" outline="none" />
        </IconButton>
      )}

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="lg">
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              {/* Header */}
              <Dialog.Header display="flex" justifyContent="center">
                <Dialog.Title fontSize="40px" fontFamily="Work sans">
                  {user.name}
                </Dialog.Title>
              </Dialog.Header>

              {/* Body */}
              <Dialog.Body
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={4}
              >
                <Image
                  src={user.pic}
                  alt={user.name}
                  borderRadius="full"
                  boxSize="150px"
                  objectFit="cover"
                />

                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                >
                  {user.email}
                </Text>
              </Dialog.Body>

              {/* Footer */}
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>

              {/* Close Button */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ProfileModal;
