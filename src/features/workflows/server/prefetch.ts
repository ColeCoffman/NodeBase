import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

// Prefetch all workflows
export const prefetchWorkflows = (params: Input) => {
  prefetch(trpc.workflows.getMany.queryOptions(params));
};
