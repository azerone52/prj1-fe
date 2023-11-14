import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);
function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }
  console.log(login);
  function isAuthenticated() {
    return login !== ""; // 빈 스트링이 아니면 로그인한 상태
  }
  function isAdmin() {
    if (login.auth) {
      // 하나라도 name이 admin인 배열 요소가 있는지
      return login.auth.some((elem) => elem.name === "admin");
    }

    return false;
  }

  // function hasAuth(auth){
  //   // 하나라도 name이 admin인 배열 요소가 있는지
  //   return login.auth.some(elem=>elem.name===auth);
  // }

  function hasAccess(userId) {
    return login.id === userId;
  }
  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
