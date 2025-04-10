// components/shop/product-card.tsx
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/lib/models/products"; // Adjust path based on your structure

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/3d-view/${product._id.toString()}`}>
      <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-64 w-full bg-gray-100">
          <Image
            src={product.images[0][0] || "/placeholder.svg"} // Use designImage from MongoDB schema
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
          <div className="flex gap-1">
            {product.colors.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
