import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  let submitAvailable = true;

  if (password != passwordCheck) {
    submitAvailable = false;
  }
  if (password.length === 0) {
    submitAvailable = false;
  }
  function handleSubmit() {
    axios
      .post("/api/member/signup", { id, password, email })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <h1>회원 가입</h1>
      <FormControl>
        <FormLabel>id</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl isInvalid={password.length == 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해주세요</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
