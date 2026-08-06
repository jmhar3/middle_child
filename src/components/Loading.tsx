import { Loader, Modal, Stack, Title } from "@mantine/core";

function Loading({ message }: { message: string }) {
	return (
		<Modal
			size="xs"
			centered
			opened={true}
			withCloseButton={false}
			onClose={() => {}}
			overlayProps={{
				backgroundOpacity: 0.45,
				blur: 3,
			}}
		>
			<Stack align="center" justify="center" py="xs" gap="xs">
				<Loader color="darkslategray" size="lg" type="dots" />
				<Title size="1.2em">{message}...</Title>
			</Stack>
		</Modal>
	);
}

export default Loading;
