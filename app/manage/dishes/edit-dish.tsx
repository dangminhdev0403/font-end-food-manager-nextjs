"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import envConfig from "@/config/env.config";
import { useCrudForm } from "@/lib/hooks/useCrudForm";
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
  const dishQuery = productResource.useGetByIdQuery(id as number);
  const updateProductMutation = productResource.useUpdateMutation();
  const uploadMutation = useUploadImageMutation();

  const { form, file, setFile, imageInputRef } = useCrudForm<CreateDishBodyType>({
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
  const name = form.watch("name");

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
    if (file) return URL.createObjectURL(file);
    return image;
  }, [file, image]);

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
      onSubmitSuccess?.();
      toast({
        description: "Cập nhật món ăn thành công",
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
        if (!value) setId(undefined);
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết về món ăn
          </DialogDescription>
        </DialogHeader>

        {dishQuery.isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6" />
          </div>
        ) : (
          <>
            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid auto-rows-max gap-5"
                id="edit-dish-form"
              >
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Ảnh món ăn</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="size-28 rounded-md">
                          <AvatarImage
                            src={previewAvatarFromFile || "/placeholder.svg"}
                            alt={name || "Ảnh món ăn"}
                          />
                          <AvatarFallback className="rounded-md text-xs">
                            {name?.slice(0, 2).toUpperCase() || "—"}
                          </AvatarFallback>
                        </Avatar>

                        <input
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setFile(f);
                              field.onChange(
                                "http://localhost:3000/" + f.name,
                              );
                            }
                          }}
                          className="hidden"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          className="h-28 w-28 flex-col gap-1 border-dashed"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <Upload className="size-5" aria-hidden />
                          <span className="text-xs">Tải lên</span>
                        </Button>
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
                      <Label htmlFor="edit-name">Tên món ăn</Label>
                      <Input
                        id="edit-name"
                        className="h-11"
                        placeholder="Nhập tên món ăn..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="edit-base-price">Giá gốc</Label>
                        <Input
                          id="edit-base-price"
                          type="number"
                          inputMode="numeric"
                          className="h-11"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="virtualPrice"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="edit-virtual-price">Giá bán ra</Label>
                        <Input
                          id="edit-virtual-price"
                          type="number"
                          inputMode="numeric"
                          className="h-11"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="edit-description">Mô tả</Label>
                      <Textarea
                        id="edit-description"
                        rows={4}
                        className="resize-none"
                        placeholder="Mô tả chi tiết về món ăn..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <DialogFooter className="gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => setId(undefined)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                form="edit-dish-form"
                className="h-11"
                disabled={
                  updateProductMutation.isPending || uploadMutation.isPending
                }
                isLoading={
                  updateProductMutation.isPending || uploadMutation.isPending
                }
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
