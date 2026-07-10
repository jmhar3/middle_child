import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import {
	Text,
	Modal,
	Stack,
	Button,
	TextInput,
	PasswordInput,
	UnstyledButton,
} from "@mantine/core";

import PasswordInputWithRequirements from "./PasswordInput";

import { useAppDispatch } from "../state/hooks";

import {
	fetchUser,
	resetPassword,
	signInUser,
	signUpUser,
} from "../state/user/userThunks";

interface LoginModalProps {
	isModalOpen: boolean;
	onModalClose: () => void;
}

const LoginModal = ({ isModalOpen, onModalClose }: LoginModalProps) => {
	const dispatch = useAppDispatch();
	const [showSignUp, { toggle: toggleShowSignUp }] = useDisclosure(false);
	const [
		showResetPassword,
		{ open: openResetPassword, close: closeResetPassword },
	] = useDisclosure(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [resetPasswordSent, setResetPasswordSent] = useState(false);
	const [signUpSuccess, setSignUpSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const label = useMemo(() => {
		if (showSignUp) {
			return "Sign Up";
		} else if (showResetPassword) {
			return "Reset Password";
		} else {
			return "Sign In";
		}
	}, [showSignUp, showResetPassword]);

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

		if (!emailRegex.test(email)) {
			setErrorMessage("Please provide a valid email.");
			setIsSubmitting(false);
			return;
		}

		if (showResetPassword) {
			dispatch(resetPassword({ email: email }))
				.then(() => setResetPasswordSent(true))
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				)
				.finally(() => setIsSubmitting(false));
			return;
		}

		if (!passwordRegex.test(password)) {
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

			dispatch(
				signUpUser({
					email: email,
					password: password,
					name: name,
				}),
			)
				.then(() => setSignUpSuccess(true))
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				)
				.finally(() => setIsSubmitting(false));
			return;
		}

		dispatch(
			signInUser({
				email: email,
				password: password,
			}),
		)
			.then(() => {
				notifications.show({
					message: "Successfully signed in",
					withCloseButton: false,
					position: "bottom-right",
					color: "green",
				});
				dispatch(fetchUser());
				onClose();
			})
			.finally(() => setIsSubmitting(false));
	};

	const resendVerificationEmail = () => {
		setIsSubmitting(true);

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(email)) {
			setErrorMessage("Please provide a valid email.");
			setIsSubmitting(false);
			return;
		}

		dispatch(resetPassword({ email: email }))
			.then(() => setResetPasswordSent(true))
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => setIsSubmitting(false));
	};

	return (
		<Modal
			fullScreen
			radius={0}
			opened={isModalOpen}
			onClose={onClose}
			title={label}
			styles={{
				content: {
					background: "whitesmoke",
				},
				header: {
					background: "whitesmoke",
				},
			}}
		>
			{resetPasswordSent && (
				<Stack align="center" gap="xs" pt="xl">
					<Text fw="bold">Reset password link has been sent</Text>

					<Text ta="center">
						Please check your email to reset your password or
					</Text>

					<Button
						fullWidth
						radius="md"
						variant="filled"
						color="darkslategray"
						onClick={() => {
							closeResetPassword();
							setResetPasswordSent(false);
						}}
						loading={isSubmitting}
					>
						Return to Sign In
					</Button>
				</Stack>
			)}

			{signUpSuccess && (
				<Stack align="center" gap="xs" pt="xl">
					<Text fw="bold">You have successfully signed up!</Text>

					<Text ta="center">
						Please check your email to verify your account.
					</Text>

					<Button
						fullWidth
						radius="md"
						variant="filled"
						color="darkslategray"
						onClick={() => {
							toggleShowSignUp();
							setSignUpSuccess(false);
						}}
						loading={isSubmitting}
					>
						Already verified your email? Sign In
					</Button>

					<Button
						fullWidth
						radius="md"
						variant="outline"
						color="darkslategray"
						onClick={resendVerificationEmail}
						loading={isSubmitting}
					>
						Resend verification email
					</Button>
				</Stack>
			)}

			{!resetPasswordSent && !signUpSuccess && (
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

						{!showResetPassword && showSignUp && (
							<PasswordInputWithRequirements
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						)}

						{!showResetPassword && !showSignUp && (
							<>
								<PasswordInput
									w="100%"
									radius="md"
									withAsterisk
									label="Password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									styles={{ input: { background: "white" } }}
								/>
								<UnstyledButton onClick={openResetPassword}>
									Forgot Password? Click here to reset.
								</UnstyledButton>
							</>
						)}
					</Stack>

					<Stack w="100%" gap="sm" align="center">
						<Button
							fullWidth
							radius="md"
							variant="filled"
							color="darkslategray"
							onClick={onSubmit}
							loading={isSubmitting}
						>
							{label}
						</Button>

						{errorMessage && <Text c="crimson">{errorMessage}</Text>}

						<UnstyledButton
							onClick={() => {
								toggleShowSignUp();
								closeResetPassword();
							}}
						>
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
