import { request } from "./client";
import { recordSchema } from "@/schema/common";

export const listFacilities = () =>
  request("/facilities", recordSchema.array());
export const createFacility = () =>
  request("/facilities", recordSchema, "POST");
