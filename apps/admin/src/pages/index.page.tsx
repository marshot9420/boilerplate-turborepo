import Head from "next/head";
import { prisma } from "@package/database";
import { Button, Container } from "@package/design-system";

export async function getStaticProps() {
  const user = await prisma.user.findFirst();

  return {
    props: { user },
  };
}

export default function Home({ user }) {
  console.log("DATABASE_URL: ", process.env["DATABASE_URL"]);
  console.log(user);

  return (
    <>
      <Head>
        <title>Turborepo Boilerplate - Admin</title>
        <meta
          name="description"
          content="Turborepo와 pnpm을 사용해서 구축한 Next.js 엔터프라이즈급 템플릿"
        />
      </Head>

      <Container>
        <main className="pb-8 pt-16 sm:pt-24">
          <h1 className="mx-auto text-center text-6xl font-extrabold text-neutral-900 dark:text-white sm:text-7xl lg:text-8xl">
            Turborepo Boilerplate - Admin
            <span className="block bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text py-8 text-transparent">
              Turborepo Boilerplate
            </span>
          </h1>
          <div className="mx-auto mt-5 flex max-w-xl justify-center md:mt-8">
            <Button>Read the docs</Button>
          </div>
        </main>
      </Container>
    </>
  );
}
