import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import Login from "@/components/Authentication/Login";
import Signup from "@/components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w={"100%"}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          textAlign={"center"}
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          color={"black"}
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        color={"black"}
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs.Root
          defaultValue="members"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "colors.blue.500",
            "--tabs-indicator-shadow": "shadows.xs",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List mb="1em" display="flex">
            <Tabs.Trigger
              value="members"
              flex="1"
              display="flex"
              justifyContent="center"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="projects"
              flex="1"
              display="flex"
              justifyContent="center"
            >
              Signup
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="members">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="projects">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Home;
