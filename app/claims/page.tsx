import Link from "next/link";
import Image from "next/image";

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
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

      <h1 className="text-4xl md:text-6xl font-bold text-[#012169] mb-12">Report an Impact</h1>
      <div className="flex flex-col space-y-6 w-full max-w-md">
        <Link href="/claims/research">
          <button className="w-full px-8 py-4 bg-[#012169] text-white rounded-lg shadow-lg hover:bg-[#012169]/90">
            Report a Canceled Grant
          </button>
        </Link>
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSegbovCG89rkpTNMjHqQNAQ1WZ4RaIlW9ih4BYcCV6yr8wrdA/viewform?usp=header">
          <button className="w-full px-8 py-4 bg-[#012169] text-white rounded-lg shadow-lg hover:bg-[#012169]/90">
            Report Other Impact (Faculty & Staff)
          </button>
        </Link>
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSe1phuR5045GkhKmMIiUAh2rihIDPlAoGSVIb2qH5tXKMIlzQ/viewform?usp=dialog">
          <button className="w-full px-8 py-4 bg-[#012169] text-white rounded-lg shadow-lg hover:bg-[#012169]/90">
            Report a Student Impact
          </button>
        </Link>
        <Link href="/faq">
          <button className="w-full px-8 py-4 bg-[#012169] text-white rounded-lg shadow-lg hover:bg-[#012169]/90">
            I want to get involved
          </button>
        </Link>

      </div>
    </div>
  );
}
