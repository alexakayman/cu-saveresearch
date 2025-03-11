"use server";

import FaqWrapper from "../components/FaqWrapper";
import Image from "next/image";

export default async function FaqSectionDemo() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
        <Image
          src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/columbia-university-john-stoeckley.jpg"
          alt="Campus background"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover object-top opacity-20"
        />
      </div>
      <FaqWrapper />
    </div>
  );
}
