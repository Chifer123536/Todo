import { AppDispatch } from "@/shared/config/store";
import { setOverflowMessage, clearOverflowMessage } from "./slice";

export const showOverflowMessage =
  (message: string, duration = 1000) =>
  (dispatch: AppDispatch) => {
    dispatch(setOverflowMessage(message));
    setTimeout(() => {
      dispatch(clearOverflowMessage());
    }, duration);
  };
