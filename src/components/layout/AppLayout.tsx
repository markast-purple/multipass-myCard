import type { ReactNode } from "react";
import { Header } from "./Header.tsx";
import { BottomNavigation } from "./BottomNavigation.tsx";
import { cn } from "../../utils/cn.utils.ts";
import { Container } from "../ui/Container.tsx";
import { Surface } from "../ui/Surface.tsx";

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
    <Surface className="flex h-dvh flex-col no-bounce overflow-hidden" as="div">
      <Header {...headerProps} />
      <main className={cn("flex-1 overflow-y-auto no-bounce")}>
        <Container className="min-h-full flex flex-col" noPadding>
          <div className="flex-1 flex flex-col">{children}</div>
        </Container>
      </main>
      <BottomNavigation />
    </Surface>
  );
}
