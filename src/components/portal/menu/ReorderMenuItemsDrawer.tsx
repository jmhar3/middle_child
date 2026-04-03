import { useState } from "react";

import {
  Flex,
  Text,
  Group,
  Stack,
  Drawer,
  Divider,
  ActionIcon,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import UpIcon from "../../../icons/UpIcon";
import TopIcon from "../../../icons/TopIcon";
import DownIcon from "../../../icons/DownIcon";
import BottomIcon from "../../../icons/BottomIcon";

import type { MenuItemType, Section } from "../../../state/menu/menuSlice";
import { useAppDispatch } from "../../../state/hooks";

interface ReorderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  items: (Section | MenuItemType)[];
}

function ReorderDrawer(props: ReorderDrawerProps) {
  const { isOpen, onClose, label, items } = props;

  const dispatch = useAppDispatch();

  const [orderedItems, setOrderedItems] =
    useState<(Section | MenuItemType)[]>(items);
  const [isUpdatingMenuItems, setIsUpdatingMenuItems] = useState(false);

  const onUpClick = (itemToMove: Section | MenuItemType) => {
    setOrderedItems((prevItems) =>
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
    setOrderedItems((prevItems) =>
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
    setOrderedItems((prevItems) => {
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
    setOrderedItems((prevItems) => {
      const firstHalf = prevItems.slice(0, itemToMove.order - 2);
      const secondHalf = prevItems.slice(itemToMove.order - 1);
      return [
        ...firstHalf,
        ...secondHalf.map((item) => ({ ...item, order: item.order - 1 })),
        { ...itemToMove, order: 1 },
      ];
    });
  };

  const onSaveOrder = () => {
    setIsUpdatingMenuItems(true);
    dispatch(upsertMenuItems(orderedItems)).finally(() => {
      setIsUpdatingMenuItems(false);
      onClose();
    });
  };

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          REORDER {label.toUpperCase()}
        </Text>

        <Divider w="100%" />

        <Stack align="flex-end">
          {orderedItems.map((item) => (
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

        <Group gap="sm">
          <StyledButton
            variant="outline"
            label="Cancel"
            onClick={onClose}
            isLoading={isUpdatingMenuItems}
          />
          <StyledButton
            label="Save"
            onClick={onSaveOrder}
            isLoading={isUpdatingMenuItems}
          />
        </Group>
      </Stack>
    </Drawer>
  );
}

export default ReorderDrawer;
