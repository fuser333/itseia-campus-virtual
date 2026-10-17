import DemoSidebar from "./_components/DemoSidebar";

export default function DemoAulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoSidebar>{children}</DemoSidebar>;
}
