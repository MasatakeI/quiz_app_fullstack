import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import {
  faHistory,
  faHome,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  selectIsAuthModalOpen,
  selectUser,
} from "@/redux/features/auth/authSelector";

export const useHeaderIcons = () => {
  const { handleGoHome, handleGoHistory, handleOpenModal, handleSignOut } =
    useNavigationHelper();

  const location = useLocation();
  const isAuthModalOpen = useSelector(selectIsAuthModalOpen);
  const user = useSelector(selectUser);

  const headerIconButtons = [
    {
      icon: faHome,
      title: "ホームへ戻る",
      onClick: handleGoHome,
      isActive: location.pathname === "/",
    },
    {
      icon: faHistory,
      title: "クイズの記録を見る",
      onClick: handleGoHistory,
      isActive: location.pathname === "/quiz/history",
    },
    {
      icon: user ? faRightFromBracket : faRightToBracket,
      isLoggedIn: user ? true : false,
      title: user ? "ログアウト" : "ログイン",
      onClick: user ? handleSignOut : handleOpenModal,
      isActive: isAuthModalOpen,
    },
  ];

  return { handleGoHome, headerIconButtons };
};
