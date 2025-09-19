/**
 * @name ErrorParams
 *
 * @usage
 * This type is used to define the parameters of the `error.tsx` page.
 */
export type ErrorParams = {
  error: Error & { digest?: string };
  reset: () => void;
};
