import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { getOverflowMessage } from "@/features/todo/OverflowMessage/model/selectors";
import { clearOverflowMessage } from "@/features/todo/OverflowMessage/model/slice";

import clsx from "clsx";
import styles from "./overflowMessage.module.scss";

export const OverflowMessage: React.FC = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector(getOverflowMessage);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (message) {
      setAnimate(false);
      requestAnimationFrame(() => {
        setAnimate(true);
      });

      const timeout = setTimeout(() => {
        dispatch(clearOverflowMessage());
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      className={clsx(styles.overflowMessage, { [styles.animate]: animate })}
    >
      {message}
    </div>
  );
};
