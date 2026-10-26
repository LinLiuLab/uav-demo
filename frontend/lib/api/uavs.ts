import { request } from "./client";
import { recordSchema } from "@/schema/common";

export const listUAVs = () => request("/uavs", recordSchema.array());
export const createUAV = () => request("/uavs", recordSchema, "POST");
