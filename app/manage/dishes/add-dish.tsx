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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import envConfig from "@/config/env.config";
import { useCrudForm } from "@/lib/hooks/useCrudForm";
import { useUploadImageMutation } from "@/queries/useUpload";
import { productResource } from "@/resources/product.resource";
import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useState } from "react";

export default function AddDish() {
  const uploadMutation = useUploadImageMutation();
  const { toast } = useToast();
  const createProductMutation = productResource.useCreateMutation();
  const [open, setOpen] = useState(false);
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

  const name = form.watch("name");
  const image = form.watch("image");

  const previewAvatar = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return image;
  }, [file, image]);

  const onSubmit = async (data: CreateDishBodyType) => {
    try {
      let imageId: number | undefined;

      if (file) {
        const uploadRes = await uploadMutation.mutateAsync(file);
        imageId = uploadRes.data.id;
      }

      await createProductMutation.mutateAsync({
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        virtualPrice: data.virtualPrice,
        imagesId: imageId ? [imageId] : [],
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
      setOpen(false);
      toast({
        description: "Tạo mới thành công",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 gap-2">
          <PlusCircle className="size-4" aria-hidden />
          Thêm món
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
          <DialogDescription>
            Nhập thông tin món ăn mới và lưu lại.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5"
            id="add-dish-form"
            noValidate
          >
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <Label>Ảnh món ăn</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-24 rounded-md">
                      <AvatarImage
                        src={previewAvatar || "/placeholder.svg"}
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
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                      }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="h-24 w-24 flex-col gap-1 border-dashed"
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
                  <Label htmlFor="dish-name">Tên món</Label>
                  <Input id="dish-name" className="h-11" {...field} />
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
                    <Label htmlFor="base-price">Giá gốc</Label>
                    <Input
                      id="base-price"
                      type="number"
                      inputMode="numeric"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Label htmlFor="virtual-price">Giá bán ra</Label>
                    <Input
                      id="virtual-price"
                      type="number"
                      inputMode="numeric"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <Label htmlFor="dish-description">Mô tả</Label>
                  <Textarea
                    id="dish-description"
                    rows={4}
                    className="resize-none"
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
            onClick={() => setOpen(false)}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            form="add-dish-form"
            className="h-11"
            disabled={
              uploadMutation.isPending || createProductMutation.isPending
            }
            isLoading={
              uploadMutation.isPending || createProductMutation.isPending
            }
          >
            Thêm món
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
