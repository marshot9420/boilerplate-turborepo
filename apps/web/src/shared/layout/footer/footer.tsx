export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border)">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {currentYear} Web. All rights reserved.</p>
        <p>Powered by Turborepo Boilerplate.</p>
      </div>
    </footer>
  );
}
