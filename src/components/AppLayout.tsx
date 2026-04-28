import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="pt-[4.5rem] pb-20 px-5 max-w-[768px] mx-auto tablet:pt-[5.5rem]">
      {children}
    </div>
  );
}
