"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useAccountProfileQuery } from "@/queries/useAccount";
import { useLogoutMutation } from "@/queries/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { data } = useAccountProfileQuery();
  const profile = data?.data;

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
      toast({
        description: "Đăng xuất thành công",
        variant: "success",
      });
    } catch (error) {
      router.push("/");

      console.log(error);

      toast({
        description: "Đăng xuất thành công",
        variant: "success",
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={profile?.avatar ?? undefined}
              alt={profile?.name}
            />
            <AvatarFallback>
              {profile?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>{profile?.name}</DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Hỗ trợ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
