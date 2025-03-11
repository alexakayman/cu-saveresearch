"use client";

import { FaqSection } from "../../components/ui/faq";

const DEMO_FAQS = [
  {
    question: "Why was this initiative established?",
    answer:
      "This initiative was established in direct response to the Trump administration's $400 million funding reduction to Columbia University, which has severely impacted ongoing research programs. This abrupt cessation of funding has jeopardized critical scientific investigations and forced hundreds of leading researchers from around the world, including those from China and Israel, to consider returning to their home countries, resulting in a significant loss of intellectual capital and research momentum.",
  },
  {
    question: "How will financial contributions be managed?",
    answer:
      "Financial contributions will be meticulously documented through comprehensive pledge ledgers and administered in close coordination with Columbia University's endowment management team. This systematic approach ensures transparent fiscal oversight and appropriate allocation of funds to maintain essential research programs.",
  },
  {
    question: "Who are the founders of this initiative?",
    answer:
      "This initiative was founded by Alexa Kayman, Alex Denuzzo, and Joseph Jojoe, three undergraduate students at Columbia University. Their collective determination stems from a profound commitment to ensuring that their institution can continue its tradition of advancing scientific knowledge and innovation despite funding challenges.",
  },
  {
    question: "What is the National Institutes of Health (NIH)?",
    answer:
      "The National Institutes of Health (NIH) is the primary federal agency responsible for biomedical and public health research in the United States. As a component of the Department of Health and Human Services, the NIH administers substantial research grants to universities and research institutions, making it a vital funding source for groundbreaking medical and scientific discoveries that improve health outcomes nationwide.",
  },
  {
    question: "What is the National Science Foundation (NSF)?",
    answer:
      "The National Science Foundation (NSF) is an independent federal agency created to promote scientific progress across disciplines. The NSF supports fundamental research and education in all non-medical fields of science and engineering, functioning as a critical funding mechanism for university research programs in areas ranging from mathematics and computer science to environmental science and social sciences.",
  },
  {
    question: "How will this initiative ensure research continuity?",
    answer:
      "This initiative will ensure research continuity through strategic redistribution of funds to prioritize projects facing imminent termination, implementation of collaborative resource-sharing mechanisms among research departments, and establishment of contingency funding pathways designed to bridge gaps until federal funding stability returns or alternative long-term funding sources are secured.",
  },
  {
    question:
      "What specific research domains are most affected by the funding cuts?",
    answer:
      "The funding reductions have disproportionately affected high-impact research domains including climate science, emerging infectious disease preparedness, renewable energy technologies, and international collaborative projects. These areas represent crucial frontiers of scientific inquiry with significant implications for global challenges and technological advancement.",
  },
];

export default function FaqWrapper() {
  const handleContact = () => {
    window.location.href = "mailto:alexa.kayman@columbia.edu";
  };

  return (
    <FaqSection
      title="Frequently Asked Questions"
      description="Everything you need to know about our platform"
      items={DEMO_FAQS}
      contactInfo={{
        title: "Still have questions or want to collaborate?",
        description: "We're here to help you",
        buttonText: "Contact Us",
        onContact: handleContact,
      }}
    />
  );
}
