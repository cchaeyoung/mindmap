import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex w-170 items-center">
        <div className="flex flex-1 justify-center">
          <Image src="/not-found.svg" alt="" width={280} height={165} unoptimized priority />
        </div>
        <div className="flex flex-1 flex-col pl-10">
          <p className="text-primary/55 text-[11px] font-semibold tracking-[2.5px]">404</p>
          <p className="text-foreground mt-2 text-[15.5px] font-semibold">
            페이지를 찾을 수 없습니다
          </p>
          <p className="text-muted-foreground mt-1.5 text-[12.5px]">
            주소가 잘못됐거나 삭제된 페이지예요
          </p>
          <Link
            href="/"
            className="bg-primary/20 hover:bg-primary/30 text-primary mt-5 self-start rounded-[10px] px-5 py-2 text-[12.5px] font-semibold transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
