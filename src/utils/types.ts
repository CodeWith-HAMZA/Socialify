// * Utility Types, Used Accross The Whole Application
export type ReplaceProperty<
  InitialType,
  KeyToReplace extends keyof InitialType,
  NewType
> = Omit<InitialType, KeyToReplace> & {
  [P in KeyToReplace]: NewType;
};

/**
 * Replace a key (property name) in a type with a new key.
 *
 * @template T - The original type/interface.
 * @template OldKey - The existing property name to be replaced.
 * @template NewKey - The new property name.
 */
export type ReplaceKey<T, OldKey extends keyof T, NewKey extends string> = {
  [K in keyof T as K extends OldKey ? NewKey : K]: T[K];
};

/**
 * Removes specified keys from an object type.
 * @typeparam T - The original object type.
 * @typeparam K - The keys to be removed.
 *
 */
export type RemoveKeys<T, K extends keyof T> = {
  [Key in Exclude<keyof T, K>]: T[Key];
};

/**
 * Selects specified keys from an object type.
 * @typeparam T - The original object type.
 * @typeparam K - The keys to be selected.
 */
export type SelectKeys<T, K extends keyof T> = {
  [Key in K]: T[Key];
};

export type MediaType = { type: "image" | "video"; url: string };
