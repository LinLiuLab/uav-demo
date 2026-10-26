import { request } from "./client";
import { userSchema } from "@/schema/common";

export function login() {
  return request("/login", userSchema, "POST");
}
