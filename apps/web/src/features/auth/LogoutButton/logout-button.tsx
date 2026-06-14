import { URLS } from "@/constants";

export default function LogoutButton() {
  return (
    <form action={URLS.API.AUTH.LOGOUT} method="post">
      <button type="submit">로그아웃</button>
    </form>
  );
}
