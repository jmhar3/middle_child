import { Box, Button, Divider, Stack, Text } from "@mantine/core";

import type { Modifier } from "../../helpers/menu";

interface ModifierRadioProps {
  label?: string;
  modifiers: Modifier[];
  onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
  selectedModifiers: Modifier[];
}

function ModifierRadio(props: ModifierRadioProps) {
  const { label, modifiers, selectedModifiers, onModifierSelect } = props;

  const onSelection = (newSelection: Modifier) => {
    const previousSelection = selectedModifiers[0];
    // unselect old modifier
    if (previousSelection) onModifierSelect(previousSelection, false);
    // select old modifier
    onModifierSelect(newSelection, true);
  };

  return (
    <Stack w="100%" gap="6">
      {label && <Text pl="3">{label}</Text>}
      <Box bdrs="sm" w="100%" bd="darkslategray solid 1px" bg="white">
        <Button.Group w="100%" orientation="vertical">
          {modifiers.map((modifier, index) => {
            const selectedModifier = selectedModifiers[0];
            const isSelected = selectedModifier === modifier;
            return (
              <>
                {index !== 0 && <Divider />}
                <Button
                  fullWidth
                  radius="0"
                  key={modifier.id}
                  color="darkslategray"
                  justify="space-between"
                  onClick={() =>
                    isSelected
                      ? onModifierSelect(modifier, false)
                      : onSelection(modifier)
                  }
                  rightSection={modifier.price && `+ $${modifier.price}`}
                  variant={isSelected ? "filled" : "transparent"}
                >
                  {modifier.label}
                </Button>
              </>
            );
          })}
        </Button.Group>
      </Box>
    </Stack>
  );
}

export default ModifierRadio;
