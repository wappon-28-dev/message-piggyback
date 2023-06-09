import { NetworkError, ResponseNotOkError } from "./constant";

type FetchArgs = Parameters<typeof fetch>;

async function fetchRequest<T>(
  fetchArg: FetchArgs,
  errMessage: string
): Promise<T> | never {
  const res = await fetch(...fetchArg).catch((err) => {
    throw new NetworkError(err);
  });

  if (!res.ok) {
    console.error(res);
    throw new ResponseNotOkError(errMessage, await res.json());
  }

  return (await res.json()) as T;
}

export { fetchRequest };
