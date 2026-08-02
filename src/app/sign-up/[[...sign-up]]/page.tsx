import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Đăng ký
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Tạo tài khoản mới để bắt đầu sử dụng ứng dụng.
        </p>
      </div>
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        routing="path"
        path="/sign-up"
      />
    </div>
  );
}
