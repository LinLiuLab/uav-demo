import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { ManagementList } from "@/components/ManagementList";

function showList(
  listRecords = vi.fn().mockResolvedValue([]),
  createRecord = vi.fn(),
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <ManagementList
          title="无人机管理"
          queryKey="uavs"
          listRecords={listRecords}
          createRecord={createRecord}
        />
      </MantineProvider>
    </QueryClientProvider>,
  );
}

describe("管理页示例", () => {
  it("新建成功后重新读取服务端列表并显示新记录", async () => {
    const user = userEvent.setup();
    const record = { id: 1, name: "无人机1" };
    const list = vi.fn().mockResolvedValueOnce([]).mockResolvedValue([record]);
    const create = vi.fn().mockResolvedValue(record);
    showList(list, create);
    await screen.findByText("暂无数据，点击新建添加一条记录");
    await user.click(screen.getByRole("button", { name: "新建" }));
    expect(await screen.findByText("无人机1")).toBeInTheDocument();
    expect(create).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledTimes(2);
  });

  it("新建失败时显示错误且不伪造数据行", async () => {
    const user = userEvent.setup();
    const create = vi.fn().mockRejectedValue(new Error("数据操作失败，请重试"));
    showList(undefined, create);
    await screen.findByText("暂无数据，点击新建添加一条记录");
    await user.click(screen.getByRole("button", { name: "新建" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "数据操作失败，请重试",
    );
    expect(screen.queryByText("无人机1")).not.toBeInTheDocument();
  });
});
