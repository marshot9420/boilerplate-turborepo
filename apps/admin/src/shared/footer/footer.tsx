import { Container } from "@repo/design-system/admin";

export default function Footer() {
  return (
    <footer className="border-border border-t">
      <Container size="full" padding="md" className="py-4">
        <p className="text-muted-foreground text-xs">Boilerplate Turborepo</p>
      </Container>
    </footer>
  );
}
