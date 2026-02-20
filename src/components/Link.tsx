import { Button } from "@mantine/core";

import type { ReactElement } from "react";

function Link(props: { link: string; label: string; icon?: ReactElement }) {
  return (
    <Button
      component="a"
      target="_blank"
      variant="light"
      href={props.link}
      leftSection={props.icon}
      color="darkslategray"
    >
      {props.label.toUpperCase()}
    </Button>
  );
}

export default Link;
