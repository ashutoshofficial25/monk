import { useRoutes } from "react-router-dom";
import App from "../App";

export default function Routes() {
  return useRoutes([
    {
      path: "/",
      element: <App />,
    },
  ]);
}
