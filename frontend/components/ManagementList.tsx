"use client";

import {
  Alert,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DemoRecord } from "@/schema/common";

type Props = {
  title: string;
  queryKey: string;
  listRecords: () => Promise<DemoRecord[]>;
  createRecord: () => Promise<DemoRecord>;
};

export function ManagementList({
  title,
  queryKey,
  listRecords,
  createRecord,
}: Props) {
  const queryClient = useQueryClient();
  const list = useQuery({ queryKey: [queryKey], queryFn: listRecords });
  const create = useMutation({
    mutationFn: createRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  return (
    <Stack maw={960} mx="auto" gap="lg">
      <Group justify="space-between">
        <Title order={2}>{title}</Title>
        <Button loading={create.isPending} onClick={() => create.mutate()}>
          新建
        </Button>
      </Group>
      {create.isError && (
        <Alert color="red" role="alert">
          {create.error.message}
        </Alert>
      )}
      {list.isError && (
        <Alert color="red" role="alert" title="加载失败">
          {list.error.message}
          <Button
            ml="md"
            size="compact-xs"
            variant="subtle"
            onClick={() => list.refetch()}
          >
            重试
          </Button>
        </Alert>
      )}
      <Paper withBorder p="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>序号</Table.Th>
              <Table.Th>名称</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {list.data?.map((record) => (
              <Table.Tr key={record.id}>
                <Table.Td>{record.id}</Table.Td>
                <Table.Td>{record.name}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {list.isPending && (
          <Group justify="center" p="xl">
            <Loader size="sm" />
          </Group>
        )}
        {list.isSuccess && list.data.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            暂无数据，点击新建添加一条记录
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
