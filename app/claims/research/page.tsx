import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import UnclaimedResearchClient from "@/app/components/UnclaimedResearchClient";

interface ResearchData {
  awardNumber: string;
  researchName: string;
  impactArea: string;
  amount: number;
  principal_investigator: string;
  pi_email_address: string;
  award_instrument: string;
}

async function getInitialData() {
  const { data, count, error } = await supabase
    .from("research")
    .select(
      `
      award_number,
      title,
      awarded_amount_to_date,
      principal_investigator,
      pi_email_address,
      award_instrument
    `,
      { count: "exact" }
    )
    .range(0, 24)
    .order("award_number", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch research data");
  }

  const formattedData: ResearchData[] = data.map((item) => ({
    awardNumber: item.award_number,
    researchName: item.title,
    impactArea: "Environment",
    amount: item.awarded_amount_to_date || 0,
    principal_investigator: item.principal_investigator || "",
    pi_email_address: item.pi_email_address || "",
    award_instrument: item.award_instrument || "",
  }));

  return {
    data: formattedData,
    totalCount: count || 0,
  };
}

export default async function Home() {
  const { data: initialData, totalCount } = await getInitialData();

  return (
    <div className="min-h-screen flex flex-col">
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

      {/* Header */}
      <header className="py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#012169] text-xl font-bold">
            Accelerate Columbia
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#012169] mb-6">
              Claim and save your research.
            </h1>
            <p className="text-[#012169]/70 max-w-3xl mx-auto text-lg">
              Calling PIs. Has your grant been cancelled? Claim your research and add critical needs here.
            </p>
          </div>

          <UnclaimedResearchClient
            initialData={initialData}
            initialTotalCount={totalCount}
          />
        </div>
      </main>
    </div>
  );
}
