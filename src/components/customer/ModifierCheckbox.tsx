import { Box, Button, Divider, Stack, Text } from "@mantine/core";

import type { Modifier } from "../../helpers/menu";
import CheckIcon from "../../icons/CheckIcon";

interface ModifierCheckboxProps {
  label?: string;
  modifiers: Modifier[];
  onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
  selectedModifiers: Modifier[];
}

function ModifierCheckbox(props: ModifierCheckboxProps) {
  const { label, modifiers, selectedModifiers, onModifierSelect } = props;

  return (
    <Stack w="100%" gap="6">
      {label && <Text pl="3">{label}</Text>}
      <Box bdrs="sm" w="100%" bd="darkslategray solid 1px">
        <Button.Group w="100%" orientation="vertical">
          {modifiers.map((modifier, index) => {
            const isSelected = selectedModifiers.includes(modifier);
            return (
              <>
                {index !== 0 && <Divider />}
                <Button
                  fullWidth
                  radius="0"
                  key={modifier.id}
                  color="darkslategray"
                  justify="space-between"
                  onClick={() => onModifierSelect(modifier, !isSelected)}
                  rightSection={modifier.price && `+$${modifier.price}`}
                  variant={isSelected ? "filled" : "transparent"}
                >
                  {modifier.label}{" "}
                  {isSelected && (
                    <Box pl="3">
                      <CheckIcon />
                    </Box>
                  )}
                </Button>
              </>
            );
          })}
        </Button.Group>
      </Box>
    </Stack>
  );
}

export default ModifierCheckbox;
