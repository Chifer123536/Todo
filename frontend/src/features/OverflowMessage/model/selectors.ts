// features/OverflowMessage/model/selectors.ts
import { RootState } from "@/shared/config/store";

export const getOverflowMessage = (state: RootState) =>
  state.overflowMessage.message;
