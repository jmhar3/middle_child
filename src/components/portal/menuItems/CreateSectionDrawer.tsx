import { useState } from "react";

import {
  Text,
  Stack,
  Group,
  Drawer,
  Divider,
  MultiSelect,
  TextInput,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { modifiers, modifierCategories } from "../../../helpers/menu";

import type { MenuSection } from "../../../helpers/menu";

interface CreateSectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSection: (section: MenuSection) => void;
}

function CreateSectionDrawer(props: CreateSectionDrawerProps) {
  const { isOpen, onClose, onCreateSection } = props;

  const blankSection = {
    id: "",
    label: "",
    items: [],
  };

  const [section, setSection] = useState<MenuSection>(blankSection);

  const onClearDrawer = () => {
    onClose();
    setSection(blankSection);
  };

  const onSelectModifiers = (values: string[]) => {
    setSection((prevSection) => ({
      ...prevSection,
      defaultModifiers: values
        .map((value) => modifiers.find(({ id }) => id === value))
        .filter((ingredient) => ingredient !== undefined),
    }));
  };

  const onSelectModifierCategories = (values: string[]) => {
    setSection((prevSection) => ({
      ...prevSection,
      defaultModifierCategories: values
        .map((value) => modifierCategories.find(({ id }) => id === value))
        .filter((item) => item !== undefined),
    }));
  };

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          ADD SECTION
        </Text>

        <Divider w="100%" />

        <TextInput
          w="100%"
          withAsterisk
          label="Label"
          value={section.label}
          onChange={(event) =>
            setSection((prevSection) => ({
              ...prevSection,
              label: event.target.value,
            }))
          }
        />

        <MultiSelect
          w="100%"
          size="md"
          label="Default Modifiers"
          placeholder="Select default modifiers for section"
          nothingFoundMessage="No modifiers found matching your search"
          onChange={onSelectModifiers}
          data={modifiers.map((modifier) => ({
            value: modifier.id,
            label: modifier.label,
          }))}
          hidePickedOptions
          searchable
        />

        <MultiSelect
          w="100%"
          size="md"
          label="Default Modifier Categories"
          placeholder="Select default modifier categories for section"
          nothingFoundMessage="No modifier categories found matching your search"
          onChange={onSelectModifierCategories}
          data={modifierCategories.map((modifierCategory) => ({
            value: modifierCategory.id,
            label: modifierCategory.label,
          }))}
          hidePickedOptions
          searchable
        />

        <Divider w="100%" />

        <Group gap="sm">
          <StyledButton
            label="Cancel"
            variant="outline"
            onClick={onClearDrawer}
          />

          <StyledButton
            label="Create"
            onClick={() => {
              if (section.label.length > 0) {
                onCreateSection(section);
                onClearDrawer();
              }
            }}
          />
        </Group>
      </Stack>
    </Drawer>
  );
}

export default CreateSectionDrawer;
