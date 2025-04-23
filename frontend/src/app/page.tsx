import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui";

export default function HomePage() {
  return (
    <div className="space-y-5 text-center">
      <h1 className="text-4xl font-bold">Todo List</h1>
      <div className="flex justify-center gap-4">
        <Link href="/auth/login" className={buttonVariants()}>
          Login
        </Link>
        <Link
          href="/auth/register"
          className={buttonVariants({ variant: "outline" })}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
