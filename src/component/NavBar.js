import { Box, Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPen,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams();

  // 현재 위치가 바뀌는 경우 side effec를 시행하기 적절함
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    // TODO: 로그아웃 후 할 일 추가
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex mb={10}>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        onClick={() => navigate("/")}
      >
        HOME
      </Button>
      {isAuthenticated() && (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faPen} />}
          onClick={() => navigate("/write")}
        >
          작성
        </Button>
      )}
      <Spacer />
      {isAuthenticated() || (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/signup")}
        >
          회원가입
        </Button>
      )}
      {isAdmin() && (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faUsers} />}
          onClick={() => navigate("/member/list")}
        >
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faUser} />}
          onClick={() => navigate("/member?" + urlParams.toString())}
        >
          {login.nickName}님
        </Button>
      )}
      {isAuthenticated() || (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
          onClick={() => navigate("/login")}
        >
          로그인
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
