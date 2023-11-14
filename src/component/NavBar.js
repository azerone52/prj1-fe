import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../App";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated } = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    // TODO: 로그아웃 후 할 일 추가
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      <Button onClick={() => navigate("/write")}>write</Button>
      <Button onClick={() => navigate("/signup")}>signup</Button>
      <Button onClick={() => navigate("/member/list")}>회원목록</Button>
      <Button onClick={() => navigate("/login")}>로그인</Button>
      <Button onClick={handleLogout}>로그아웃</Button>
    </Flex>
  );
}
