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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

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
  const { hasAccess } = useContext(LoginContext);
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
                {hasAccess(comment.memberId) && (
                  <Button
                    isDisabled={isSubmitting}
                    onClick={() => onDeleteModalOpen(comment.id)}
                    size={"xs"}
                    colorScheme="red"
                  >
                    <DeleteIcon />
                  </Button>
                )}
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
  // const [id, setId] = useState(0);
  // useRef: 컴포넌트에서 임시로 값을 저장하는 용도로 사용 렌더링을 유도하지 않음
  // 쓰면 안될 때: 렌더링 하는 중에 사용하지 않기(렌더링과 관련 없으므로 의도하지 않은 결과가 나올 수 있음
  // 쓰면 좋을 때: 함수 안에서 변경 시키거나 읽기
  const commentIdRef = useRef(0);
  const [commentList, setCommentList] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

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
      .then(() => {
        toast({
          description: "댓글이 등록 되었습니다.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "댓글 등록 중 문제가 발생했습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    // console.log(id + "번 댓글 삭제");

    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제 되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }

  function handleDeleteModalOpen(id) {
    //id를 어딘가 저장
    commentIdRef.current = id;
    //모달 열기
    onOpen();
  }

  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
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
