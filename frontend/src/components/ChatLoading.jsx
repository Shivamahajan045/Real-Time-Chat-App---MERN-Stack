import { HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <>
      <Stack gap="5">
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>

        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>

        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
        <HStack gap="5">
          <Skeleton flex="1" height="10" variant="pulse" />
        </HStack>
      </Stack>
    </>
  );
};

export default ChatLoading;
