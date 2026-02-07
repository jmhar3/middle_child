import { Button } from "@mantine/core";
import ProtectedRoute from "../ProtectedRoute";

function Menu() {
  return (
    <ProtectedRoute>
      <Button>Open Store</Button>
    </ProtectedRoute>
  );
}

export default Menu;
