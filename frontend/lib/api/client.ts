import { z } from "zod";
import { responseSchema } from "@/schema/common";

export async function request<TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
  method: "GET" | "POST" = "GET",
): Promise<z.infer<TSchema>> {
  const response = await fetch(`/api${path}`, { method, cache: "no-store" });
  const body: unknown = await response.json().catch(() => {
    throw new Error("接口没有返回有效 JSON，请检查后端是否已启动");
  });
  if (!response.ok) {
    const error = z.object({ message: z.string() }).safeParse(body);
    throw new Error(
      error.success ? error.data.message : `请求失败（${response.status}）`,
    );
  }
  const result = responseSchema(schema).safeParse(body);
  if (!result.success) throw new Error("接口返回的数据格式不符合约定");
  return result.data.data;
}
