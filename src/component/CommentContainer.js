import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        입력
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 목록</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {/*엔터 출력->sx={{whiteSpace:"pre-wrap"}}*/}
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent={"space-between"}>
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize={"xs"}>{comment.inserted}</Text>
              </Flex>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
                  {comment.comment}
                </Text>
                <Button
                  isDisabled={isSubmitting}
                  onClick={() => onDeleteModalOpen(comment.id)}
                  size={"xs"}
                  colorScheme="red"
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState(0);
  const [commentList, setCommentList] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    // submit 중이면 re render 하지 않도록
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params) //더하기 연산자 덕분에 toString 없어도 String으로 들어가긴 함
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    // 여기의 comment는 객체 {boardId, comment}
    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    // console.log(id + "번 댓글 삭제");
    // TODO: 모달, then, catch, finally

    setIsSubmitting(true);
    axios.delete("/api/comment/" + id).finally(() => {
      setIsSubmitting(false);
      onClose();
    });
  }

  function handleDeleteModalOpen(id) {
    //id를 어딘가 저장
    setId(id);
    //모달 열기
    onOpen();
  }

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/*삭제 모달*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
