'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6" noValidate>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Đổi mật khẩu</CardTitle>
            <CardDescription>
              Bạn sẽ bị đăng xuất khỏi các thiết bị khác sau khi đổi mật khẩu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {(
              [
                { name: "oldPassword", label: "Mật khẩu cũ" },
                { name: "password", label: "Mật khẩu mới" },
                { name: "confirmPassword", label: "Nhập lại mật khẩu mới" },
              ] as const
            ).map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <Label>{item.label}</Label>
                    <Input type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end gap-2">
              <Button variant="outline">Hủy</Button>
              <Button variant="destructive">Cập nhật mật khẩu</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
