import { redirect } from "react-router";
import { API_URL } from "../../constants/urls";
import { SESSION_TOKEN_KEY } from "../../stores/auth";

class FetcherError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

type FetcherArgs = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export const fetcher = async <T>(
  url: string,
  options: FetcherArgs = {},
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    method: options.body && !options.method ? "POST" : options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  });

  if (!res?.ok) throw new FetcherError(`Error fetching: ${url}`, res.status);

  return res.json();
};

export const manageSalaryFetcher = async <T>(
  url: `/${string}`,
  options: FetcherArgs = {},
) => {
  // try {
  return await fetcher<T>(API_URL + url, options);
  // } catch (error: any) {
  // console.log("=== error", error.statusCode);
  // const existtokenInRequest =
  // @ts-expect-error test
  // options?.headers?.Authorization || options?.headers?.authorization;

  // if (existtokenInRequest && error.statusCode === 401) {
  // localStorage.setItem(SESSION_TOKEN_KEY, "");
  // redirect("/");
  // }

  throw error;
  // }
};
