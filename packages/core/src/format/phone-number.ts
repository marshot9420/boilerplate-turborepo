export function formatKoreanPhoneNumber(phoneNumber: string): string {
  if (/^02\d{7,8}$/.test(phoneNumber)) {
    return phoneNumber.replace(/^(02)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  }

  if (/^0\d{9,10}$/.test(phoneNumber)) {
    return phoneNumber.replace(/^(0\d{2})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  }

  return phoneNumber;
}
