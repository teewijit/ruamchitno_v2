import {
  LucideIcon,
  UsersIcon,
  UserCog,
  SchoolIcon,
  Layers2Icon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "ข้อมูลพื้นฐาน",
      menus: [
        {
          href: "/youth",
          label: "เยาวชน",
          icon: UsersIcon,
        },
        {
          href: "/school",
          label: "โรงเรียน",
          icon: SchoolIcon,
        },
        {
          href: "",
          label: "กองทุน",
          icon: Layers2Icon,
          submenus: [
            {
              href: "/posts",
              label: "กองทุนถาวร"
            },
            {
              href: "/posts/new",
              label: "กองทุนรายปี"
            }
          ]
        },
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/user",
          label: "ผู้ใช้งาน",
          icon: UserCog,
        },
      ]
    }
  ];
}
