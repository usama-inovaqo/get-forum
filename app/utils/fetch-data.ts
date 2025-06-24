export async function fetchDataFromInternalApi<T>(
  url: string,
  token: string
): Promise<T | null> {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    console.log("Skipping fetch during build for:", url);
    return null;
  }

  console.log("fetching data from: ", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData?.error?.includes("not found")) {
        throw new Error("Email not found");
      }

      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from", url, ":", error);
    return null;
  }
}
