import { useDispatch } from "react-redux";
import { AppDispatch } from "@/shared/config/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
