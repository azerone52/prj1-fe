import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  function handleSubmit() {
    axios
      .post("/api/board/add", { title, content, writer })
      .then(() => console.log("잘됨"))
      .catch(() => console.log("안됨"))
      .finally(() => console.log("끝"));
  }

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="blue">
          저장
        </Button>
      </Box>
    </Box>
  );
}
