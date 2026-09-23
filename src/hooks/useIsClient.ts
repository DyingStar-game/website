import { useSyncExternalStore } from "react";

// Nothing to subscribe to: the value only differs between server and client.
const subscribe = () => () => undefined;

export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
