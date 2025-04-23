import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
