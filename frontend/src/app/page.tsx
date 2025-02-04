import Layout from "@/components/Layout";
import { NoLogged } from "@/components/NoLogged";
import { ProductListContainer } from "@/domains/products/components/ui/ProductList/ProductListContainer";
import { currentUser, SignInButton, } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return <NoLogged />

  return (
    <Layout>
      <ProductListContainer />
    </Layout>
  );
}
