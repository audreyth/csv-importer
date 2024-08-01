export const apiSubmission = async ({ method, url, username, password, body }) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa(`${username}:${password}`),
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) {
      return true;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
