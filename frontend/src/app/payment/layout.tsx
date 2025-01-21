"use client";

import UserProvider from "@/provider/userContext/userProvider";

const PaymentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <UserProvider>{children}</UserProvider>
  );
};

export default PaymentLayout;
