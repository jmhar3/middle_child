import { Button, em } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import LoginModal from "./LoginModal";

const Login = () => {
	const [opened, { open, close }] = useDisclosure(false);

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	return (
		<>
			<Button
				fullWidth
				variant="filled"
				color="darkslategray"
				size={isMobile ? "md" : "xl"}
				onClick={open}
			>
				Log In to Earn Loyalty Points
			</Button>

			<LoginModal isModalOpen={opened} onModalClose={close} />
		</>
	);
};

export default Login;
