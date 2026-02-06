import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface HomeButtonProps {
  label: string;
  path: string;
  image?: string;
  isExternal?: boolean;
  textAlign?: CanvasTextAlign;
}

function HomeButton(props: HomeButtonProps) {
  const { label, path, isExternal, textAlign } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      w="100%"
      component="a"
      variant="filled"
      color="darkslategray"
      size={isMobile ? "lg" : "xl"}
      target={isExternal ? "_blank" : undefined}
      justify={textAlign}
      href={path}
    >
      {label}
    </Button>
  );
}

export default HomeButton;
