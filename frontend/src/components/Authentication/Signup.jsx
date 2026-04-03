import React, { useState } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  InputGroup,
  VStack,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
        duration: 5000,
        isClosable: true,
        placement: "top-end",
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "GroupChatApp");
      data.append("cloud_name", "dbbkvgn2s");
      fetch("https://api.cloudinary.com/v1_1/dbbkvgn2s/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url || data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
        duration: 5000,
        isClosable: true,
        placement: "top-end",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Please Fill All the Fields",
        type: "warning",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      setLoading(false);
      return;
    } else if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        type: "warning", // ✅ FIXED
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config,
      );

      toaster.create({
        title: "Registration Successful",
        type: "success",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred during registration.",
        type: "error",
        duration: 5000,
        placement: "top-end",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack>
        <Fieldset.Root size="lg" maxW="md">
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input
                name="name"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Email address</Field.Label>
              <Input
                name="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>

              <InputGroup
                endElement={
                  <Button size="sm" onClick={() => setShow(!show)}>
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

            <Field.Root>
              <Field.Label>Confirm Password</Field.Label>

              <InputGroup
                endElement={
                  <Button size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>
            </Field.Root>

            <Field.Root>
              <Field.Label>Upload your picture</Field.Label>
              <Input
                accept="image/*"
                type="file"
                p={1.5}
                onChange={(e) => postDetails(e.target.files[0])}
                required
              />
            </Field.Root>
          </Fieldset.Content>

          <Button
            type="submit"
            width={"100%"}
            colorScheme={"blue"}
            backgroundColor={"blue.500"}
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            loading={loading}
          >
            Signup
          </Button>
        </Fieldset.Root>
      </VStack>
    </>
  );
};

export default Signup;
