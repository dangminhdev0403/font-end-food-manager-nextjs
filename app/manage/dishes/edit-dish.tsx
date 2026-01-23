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
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto bg-white">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <DialogTitle className="text-2xl text-slate-900">
            ✏️ Cập nhật món ăn
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            Chỉnh sửa thông tin của món ăn. Các trường{" "}
            <span className="text-red-500 font-semibold">*</span> là bắt buộc.
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
                    <Label className="text-slate-700 font-semibold">
                      Ảnh món ăn{" "}
                      <span className="text-red-500 font-semibold">*</span>
                    </Label>
                    <div className="flex gap-4 items-start justify-start pt-2">
                      <Avatar className="aspect-square w-[120px] h-[120px] rounded-lg object-cover border-2 border-slate-200 shadow-md">
                        <AvatarImage
                          src={previewAvatarFromFile || "/placeholder.svg"}
                        />
                        <AvatarFallback className="rounded-none bg-slate-100">
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
                        className="flex flex-col aspect-square w-[120px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-5 w-5 text-slate-600 mb-1" />
                        <span className="text-xs text-slate-600 font-medium">
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
                      className="text-slate-700 font-semibold"
                    >
                      Tên món ăn <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      className="w-full mt-2 bg-white border-slate-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
                      className="text-slate-700 font-semibold"
                    >
                      Giá (VNĐ)
                    </Label>
                    <Input
                      id="price"
                      className="w-full mt-2 bg-white border-slate-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
                      className="text-slate-700 font-semibold"
                    >
                      Mô tả sản phẩm
                    </Label>
                    <Textarea
                      id="description"
                      className="w-full mt-2 bg-white border-slate-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 min-h-24 resize-none"
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
                      className="text-slate-700 font-semibold"
                    >
                      Trạng thái
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full mt-2 bg-white border-slate-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500">
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
        <DialogFooter className="border-t border-slate-200 pt-6">
          <Button
            type="submit"
            form="edit-dish-form"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            💾 Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
