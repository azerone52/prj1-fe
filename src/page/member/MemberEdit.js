import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useTabPanel,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();
  const [params] = useSearchParams();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
    });
  }, []);

  const id = params.get("id");

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  let emailChecked = sameOriginEmail || emailAvailable;

  // 암호가 없으면 기존 암호
  // 암호를 작성하면 새 암호, 암호 확인 체크
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

      {/*  email을 변경하면(작성시작) 중복확인 다시 하도록  */}
      {/*  기존 email과 같으면 중복확인 안해도됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
      <Button isDisabled={!emailChecked || !passwordChecked} colorScheme="blue">
        수정
      </Button>
    </Box>
  );
}
