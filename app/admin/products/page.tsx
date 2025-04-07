// app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[][]; // 2D array: images[colorIndex][imageIndex]
  designImage: string;
  colors: string[];
  sizes: string[];
  category: string;
}

export default function ProductsAdminPage() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    colors: [""],
    sizes: [""],
    category: "",
    designImage: null as File | null,
    images: [[]] as (File | null)[][],
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    colors: [""],
    sizes: [""],
    category: "",
    designImage: null as File | null,
    images: [[]] as (File | null)[][],
  });

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        setRole(userData.role || "customer");
      } else {
        console.error("Failed to fetch user profile:", await res.json());
        setRole("customer");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setRole("customer");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);

  useEffect(() => {
    if (["admin", "superadmin"].includes(role ?? "")) {
      fetchProducts();
    }
  }, [role]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addForm.designImage ||
      addForm.images.some((row) => row.length === 0)
    ) {
      toast({
        title: "Error",
        description:
          "Please upload at least one image per color and a design image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("description", addForm.description);
    formData.append("price", addForm.price);
    formData.append("discount", addForm.discount);
    formData.append("colors", JSON.stringify(addForm.colors));
    formData.append("sizes", JSON.stringify(addForm.sizes));
    formData.append("category", addForm.category);
    formData.append("designImage", addForm.designImage);

    addForm.images.forEach((colorImages, colorIndex) => {
      colorImages.forEach((file, imgIndex) => {
        if (file) {
          formData.append(
            `images[${colorIndex}]`,
            file,
            `${addForm.colors[colorIndex]}-img${imgIndex}.png`,
          );
        }
      });
    });

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct.product]);
        toast({ title: "Success", description: "Product added successfully" });
        resetAddForm();
        setAddOpen(false);
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to add product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("productId", selectedProduct._id);
    formData.append("name", editForm.name);
    formData.append("description", editForm.description);
    formData.append("price", editForm.price);
    formData.append("discount", editForm.discount);
    formData.append("colors", JSON.stringify(editForm.colors));
    formData.append("sizes", JSON.stringify(editForm.sizes));
    formData.append("category", editForm.category);
    if (editForm.designImage)
      formData.append("designImage", editForm.designImage);

    editForm.images.forEach((colorImages, colorIndex) => {
      colorImages.forEach((file, imgIndex) => {
        if (file) {
          formData.append(
            `images[${colorIndex}]`,
            file,
            `${editForm.colors[colorIndex]}-img${imgIndex}.png`,
          );
        }
      });
    });

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts((prev) =>
          prev.map((p) =>
            p._id === updatedProduct.product._id ? updatedProduct.product : p,
          ),
        );
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        setEditOpen(false);
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct._id }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== selectedProduct._id),
        );
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        setDeleteOpen(false);
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAddForm = () => {
    setAddForm({
      name: "",
      description: "",
      price: "",
      discount: "",
      colors: [""],
      sizes: [""],
      category: "",
      designImage: null,
      images: [[]],
    });
  };

  const handleAddColor = () => {
    setAddForm((prev) => ({
      ...prev,
      colors: [...prev.colors, ""],
      images: [...prev.images, []],
    }));
  };

  const handleEditColor = () => {
    setEditForm((prev) => ({
      ...prev,
      colors: [...prev.colors, ""],
      images: [...prev.images, []],
    }));
  };

  const handleAddSize = () => {
    setAddForm((prev) => ({ ...prev, sizes: [...prev.sizes, ""] }));
  };

  const handleEditSize = () => {
    setEditForm((prev) => ({ ...prev, sizes: [...prev.sizes, ""] }));
  };

  const handleAddFieldChange =
    (field: keyof typeof addForm, index?: number) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (index !== undefined && (field === "colors" || field === "sizes")) {
        const newValues = [
          ...(field === "colors" ? addForm.colors : addForm.sizes),
        ];
        newValues[index] = e.target.value;
        setAddForm((prev) => ({ ...prev, [field]: newValues }));
      } else {
        setAddForm((prev) => ({ ...prev, [field]: e.target.value }));
      }
    };

  const handleEditFieldChange =
    (field: keyof typeof editForm, index?: number) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (index !== undefined && (field === "colors" || field === "sizes")) {
        const newValues = [
          ...(field === "colors" ? editForm.colors : editForm.sizes),
        ];
        newValues[index] = e.target.value;
        setEditForm((prev) => ({ ...prev, [field]: newValues }));
      } else {
        setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
      }
    };

  const handleAddImageChange = (colorIndex: number, files: FileList | null) => {
    const newImages = [...addForm.images];
    newImages[colorIndex] = files ? Array.from(files) : [];
    setAddForm((prev) => ({ ...prev, images: newImages }));
  };

  const handleEditImageChange = (
    colorIndex: number,
    files: FileList | null,
  ) => {
    const newImages = [...editForm.images];
    newImages[colorIndex] = files ? Array.from(files) : [];
    setEditForm((prev) => ({ ...prev, images: newImages }));
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount.toString(),
      colors: [...product.colors],
      sizes: [...product.sizes],
      category: product.category,
      designImage: null,
      images: product.colors.map(() => []), // Initialize images[][] to match colors[]
    });
    setEditOpen(true);
  };

  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }
  if (!session || !["admin", "superadmin"].includes(role ?? "")) {
    return (
      <div className="container mx-auto p-4 text-center">Unauthorized</div>
    );
  }

  return (
    <div className="animate-fade-in pt-20 bg-background min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6 sm:mb-8 flex-wrap">
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Product Management</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          Product Management
        </h1>

        {/* Add Product Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="mb-6">Add New Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={addForm.name}
                    onChange={handleAddFieldChange("name")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={addForm.description}
                    onChange={handleAddFieldChange("description")}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={addForm.price}
                      onChange={handleAddFieldChange("price")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (Optional)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={addForm.discount}
                      onChange={handleAddFieldChange("discount")}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={addForm.category}
                    onChange={handleAddFieldChange("category")}
                    required
                  />
                </div>
                <div>
                  <Label>Colors</Label>
                  {addForm.colors.map((color, index) => (
                    <div key={index} className="space-y-2 mb-4">
                      <Input
                        value={color}
                        onChange={handleAddFieldChange("colors", index)}
                        placeholder={`Color ${index + 1}`}
                        required
                      />
                      <div>
                        <Label htmlFor={`images-${index}`}>
                          Images for {color || `Color ${index + 1}`} (PNG)
                        </Label>
                        <Input
                          id={`images-${index}`}
                          type="file"
                          accept="image/png"
                          multiple
                          onChange={(e) =>
                            handleAddImageChange(index, e.target.files)
                          }
                          required={index === 0} // Require at least one image for first color
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddColor}
                  >
                    Add Color
                  </Button>
                </div>
                <div>
                  <Label>Sizes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {addForm.sizes.map((size, index) => (
                      <Input
                        key={index}
                        value={size}
                        onChange={handleAddFieldChange("sizes", index)}
                        placeholder={`Size ${index + 1}`}
                        required
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSize}
                    className="mt-2"
                  >
                    Add Size
                  </Button>
                </div>
                <div>
                  <Label htmlFor="designImage">Design Image (PNG)</Label>
                  <Input
                    id="designImage"
                    type="file"
                    accept="image/png"
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        designImage: e.target.files?.[0] || null,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={handleEditFieldChange("name")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={handleEditFieldChange("description")}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditFieldChange("price")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-discount">Discount (Optional)</Label>
                    <Input
                      id="edit-discount"
                      type="number"
                      value={editForm.discount}
                      onChange={handleEditFieldChange("discount")}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editForm.category}
                    onChange={handleEditFieldChange("category")}
                    required
                  />
                </div>
                <div>
                  <Label>Colors</Label>
                  {editForm.colors.map((color, index) => (
                    <div key={index} className="space-y-2 mb-4">
                      <Input
                        value={color}
                        onChange={handleEditFieldChange("colors", index)}
                        placeholder={`Color ${index + 1}`}
                        required
                      />
                      <div>
                        <Label htmlFor={`edit-images-${index}`}>
                          New Images for {color || `Color ${index + 1}`} (PNG,
                          Optional)
                        </Label>
                        <Input
                          id={`edit-images-${index}`}
                          type="file"
                          accept="image/png"
                          multiple
                          onChange={(e) =>
                            handleEditImageChange(index, e.target.files)
                          }
                        />
                        {/* Safely handle selectedProduct and images[index] */}
                        {selectedProduct &&
                          selectedProduct.images[index]?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">
                                Current Images:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.images[index].map(
                                  (img, imgIndex) => (
                                    <Image
                                      key={imgIndex}
                                      src={img}
                                      alt={`${color} image ${imgIndex + 1}`}
                                      width={50}
                                      height={50}
                                      className="object-cover rounded"
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEditColor}
                  >
                    Add Color
                  </Button>
                </div>{" "}
                <div>
                  <Label>Sizes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {editForm.sizes.map((size, index) => (
                      <Input
                        key={index}
                        value={size}
                        onChange={handleEditFieldChange("sizes", index)}
                        placeholder={`Size ${index + 1}`}
                        required
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEditSize}
                    className="mt-2"
                  >
                    Add Size
                  </Button>
                </div>
                <div>
                  <Label htmlFor="edit-designImage">
                    New Design Image (PNG, Optional)
                  </Label>
                  <Input
                    id="edit-designImage"
                    type="file"
                    accept="image/png"
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        designImage: e.target.files?.[0] || null,
                      }))
                    }
                  />
                  {selectedProduct?.designImage && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Current Design Image:
                      </p>
                      <Image
                        src={selectedProduct.designImage}
                        alt="Current design"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Product Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] sm:w-auto">Name</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Discount</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Design Image
                </TableHead>
                <TableHead className="hidden md:table-cell">Colors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium truncate max-w-[100px] sm:max-w-none">
                    {product.name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    ₹{product.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.discount}%
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Image
                      src={product.designImage}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[150px]">
                    {product.colors.join(", ")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
