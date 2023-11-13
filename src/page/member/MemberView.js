import { useSearchParams } from "react-router-dom";

export function MemberView() {
  // /member?id=userid
  const [params] = useSearchParams();
  return <div>{params.get("id")} 님 회원 정보 보기</div>;
}
