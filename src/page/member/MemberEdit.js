import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";

export function MemberEdit() {
  const [member, updateMember] = useImmer({});

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => updateMember(response.data));
  }, []);

  function handleButton() {
    axios
      .put("/api/member/edit", member)
      .then(() => {
        toast({
          description: "수정 했습니다.",
          status: "success",
        });
        navigate(-1);
      })
      .catch(() =>
        toast({
          description: "실패했습니다.",
          status: "error",
        }),
      );
  }

  return (
    <Box>
      <h1>{member.id}님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          onChange={(e) =>
            updateMember((draft) => {
              draft.password = e.target.value;
            })
          }
          value={member.password}
        />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          onChange={(e) =>
            updateMember((draft) => {
              draft.email = e.target.value;
            })
          }
          value={member.email}
        />
      </FormControl>
      <Button onClick={() => navigate(-1)}>돌아가기</Button>
      <Button colorScheme="blue" onClick={handleButton}>
        수정하기
      </Button>
    </Box>
  );
}
