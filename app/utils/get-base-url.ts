// for hitting the frontend routes
export function getNextJsRouteUrl(): string {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://34.168.198.152:3000";

  return baseUrl;
}

// for hitting the actual backend
export function getBaseUrlForApi(): string {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : "http://34.168.198.152:8888";
}
