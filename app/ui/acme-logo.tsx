import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/golden-bird-logo-design.png"
        className="h-36 w-36"
        alt={"profile picture"}
        width={100}
        height={100}
      />
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <p className="text-[44px] text-blue-800">Our Company</p>
    </div>
  );
}
