import { Button, Stack } from "@mantine/core";

import ProtectedRoute from "../ProtectedRoute";
import Nav from "../../components/portal/Nav";

function Orders() {
  return (
    <ProtectedRoute>
      <Stack>
        <Nav>
          <Stack dir="row" gap={2}>
            <Button variant="outlined">Update Stock</Button>
            <Button variant="contained">Close Store</Button>
          </Stack>
        </Nav>
      </Stack>
    </ProtectedRoute>
  );
}

export default Orders;
