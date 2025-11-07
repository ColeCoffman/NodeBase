import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type HttpRequestData = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  body?: string;
  variableName: string;
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

  if (!data.method) {
    // TODO: Publish "Error" state for HTTP request
    throw new NonRetriableError("HTTP Request Node: Method is required");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const options: KyOptions = {
      method: data.method,
    };
    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      const resolvedBody = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolvedBody);
      options.body = resolvedBody;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const compiledVariableName = Handlebars.compile(data.variableName)(context);

    return {
      ...context,
      [compiledVariableName]: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: Publish "Success" state for HTTP request

  return result;
};
