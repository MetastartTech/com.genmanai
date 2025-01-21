import React from "react";
import { ReactElement } from "react";
import useUser from "@/provider/userContext/useUserContext";
import { useRouter } from "next/navigation";

const ProtectedLayout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { loading, initializing, user } = useUser();
  const router = useRouter();

  if (loading || initializing) {
    return <p>Loading ...</p>;
  }

  if (user) {
    return <>{children}</>;
  }

  if (typeof window !== "undefined") {
    router.push("/signin");
  }

  return null;
};

export default ProtectedLayout;
