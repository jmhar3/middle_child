import { Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";

function Link(props: { link: string; label: string }) {
  const { hovered, ref } = useHover();

  return (
    <Text
      ref={ref}
      component="a"
      target="_blank"
      href={props.link}
      c={hovered ? "red.9" : undefined}
    >
      {props.label}
    </Text>
  );
}

export default Link;
