import { DishStatusValues } from "@/constants/types/auth.type";
import z from "zod";

export const CreateDishBody = z
  .object({
    name: z.string().min(2),

    categoryId: z.coerce.number(),

    basePrice: z.coerce.number(),

    virtualPrice: z.coerce.number().optional(),

    cookingInstructions: z.string().optional(),

    description: z.string().optional(),

    image: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    virtualPrice: data.virtualPrice ?? data.basePrice,
  }));

export type CreateDishBodyType = z.infer<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DishRes = z.object({
  data: DishSchema,
  message: z.string(),
});

export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string(),
});

export type DishListResType = z.TypeOf<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;
export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
