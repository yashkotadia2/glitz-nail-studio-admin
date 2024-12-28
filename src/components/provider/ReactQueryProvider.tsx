// src/components/ReactQueryProvider.tsx
"use client"; // If you're using app router (Next.js 13+)

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const ReactQueryProvider = ({ children }: Props) => {
  // Create a new QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
