import { Box, Button, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      // boardId: boardId, 생략 가능
      // comment: comment,
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>입력</Button>
    </Box>
  );
}

function CommentList() {
  return <Box>댓글리스트</Box>;
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList />
    </Box>
  );
}
