import { Navigate, useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { selectUser } from "../state/user/userSlice";
import { fetchUser, setUser } from "../state/user/userThunks";
import { useAppDispatch, useAppSelector } from "../state/hooks";

function Auth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const location = useLocation();
  const hash = location.hash;

  if (hash) {
    const searchParams = new URLSearchParams(hash.replace("#", "?"));
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    if (access_token && refresh_token) {
      dispatch(
        setUser({ access_token: access_token, refresh_token: refresh_token }),
      )
        .then(() => dispatch(fetchUser()))
        .catch((error) =>
          notifications.show({
            message: error,
            withCloseButton: false,
            position: "bottom-right",
            color: "red",
          }),
        )
        .finally(() => {
          if (user?.is_admin) {
            return <Navigate to="/portal/orders" replace />;
          }
        });
    }
  }

  return <Navigate to="/" replace />;
}

export default Auth;
