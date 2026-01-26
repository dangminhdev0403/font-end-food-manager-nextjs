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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DishStatus, DishStatusValues } from "@/constants/types/auth.type";
import { getVietnameseDishStatus } from "@/lib/utils";
import {
  UpdateDishBody,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditDish({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      status: DishStatus.Unavailable,
    },
  });
  const image = form.watch("image");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto rounded-xl border-border bg-background">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl text-foreground">
            Cập Nhật Món Ăn
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Chỉnh sửa thông tin của món ăn. Các trường{" "}
            <span className="text-destructive font-semibold">*</span> là bắt
            buộc.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-6 py-6"
            id="edit-dish-form"
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-foreground font-semibold">
                      Ảnh Món Ăn{" "}
                      <span className="text-destructive font-semibold">*</span>
                    </Label>
                    <div className="flex gap-4 items-start justify-start pt-3">
                      <Avatar className="aspect-square w-[120px] h-[120px] rounded-lg object-cover border border-border shadow-sm">
                        <AvatarImage
                          src={previewAvatarFromFile || "/placeholder.svg"}
                        />
                        <AvatarFallback className="rounded-none bg-muted/50">
                          <div className="text-3xl">🍽️</div>
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
                        className="flex flex-col aspect-square w-[120px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary transition-all cursor-pointer"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground font-medium">
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
                      className="text-foreground font-semibold"
                    >
                      Tên Món Ăn <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      className="w-full mt-2 h-10 bg-background border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg"
                      placeholder="Nhập tên món ăn..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="price"
                      className="text-foreground font-semibold"
                    >
                      Giá (VNĐ)
                    </Label>
                    <Input
                      id="price"
                      className="w-full mt-2 h-10 bg-background border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg"
                      placeholder="0"
                      {...field}
                      type="number"
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
                      className="text-foreground font-semibold"
                    >
                      Mô Tả Sản Phẩm
                    </Label>
                    <Textarea
                      id="description"
                      className="w-full mt-2 bg-background border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-24 resize-none rounded-lg"
                      placeholder="Mô tả chi tiết về món ăn..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="status"
                      className="text-foreground font-semibold"
                    >
                      Trạng Thái
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full mt-2 h-10 bg-background border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DishStatusValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {getVietnameseDishStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="border-t border-border pt-6 mt-6">
          <Button
            type="submit"
            form="edit-dish-form"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-lg transition-all"
          >
            Lưu Thay Đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
