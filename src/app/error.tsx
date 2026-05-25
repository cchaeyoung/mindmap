'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Image src="/error-cloud.svg" alt="" width={190} height={139} unoptimized />
        <div className="mt-7 flex flex-col items-center gap-2 text-center">
          <p className="text-foreground text-[15.5px] font-semibold">오류가 발생했어요</p>
          <p className="text-muted-foreground text-[12.5px]">잠시 후 다시 시도해 주세요</p>
        </div>
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={reset}
            className="bg-primary/20 hover:bg-primary/30 text-primary w-26 cursor-pointer justify-center rounded-[10px] py-2 text-[12.5px] font-semibold transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="border-border hover:bg-accent text-muted-foreground hover:text-foreground flex w-26 items-center justify-center rounded-[10px] border py-2 text-[12.5px] font-semibold transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
