import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");

  const [idAvailable, setIdAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [nickNameAvailable, setNickNameAvailable] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  let submitAvailable = true;

  if (!nickNameAvailable) {
    submitAvailable = false;
  }
  if (!emailAvailable) {
    submitAvailable = false;
  }
  if (!idAvailable) {
    submitAvailable = false;
  }
  if (password != passwordCheck) {
    submitAvailable = false;
  }
  if (password.length === 0) {
    submitAvailable = false;
  }
  //TODO:가입 버튼을 누르면=>해당 없는 것들 전부 false로 만들어서=>빨간선이 오르게 하기
  function handleSubmit() {
    axios
      .post("/api/member/signup", { id, password, email })
      .then(() => {
        //toast
        //navigate
        toast({
          description: "회원 가입이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        //toast
        if (error.response.status === 400) {
          toast({
            description: "입력 값을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "가입 중에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      });
  }

  function handleIdCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("id", id);

    // console.log(searchParams.toString());//id=입력한아이디
    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용 중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
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

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 닉네임 입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>회원 가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>nick name</FormLabel>
        <Flex>
          <Input
            value={nickName}
            onChange={(e) => {
              setNickNameAvailable(false);
              setNickName(e.target.value);
            }}
          />
          <Button onClick={handleNickNameCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>닉네임 중복 체크를 해주세요</FormErrorMessage>
      </FormControl>
      {/*<FormControl isInvalid={password.length == 0}>*/}
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/*<FormErrorMessage>암호를 입력해주세요</FormErrorMessage>*/}
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
      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmailAvailable(false);
              setEmail(e.target.value);
            }}
          />
          <Button onClick={handleEmailCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>email 중복 체크를 해주세요.</FormErrorMessage>
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
