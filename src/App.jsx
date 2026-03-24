import React from "react";
import "./App.css";

import Header from "@/components/layout/Header/Header";
import AppRoutes from "./AppRoutes";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";
import AuthForm from "./components/widgets/AuthForm/AuthForm";
import BasicModal from "./components/common/BasicModal/BasicModal";

import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "./redux/features/snackbar/snackbarSlice";
import {
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";
import { selectIsAuthModalOpen } from "./redux/features/auth/authSelector";
import { closeAuthModal } from "./redux/features/auth/authSlice";
import { useAuthListener } from "./hooks/useAuthListener";

const App = () => {
  const dispatch = useDispatch();
  useAuthListener();

  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);
  const isAuthModalOpen = useSelector(selectIsAuthModalOpen);

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <AppRoutes />
      </div>

      <SimpleSnackbar
        isOpen={snackbarOpen}
        onClose={() => dispatch(hideSnackbar())}
        message={snackbarMessage}
      />

      <BasicModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
        component={<AuthForm />}
      />
    </div>
  );
};

export default App;
