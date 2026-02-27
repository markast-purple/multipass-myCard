import type { ReactNode } from "react";
import { Header } from "./Header.tsx";
import { BottomNavigation } from "./BottomNavigation.tsx";
import { cn } from "@/utils/cn.utils.ts";

interface AppLayoutProps {
  children: ReactNode;
  headerProps?: {
    isVouchersPage?: boolean;
    isMainPage?: boolean;
    title?: string;
    description?: string;
    phoneNumber?: string;
    backTarget?: string;
  };
}

export function AppLayout({ children, headerProps }: AppLayoutProps) {
  return (
    <div className="flex h-dvh flex-col bg-white no-bounce overflow-hidden">
      <Header {...headerProps} />
      <main className={cn("flex-1 overflow-y-auto no-bounce")}>
        <div className="bg-white min-h-full flex flex-col">
          <div className="bg-white flex-1 flex flex-col">{children}</div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
