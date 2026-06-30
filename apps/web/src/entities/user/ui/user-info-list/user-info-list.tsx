import { DataList, DataListItem, DataListLabel, DataListValue } from "@repo/design-system/web";
import type { UserDetailResponse } from "@repo/domain/user/client";

import { formatUserDate, getUserRoleLabel, getUserStatusLabel } from "../../lib";

export interface UserInfoListProps {
  user: UserDetailResponse;
  className?: string;
}

export default function UserInfoList({ user, className }: UserInfoListProps) {
  return (
    <DataList className={className}>
      <DataListItem>
        <DataListLabel>이메일</DataListLabel>
        <DataListValue>{user.email}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>이름</DataListLabel>
        <DataListValue>{user.name ?? "없음"}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>닉네임</DataListLabel>
        <DataListValue>{user.nickname}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>권한</DataListLabel>
        <DataListValue>{getUserRoleLabel(user.role)}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>상태</DataListLabel>
        <DataListValue>{getUserStatusLabel(user.status)}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>가입일</DataListLabel>
        <DataListValue>{formatUserDate(user.createdAt)}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>수정일</DataListLabel>
        <DataListValue>{formatUserDate(user.updatedAt)}</DataListValue>
      </DataListItem>

      <DataListItem>
        <DataListLabel>최근 로그인</DataListLabel>
        <DataListValue>{formatUserDate(user.lastLoginAt)}</DataListValue>
      </DataListItem>
    </DataList>
  );
}
