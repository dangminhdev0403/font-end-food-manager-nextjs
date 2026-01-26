import {
  Home,
  LayoutGrid,
  LineChart,
  Salad,
  ShieldCheck,
  ShoppingCart,
  UserCog,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
  },
  {
    title: "Quản lí Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
  },
  {
    title: "Quản lí Bàn ăn",
    Icon: LayoutGrid,
    href: "/manage/tables",
  },
  {
    title: "Quản lí Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
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
