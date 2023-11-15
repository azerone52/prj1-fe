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
import { useEffect, useState } from "react";

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

function CommentList({ commentList }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function handleDelete(id) {
    axios
      .delete("/api/comment/delete?id=" + id)
      .then(() => {
        toast({
          description: "삭제되었습니다.",
          status: "info",
        });
      })
      .catch(() => {
        toast({
          description: "삭제되지 않았습니다.",
          status: "warning",
        });
      })
      .finally(onClose);
  }

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
                <Button onClick={onOpen} size={"sm"}>
                  x
                </Button>
              </Flex>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>댓글을 삭제 하시겠습니까?</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>{comment.comment}</ModalBody>
                  <ModalFooter>
                    <Button onClick={onClose}>취소</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(comment.id)}
                    >
                      삭제
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
                {comment.comment}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [commentList, setCommentList] = useState([]);

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

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList boardId={boardId} commentList={commentList} />
    </Box>
  );
}
