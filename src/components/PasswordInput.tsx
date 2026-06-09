import { useState } from "react";
import { PasswordInput, Progress, Text, Popover, Box } from "@mantine/core";

import CloseIcon from "../icons/CloseIcon";
import CheckIcon from "../icons/CheckIcon";

function PasswordRequirement({
	meets,
	label,
}: {
	meets: boolean;
	label: string;
}) {
	return (
		<Text
			c={meets ? "teal" : "red"}
			style={{ display: "flex", alignItems: "center" }}
			mt={7}
			size="sm"
		>
			{meets ? <CheckIcon /> : <CloseIcon />}
			<Box ml={10}>{label}</Box>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: "Includes number" },
	{ re: /[a-z]/, label: "Includes lowercase letter" },
	{ re: /[A-Z]/, label: "Includes uppercase letter" },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
	{ re: /^.{8,}$/, label: "At least 8 characters long" },
];

function getStrength(password: string) {
	let multiplier = password.length > 7 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

interface PasswordInputProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInputWithRequirements(props: PasswordInputProps) {
	const [popoverOpened, setPopoverOpened] = useState(false);
	const checks = requirements.map((requirement) => (
		<PasswordRequirement
			key={requirement.label}
			label={requirement.label}
			meets={requirement.re.test(props.value)}
		/>
	));

	const strength = getStrength(props.value);
	const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

	return (
		<Popover
			opened={popoverOpened}
			position="bottom"
			width="target"
			transitionProps={{ transition: "pop" }}
		>
			<Popover.Target>
				<div
					style={{ width: "100%" }}
					onFocusCapture={() => setPopoverOpened(true)}
					onBlurCapture={() => setPopoverOpened(false)}
				>
					<PasswordInput
						w="100%"
						radius="md"
						withAsterisk
						label="Your password"
						placeholder="Your password"
						value={props.value}
						onChange={props.onChange}
					/>
				</div>
			</Popover.Target>
			<Popover.Dropdown>
				<Progress color={color} value={strength} size={5} mb="xs" />
				<PasswordRequirement
					label="Includes at least 6 characters"
					meets={props.value.length > 5}
				/>
				{checks}
			</Popover.Dropdown>
		</Popover>
	);
}

export default PasswordInputWithRequirements;
