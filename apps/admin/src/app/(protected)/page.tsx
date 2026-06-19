export const runtime = "nodejs";

export default function HomePage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
      <p className="text-muted-foreground text-sm">
        관리자 샘플 기능을 연결하기 위한 기본 화면입니다.
      </p>
    </section>
  );
}
