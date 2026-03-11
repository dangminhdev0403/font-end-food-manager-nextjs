"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
        <Button className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Thêm Món
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm Món Ăn</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <div className="flex gap-4">
                    <Avatar className="w-28 h-28">
                      <AvatarImage src={previewAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{name || "🍽️"}</AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      accept="image/*"
                      ref={imageInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFile(file);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex w-28 items-center justify-center border-2 border-dashed rounded-lg"
                    >
                      <Upload className="w-6 h-6" />
                    </button>
                  </div>
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Tên món</Label>
                  <Input {...field} />
                  <FormMessage />
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
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Mô tả</Label>
                  <Textarea {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  uploadMutation.isPending || createProductMutation.isPending
                }
                isLoading={
                  uploadMutation.isPending || createProductMutation.isPending
                }
              >
                Thêm Món
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
