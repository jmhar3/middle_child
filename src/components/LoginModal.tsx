import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import {
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";

import PasswordInputWithRequirements from "./PasswordInput";

import { supabase } from "../supabase";

interface LoginModalProps {
  isModalOpen: boolean;
  onModalClose: () => void;
}

const LoginModal = ({ isModalOpen, onModalClose }: LoginModalProps) => {
  const [opened, { close, toggle }] = useDisclosure(false);
  const showSignUp = opened;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage(null);
    setIsSubmitting(false);
    close();
    onModalClose();
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setErrorMessage("Please provide a valid email and password.");
      setIsSubmitting(false);
      return;
    }

    if (showSignUp) {
      if (name.length === 0) {
        setErrorMessage("Please provide a name.");
        setIsSubmitting(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSignUpSuccess(true);
      }
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      setErrorMessage(error.message);
    } else {
      const futureDate = new Date();
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem(
        "jwt_expiry",
        futureDate
          .setSeconds(futureDate.getSeconds() + data.session.expires_in)
          .toString(),
      );
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      fullScreen
      radius={0}
      opened={isModalOpen}
      onClose={onClose}
      title={showSignUp ? "Sign Up" : "Log In"}
      styles={{
        content: {
          background: "whitesmoke",
        },
        header: {
          background: "whitesmoke",
        },
      }}
    >
      {signUpSuccess ? (
        <Stack align="center" gap="xs" pt="xl">
          <Text fw="bold">You have successfully signed up!</Text>
          <Text ta="center">
            Please check your email to verify your account.
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg">
          <Stack w="100%" gap="sm">
            {showSignUp && (
              <TextInput
                w="100%"
                radius="md"
                type="name"
                label="Name"
                value={name}
                withAsterisk
                onChange={(event) => setName(event.target.value)}
                styles={{ input: { background: "white" } }}
              />
            )}

            <TextInput
              w="100%"
              radius="md"
              type="email"
              label="Email"
              value={email}
              withAsterisk
              onChange={(event) => setEmail(event.target.value)}
              styles={{ input: { background: "white" } }}
            />

            {showSignUp ? (
              <PasswordInputWithRequirements
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            ) : (
              <PasswordInput
                w="100%"
                radius="md"
                withAsterisk
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                styles={{ input: { background: "white" } }}
              />
            )}
          </Stack>

          <Stack w="100%" gap="sm" align="center">
            <Button
              fullWidth
              radius="md"
              variant="filled"
              color="darkslategray"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {showSignUp ? "Sign Up" : "Sign In"}
            </Button>

            {errorMessage && <Text c="crimson">{errorMessage}</Text>}

            <UnstyledButton onClick={toggle}>
              {showSignUp
                ? "Already a member? Click here to sign in."
                : "Not a member? Click here to sign up."}
            </UnstyledButton>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};

export default LoginModal;
