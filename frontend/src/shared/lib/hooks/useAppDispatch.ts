import { useDispatch } from "react-redux";
import { AppDispatch } from "@/shared/todo/config/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
