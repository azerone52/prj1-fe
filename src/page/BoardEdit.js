import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  // /edit/:id
  const { id } = useParams();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    //저장 버튼 클릭시
    // PUT /api/board/edit

    axios
      .put("/api/board/edit", board)
      .then(() => console.log("잘됨"))
      .catch(() => console.log("잘 안됨"))
      .finally(onClose);
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.writer = e.target.value;
            })
          }
        />
      </FormControl>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>정말 수정 하시겠습니까?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              수정하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button colorScheme="blue" onClick={onOpen}>
        저장
      </Button>
      {/* navigate(-1): 이전 경로로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
