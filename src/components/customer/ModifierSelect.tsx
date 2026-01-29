import { useEffect, useState } from "react";
import { Checkbox, Radio, Select } from "@mantine/core";

import type { ItemOptions } from "../../helpers/menu";

interface ModifierSelectProps extends ItemOptions {
  onModifierSelect: (selectedModifier: string | string[]) => void;
}

function ModifierSelect(props: ModifierSelectProps) {
  const {
    label,
    modifiers,
    defaultSelected,
    allowMultipleSelections,
    onModifierSelect,
  } = props;

  const [selectedModifier, setSelectedModifier] = useState<string | undefined>(
    defaultSelected,
  );
  const [multipleSelectedModifiers, setMultipleSelectedModifiers] = useState<
    string[]
  >([]);

  useEffect(() => {
    onModifierSelect(selectedModifier || multipleSelectedModifiers);
  }, [onModifierSelect, selectedModifier, multipleSelectedModifiers]);

  if (allowMultipleSelections)
    return (
      <Checkbox.Group
        w="100%"
        value={multipleSelectedModifiers}
        onChange={setMultipleSelectedModifiers}
      >
        {modifiers.map((modifier) => (
          <Checkbox
            key={modifier.id}
            value={modifier.id}
            label={
              modifier.price
                ? `${modifier.label} +$${modifier.price}`
                : modifier.label
            }
            defaultChecked={defaultSelected?.includes(modifier.id)}
            styles={{
              root: { background: "red.1" },
              body: { background: "var(--mantine-color-red-1)" },
            }}
          />
        ))}
      </Checkbox.Group>
    );

  return (
    <Select
      w="100%"
      label={label}
      data={modifiers.map((modifier) => ({
        value: modifier.id,
        label: modifier.price
          ? `${modifier.label} +$${modifier.price}`
          : modifier.label,
      }))}
      value={selectedModifier}
      onChange={setSelectedModifier}
    />
    // <Radio.Group
    //   value={selectedModifier}
    //   onChange={setSelectedModifier}
    //   name={label}
    //   label={label}
    // >
    //   {modifiers.map((modifier) => (
    //     <Radio
    //       key={modifier.id}
    //       value={modifier.id}
    //       label={modifier.label}
    //       defaultChecked={defaultSelected?.includes(modifier.id)}
    //     />
    //   ))}
    // </Radio.Group>
  );
}

export default ModifierSelect;
