import { MultiSelect, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Badges from "../Badges";
import StyledButton from "../StyledButton";

interface EditableMenuSectionModifierProps {
  label: string;
  defaultValue: string[];
  data: { value: string; label: string }[];
}

function EditableMenuSectionModifier(props: EditableMenuSectionModifierProps) {
  const { defaultValue, data, label } = props;

  const [
    showEditableModifiers,
    { open: openEditableModifiers, close: closeEditableModifiers },
  ] = useDisclosure(false);

  const badgeData = defaultValue
    .map((value) => {
      const findData = data.find((item) => item.value === value);
      return findData && { ...findData, id: findData.value };
    })
    .filter((data) => data !== undefined);

  return showEditableModifiers ? (
    <Flex w="100%" gap="sm" align="flex-end">
      <MultiSelect
        w="100%"
        size="md"
        searchable
        label={label}
        defaultValue={defaultValue}
        data={data}
      />
      <StyledButton onClick={closeEditableModifiers} label="Save" />
    </Flex>
  ) : (
    <Badges
      label={label}
      badges={badgeData}
      onEditBadges={openEditableModifiers}
    />
  );
}

export default EditableMenuSectionModifier;
