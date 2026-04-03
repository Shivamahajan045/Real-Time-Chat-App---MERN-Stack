import { Box } from "@chakra-ui/react";
import React from "react";
import { CloseButton } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={14}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user?.name}
      <CloseButton size={"md"} />
    </Box>
  );
};

export default UserBadgeItem;
