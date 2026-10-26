"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Center,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { login } from "@/lib/api/auth";
import { setLoggedIn } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setPending(true);
    setError(null);
    try {
      await login();
      setLoggedIn();
      router.replace("/dashboard/uavs");
    } catch (error) {
      setError(error instanceof Error ? error.message : "登录失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <Center mih="100dvh" p="md">
      <Paper withBorder p="xl" w={360}>
        <Stack gap="lg">
          <div>
            <Title order={2}>无人机巡检平台</Title>
            <Text c="dimmed" size="sm" mt={6}>
              软件工程课程 Demo
            </Text>
          </div>
          <TextInput label="账号" value="demo" readOnly />
          {error && (
            <Alert color="red" role="alert">
              {error}
            </Alert>
          )}
          <Button fullWidth loading={pending} onClick={handleLogin}>
            登录
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
