import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";

import type { Modifier } from "../../state/types";

interface ModifierRadioProps {
  label?: string;
  isRequired: boolean;
  modifiers: Modifier[];
  onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
  selectedModifiers: Modifier[];
}

function ModifierRadio(props: ModifierRadioProps) {
  const { label, isRequired, modifiers, selectedModifiers, onModifierSelect } =
    props;

  const onSelection = (newSelection: Modifier) => {
    const previousSelection = selectedModifiers[0];
    // unselect old modifier
    if (previousSelection) onModifierSelect(previousSelection, false);
    // select old modifier
    onModifierSelect(newSelection, true);
  };

  return (
    <Stack w="100%" gap="6">
      {label && (
        <Flex>
          <Text pl="3">{label}</Text>
          {isRequired && (
            <Text c="red" pl="3">
              *
            </Text>
          )}
        </Flex>
      )}

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
