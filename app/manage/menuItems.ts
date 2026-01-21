import {
  Home,
  LineChart,
  Salad,
  ShieldCheck,
  ShoppingCart,
  Table,
  UserCog,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
  },

  {
    title: "Quản lí người dùng",
    Icon: UserCog,
    href: "/manage/users-roles",
  },
  {
    title: "Phân quyền",
    Icon: ShieldCheck,
    href: "/manage/roles-permissions",
  },
];

export default menuItems;
