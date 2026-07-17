import ModifierCheckbox from "./customer/ModifierCheckbox";
import ModifierRadio from "./customer/ModifierRadio";

import type { ItemOptions, Modifier } from "../state/types";

interface OptionSelectProps {
	isErroneous?: boolean;
	modifierCategory: ItemOptions;
	selectedModifiers?: Modifier[];
	onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
}

function OptionSelect(props: OptionSelectProps) {
	const { isErroneous, modifierCategory, onModifierSelect, selectedModifiers } =
		props;

	if (modifierCategory.allow_multiple_selections)
		return (
			<ModifierCheckbox
				key={modifierCategory.label}
				onModifierSelect={onModifierSelect}
				isRequired={modifierCategory.is_required}
				selectedModifiers={selectedModifiers}
				isErroneous={isErroneous}
				{...modifierCategory}
			/>
		);

	return (
		<ModifierRadio
			key={modifierCategory.label}
			onModifierSelect={onModifierSelect}
			isRequired={modifierCategory.is_required}
			selectedModifiers={selectedModifiers}
			isErroneous={isErroneous}
			{...modifierCategory}
		/>
	);
}

export default OptionSelect;
