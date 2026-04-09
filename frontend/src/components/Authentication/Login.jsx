import React, { useState } from "react";
import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  InputGroup,
  NativeSelect,
  VStack,
} from "@chakra-ui/react";

import { Toaster, toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please Fill All the Fields",
        type: "warning",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      setLoading(false);
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config,
        );

        toaster.create({
          title: "Login Successful",
          type: "success",
          duration: 3000,
          placement: "top-end",
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        toaster.create({
          title: error?.response?.data?.message || "Something went wrong",
          type: "error",
          duration: 5000,
          placement: "top-end",
          isClosable: true,
        });
        setLoading(false);
      }
    }
  };
  return (
    <VStack>
      <Field.Root>
        <Field.Label>Email address</Field.Label>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Password</Field.Label>

        <InputGroup
          endElement={
            <Button size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          }
        >
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root>

      <Button
        type="submit"
        width={"100%"}
        color={"white"}
        backgroundColor={"blue.500"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        loading={loading}
      >
        Login
      </Button>

      <Button
        variant={"solid"}
        width={"100%"}
        color={"white"}
        backgroundColor={"red.500"}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
