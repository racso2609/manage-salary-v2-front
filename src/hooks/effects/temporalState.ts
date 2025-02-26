import { useEffect, useState } from "react";

export type useTemporalState = {
  timeInSeconds?: number;
};

const useTemporalState = <T>({ timeInSeconds = 2 }: useTemporalState = {}) => {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    setTimeout(() => {
      setState(undefined);
    }, timeInSeconds * 1000);
  }, [state, timeInSeconds]);

  return {
    state,
    setState,
  };
};

export default useTemporalState;
