import Link from "next/link";
import Image from "next/image";
import AddResearchForm from "../../components/AddResearchForm";

export default function AddPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      {/* Background Image */}
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

      <h1 className="text-4xl md:text-6xl font-bold text-[#012169] mb-12">
        Add Your Research
      </h1>

      <AddResearchForm />
    </div>
  );
}
