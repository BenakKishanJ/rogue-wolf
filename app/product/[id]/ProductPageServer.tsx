// app/product/[id]/ProductPageServer.tsx
import { getProductById, getRelatedProducts } from "@/lib/data";
import ProductPage from "./ProductPage";

interface ProductPageServerProps {
  params: {
    id: string;
  };
}

export default async function ProductPageServer({
  params,
}: ProductPageServerProps) {
  const product = await getProductById(params.id);
  const relatedProducts = await getRelatedProducts(params.id);

  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}
