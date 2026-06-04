'use client';

import Image from 'next/image';

type Props = {
  variantId: string;
  storeDomain: string;
  checkoutUrl: string;
};

export default function ExpressCheckout({ checkoutUrl }: Props) {

  return (
    <div className="flex flex-col gap-3">
      {/* Shop Pay */}
      <a href={checkoutUrl} className="block w-full h-12">
        <Image
          src="/Branding/buy-with-shop-button.svg"
          alt="Buy with Shop Pay"
          width={1088}
          height={128}
          className="w-full h-full object-cover"
        />
      </a>

    </div>
  );
}
