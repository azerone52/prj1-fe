import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>글 보기</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea value={board.content} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.writer} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>
    </Box>
  );
}
