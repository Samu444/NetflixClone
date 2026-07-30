import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getActiveProfile } from "../utils/activeProfile";

function RequireProfile({ children }: { children: ReactNode }) {
  const activeProfile = getActiveProfile();

  if (!activeProfile) {
    return <Navigate to="/whos-watching" replace />;
  }

  return <>{children}</>;
}

export default RequireProfile;