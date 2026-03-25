import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import multipassLogo from "../../assets/multipass_logo.png";
import { getAuthState } from "../../store/authStore.ts";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: () => {
    const { accessToken } = getAuthState();
    if (accessToken) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AuthRouteLayout,
});

function AuthRouteLayout() {
  return (
    <div className="min-h-dvh relative overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-success/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,92,92,0.08),_rgba(255,255,255,0.6)_45%,_rgba(255,255,255,1)_70%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col px-6 py-10">
        <header className="flex items-center gap-4">
          <div className="h-16 p-2 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <img src={multipassLogo} alt="Multipass" className="h-10" />
          </div>
        </header>

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
