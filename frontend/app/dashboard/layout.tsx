"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppShell,
  Button,
  Center,
  Loader,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { clearLogin, isLoggedIn } from "@/lib/session";

const navigation = [
  { href: "/dashboard/uavs", label: "无人机管理" },
  { href: "/dashboard/facilities", label: "设施管理" },
  { href: "/dashboard/inspections", label: "巡检管理" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) setReady(true);
    else router.replace("/login");
  }, [router]);

  function logout() {
    clearLogin();
    queryClient.clear();
    setReady(false);
    router.replace("/login");
  }

  if (!ready)
    return (
      <Center mih="100dvh">
        <Loader size="sm" />
      </Center>
    );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: { base: 128, sm: 200 }, breakpoint: 0 }}
      padding="lg"
    >
      <AppShell.Header>
        <div className="demo-header">
          <Text fw={600}>无人机巡检平台</Text>
          <Button variant="subtle" onClick={logout}>
            退出登录
          </Button>
        </div>
      </AppShell.Header>
      <AppShell.Navbar className="demo-sidebar">
        <Stack gap={6}>
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
