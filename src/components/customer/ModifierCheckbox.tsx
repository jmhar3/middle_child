import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";

import CheckIcon from "../../icons/CheckIcon";

import type { Modifier } from "../../state/types";

interface ModifierCheckboxProps {
  label?: string;
  isRequired: boolean;
  modifiers: Modifier[];
  onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
  selectedModifiers: Modifier[];
}

function ModifierCheckbox(props: ModifierCheckboxProps) {
  const { label, isRequired, modifiers, selectedModifiers, onModifierSelect } =
    props;

  return (
    <Stack w="100%" gap="6">
      {label && (
        <Flex>
          <Text pl="3">{label}</Text>
          {isRequired && (
            <Text pl="3" c="red">
              *
            </Text>
          )}
        </Flex>
      )}

      <Box bdrs="sm" w="100%" bd="darkslategray solid 1px" bg="white">
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
                  rightSection={modifier.price && `+ $${modifier.price}`}
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
