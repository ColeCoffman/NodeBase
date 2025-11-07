import type { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  body?: string;
  variableName?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "Loading" state for HTTP request

  if (!data.endpoint) {
    // TODO: Publish "Error" state for HTTP request
    throw new NonRetriableError("HTTP Request Node: Endpoint is required");
  }

  if (!data.variableName) {
    // TODO: Publish "Error" state for HTTP request
    throw new NonRetriableError("HTTP Request Node: Variable name is required");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method ?? "GET";

    const options: KyOptions = {
      method,
    };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(data.endpoint!, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // If a variable name is provided, store the response in the context under that variable name
    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };
    }
    // Otherwise, store the response in the context under the httpResponse key
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: Publish "Success" state for HTTP request

  return result;
};
