import type { Dispatch, SetStateAction } from "react";

import { Flex, Text, Stack, ActionIcon } from "@mantine/core";

import UpIcon from "../icons/UpIcon";
import TopIcon from "../icons/TopIcon";
import DownIcon from "../icons/DownIcon";
import BottomIcon from "../icons/BottomIcon";

import type { MenuItemType, Section } from "../state/menu/menuSlice";

interface ReorderListProps {
  items: (Section | MenuItemType)[];
  setItems: Dispatch<SetStateAction<(Section | MenuItemType)[]>>;
}

function ReorderList(props: ReorderListProps) {
  const { items, setItems } = props;

  const onUpClick = (itemToMove: Section | MenuItemType) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item === itemToMove) {
          return { ...item, order: item.order + 1 };
        } else if (itemToMove.order + 1 === item.order) {
          return { ...item, order: item.order - 1 };
        }
        return item;
      }),
    );
  };

  const onDownClick = (itemToMove: Section | MenuItemType) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item === itemToMove) {
          return { ...item, order: item.order - 1 };
        } else if (itemToMove.order - 1 === item.order) {
          return { ...item, order: item.order + 1 };
        }
        return item;
      }),
    );
  };

  const onTopClick = (itemToMove: Section | MenuItemType) => {
    setItems((prevItems) => {
      const firstHalf = prevItems.slice(0, itemToMove.order - 2);
      const secondHalf = prevItems.slice(itemToMove.order - 1);
      return [
        { ...itemToMove, order: 1 },
        ...firstHalf.map((item) => ({ ...item, order: item.order + 1 })),
        ...secondHalf,
      ];
    });
  };

  const onBottomClick = (itemToMove: Section | MenuItemType) => {
    setItems((prevItems) => {
      const firstHalf = prevItems.slice(0, itemToMove.order - 2);
      const secondHalf = prevItems.slice(itemToMove.order - 1);
      return [
        ...firstHalf,
        ...secondHalf.map((item) => ({ ...item, order: item.order - 1 })),
        { ...itemToMove, order: 1 },
      ];
    });
  };

  return (
    <Stack align="flex-end">
      {items.map((item) => (
        <Flex key={item.id}>
          <ActionIcon.Group orientation="vertical">
            <ActionIcon
              size="lg"
              aria-label="Move Up"
              onClick={() => onUpClick(item)}
            >
              <UpIcon />
            </ActionIcon>

            <ActionIcon
              size="lg"
              aria-label="Move Down"
              onClick={() => onDownClick(item)}
            >
              <DownIcon />
            </ActionIcon>
          </ActionIcon.Group>

          <Text>{item.label}</Text>

          <ActionIcon.Group orientation="vertical">
            <ActionIcon
              size="lg"
              aria-label="Move To Top"
              onClick={() => onTopClick(item)}
            >
              <TopIcon />
            </ActionIcon>

            <ActionIcon
              size="lg"
              aria-label="Move To Bottom"
              onClick={() => onBottomClick(item)}
            >
              <BottomIcon />
            </ActionIcon>
          </ActionIcon.Group>
        </Flex>
      ))}
    </Stack>
  );
}

export default ReorderList;
