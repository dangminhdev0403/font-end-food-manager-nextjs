import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { DefaultValues, FieldValues, Resolver, useForm } from "react-hook-form";
import { ZodType } from "zod";

export function useCrudForm<TForm extends FieldValues>({
  schema,
  defaultValues,
}: {
  schema: ZodType<TForm>;
  defaultValues: DefaultValues<TForm>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<TForm>({
    resolver: zodResolver(schema as any) as Resolver<TForm>,
    defaultValues,
  });

  const image = form.watch("image" as any);

  const previewImage = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return image;
  }, [file, image]);

  return {
    form,
    file,
    setFile,
    imageInputRef,
    previewImage,
  };
}
