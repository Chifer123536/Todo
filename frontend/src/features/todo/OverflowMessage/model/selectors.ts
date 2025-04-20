// features/OverflowMessage/model/selectors.ts
import { RootState } from "@/shared/todo/config/store";

export const getOverflowMessage = (state: RootState) =>
  state.overflowMessage.message;
