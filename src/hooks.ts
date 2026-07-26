/**
 * hooks.ts - Typed React Redux hooks.
 *
 * useDispatch and useSelector are generic in react-redux, but TypeScript
 * cannot infer this app's RootState and AppDispatch automatically.
 *
 * Wrapping them once here gives every component fully typed access to
 * the store without repeating type imports.
 */

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./app/store";

/** Typed dispatch supports both plain actions and createAsyncThunk thunks. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Typed selector makes the state parameter automatically RootState. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
