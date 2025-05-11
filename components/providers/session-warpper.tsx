"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";

interface SessionWrapperProps {
  children: React.ReactNode;
}

export function SessionWrapper({ children }: SessionWrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
