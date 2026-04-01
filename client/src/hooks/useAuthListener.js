import { selectUser } from "@/redux/features/auth/authSelector";
import {
  clearUser,
  closeAuthModal,
  setUser,
} from "@/redux/features/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { auth } from "@/firebase";

export const useAuthListener = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
          }),
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(closeAuthModal());
    }
  }, [dispatch, user]);
};
