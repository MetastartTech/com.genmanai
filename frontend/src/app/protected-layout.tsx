import React from "react";
import useUser from "@/provider/userContext/useUserContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/loader";

const ProtectedLayout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { loading, initializing, user } = useUser();
  const router = useRouter();

  if (loading || initializing) {
    return <Loader />;
  }

  if (!user && typeof window !== "undefined") {
    router.push("/signin");
    return null;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedLayout;
