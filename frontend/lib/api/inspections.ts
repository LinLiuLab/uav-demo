import { request } from "./client";
import { recordSchema } from "@/schema/common";

export const listInspections = () =>
  request("/inspections", recordSchema.array());
export const createInspection = () =>
  request("/inspections", recordSchema, "POST");
