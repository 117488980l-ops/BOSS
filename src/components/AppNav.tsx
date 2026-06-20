import Link from "next/link";

const items = [
  { href: "/", label: "首页" },
  { href: "/jobs", label: "岗位管理" },
  { href: "/resume-analysis", label: "简历分析" },
  { href: "/candidates", label: "候选人结果" }
];

export function AppNav() {
  return (
    <nav className="app-nav" aria-label="主导航">
      <div className="app-nav__inner">
        <Link href="/" className="app-nav__brand">
          ESSA HR
        </Link>
        <div className="app-nav__links">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="app-nav__link">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
