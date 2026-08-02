import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Đăng nhập
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
        </p>
      </div>
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
