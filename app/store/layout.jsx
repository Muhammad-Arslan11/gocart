import StoreLayout from "@/components/store/StoreLayout";
import { Show } from "@clerk/nextjs";

export const metadata = {
  title: "GoCart. - Store Dashboard",
  description: "GoCart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <Show show="when-signed-in">
        <StoreLayout>{children}</StoreLayout>
      </Show>
      <Show when="signed-out">
        <div className="min-h-screen flex items-center justify-center">
          User not authorized to visit this page.
        </div>
      </Show>
    </>
  );
}
