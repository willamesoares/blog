import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="pt-[5.313rem] pb-20 px-[1.125rem] max-w-[768px] mx-auto tablet:pt-[7.313rem]">
      {children}
    </div>
  );
}
