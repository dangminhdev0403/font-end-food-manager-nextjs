"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import envConfig from "@/config/env.config";
import { useCrudForm } from "@/lib/hooks/useCrudForm";
import { logger } from "@/lib/logger";
import { useUploadImageMutation } from "@/queries/useUpload";
import { productResource } from "@/resources/product.resource";
import {
  CreateDishBody,
  CreateDishBodyType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { Upload } from "lucide-react";
import { useEffect, useMemo } from "react";

export default function EditDish({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const dishQuery = productResource.useGetByIdQuery(id);
  const updateProductMutation = productResource.useUpdateMutation();
  const uploadMutation = useUploadImageMutation();

  const { form, file, setFile, imageInputRef, previewImage } =
    useCrudForm<CreateDishBodyType>({
      schema: CreateDishBody,
      defaultValues: {
        name: "",
        categoryId: Number.parseInt(envConfig.NEXT_PUBLIC_CATEGORY_ID),
        basePrice: 0,
        virtualPrice: 0,
        cookingInstructions: "",
        description: "",
        image: "",
      },
    });
  const image = form.watch("image");
  
  useEffect(() => {
    const dish = dishQuery?.data;
    if (!dish) return;

    form.reset({
      name: dish.name ?? "",
      image: dish.images?.[0] ?? "",
      description: dish.description ?? "",
      cookingInstructions: dish.cookingInstructions ?? "",
      categoryId: Number.parseInt(envConfig.NEXT_PUBLIC_CATEGORY_ID),
      basePrice: Number(dish.basePrice),
      virtualPrice: Number(dish.virtualPrice),
    });
  }, [dishQuery.data, form]);
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  if (dishQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data: UpdateDishBodyType) => {
    try {
      let imageId: number | undefined;

      if (file) {
        const uploadRes = await uploadMutation.mutateAsync(file);
        imageId = uploadRes.data.id;
      }

      await updateProductMutation.mutateAsync({
        id: id as number,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        virtualPrice: data.virtualPrice,
        ...(imageId && { imagesId: [imageId] }),
        translations: [
          {
            languageId: 1,
            name: data.name,
            description: data.description,
            cookingInstructions: data.cookingInstructions,
          },
        ],
      });

      form.reset();
      setFile(null);

      toast({
        description: "Cập nhật  món ăn  thành công",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Có lỗi xảy ra",
        variant: "error",
      });
      console.error(error);
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto rounded-2xl border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
        <DialogHeader className="border-b border-border/30 pb-6 space-y-2">
          <DialogTitle className="text-3xl font-bold text-foreground">
            Cập Nhật Món Ăn
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin chi tiết về món ăn
          </p>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid auto-rows-max items-start gap-6 py-6"
            id="edit-dish-form"
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-semibold text-foreground">
                      Ảnh Món Ăn
                    </Label>
                    <div className="flex gap-4 items-start justify-start pt-3">
                      <Avatar className="aspect-square w-32 h-32 rounded-xl object-cover border-2 border-border/40 shadow-lg">
                        <AvatarImage
                          src={previewAvatarFromFile || "/placeholder.svg"}
                        />
                        <AvatarFallback className="rounded-none bg-secondary">
                          <div className="text-4xl">🍽️</div>
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name,
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex flex-col aspect-square w-32 items-center justify-center rounded-xl border-2 border-dashed border-border/40 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer group"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-primary font-medium transition-colors">
                          Tải lên
                        </span>
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-foreground"
                    >
                      Tên Món Ăn
                    </Label>
                    <Input
                      id="name"
                      className="w-full mt-2 h-11 bg-secondary/50 border-border/50 placeholder:text-muted-foreground focus:bg-secondary focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                      placeholder="Nhập tên món ăn..."
                      {...field}
                    />
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <Label>Giá Gốc</Label>
                    <Input type="number" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="virtualPrice"
                render={({ field }) => (
                  <FormItem>
                    <Label>Giá bán ra</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-foreground"
                    >
                      Mô Tả Sản Phẩm
                    </Label>
                    <Textarea
                      id="description"
                      className="w-full mt-2 bg-secondary/50 border-border/50 placeholder:text-muted-foreground focus:bg-secondary focus:border-primary/50 focus:ring-primary/20 min-h-24 resize-none rounded-xl transition-all"
                      placeholder="Mô tả chi tiết về món ăn..."
                      {...field}
                    />
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="border-t border-border/30 pt-6 mt-6">
          <Button
            type="submit"
            form="edit-dish-form"
            disabled={
              updateProductMutation.isPending || uploadMutation.isPending
            }
            isLoading={
              updateProductMutation.isPending || uploadMutation.isPending
            }
            className="h-11 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 active:scale-95"
          >
            Lưu Thay Đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
