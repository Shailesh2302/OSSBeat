import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Gradient } from "@repo/ui/gradient";
import { TurborepoLogo } from "@repo/ui/turborepo-logo";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <button>
        <Link href={"repo/discover"}>go to repo page</Link>
      </button>
    </main>
  );
}
