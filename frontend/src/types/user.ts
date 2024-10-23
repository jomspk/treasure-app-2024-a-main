import { components } from "../openapi/schema";

export type User = Omit<components["schemas"]["OriginalUser"], "createdAt">;
