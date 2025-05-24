"use client";
import Progress from "@/components/progress";
import { RadialChart } from "@/components/radial-chart";

export default function ScholarshipPage() {
  return (
    <div className="flex gap-4 px-4 py-10 ">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              University of Bristol UK Think Big Scholarship
            </h1>
            <p className="text-muted-foreground">
              Open for International Students. Available for Undergraduate and
              Postgraduate programs in all subjects at University of Bristol.
              Application deadline: 23 Apr 2025.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💲</span>
                <span>Partial Funding</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🏛️</span>
                <span>University of Bristol</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎓</span>
                <span>Undergraduate, Postgraduate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📚</span>
                <span>All Subjects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🌎</span>
                <span>International Students</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📍</span>
                <span>UK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                <span>04/23/2025</span>
              </div>
            </div>
            <RadialChart percentage={80} label="Match" />
          </div>
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Why Apply?</h2>
              <p>
                The Think Big Scholarship program is designed to attract the
                brightest minds from around the world. It offers financial
                support, reducing the burden of tuition fees, and opens doors to
                world-class education and networking opportunities. By securing
                this scholarship, you'll gain access to resources that can help
                shape your future.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">About the University</h2>
              <p>
                The University of Bristol, located in the vibrant city of
                Bristol, UK, is a prestigious, research-intensive institution
                known for its academic excellence and innovative contributions
                to global challenges. Founded in 1876, the university is
                consistently ranked among the top universities worldwide and is
                a member of the elite Russell Group.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Benefits</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Think Big undergraduate scholarships: £6,500 and £13,000 per
                  year
                </li>
                <li>
                  Think Big postgraduate scholarships: £6,500, £13,000 and
                  £26,000 per year
                </li>
                <li>
                  New Think Big Career Accelerator (2025): £3,000 scholarship
                  with bespoke employability programme
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Eligibility Criteria</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>English language proficiency required</li>
                <li>Open to international students of all nationalities</li>
                <li>Must be classified as an international student for fees</li>
                <li>
                  Must apply for full-time undergraduate/postgraduate program
                  for September 2024
                </li>
                <li>
                  Should not receive other financial support exceeding full
                  tuition
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Key Deadlines</h2>
              <div className="space-y-2">
                <p>
                  <strong>Undergraduate:</strong> 24 February 2025
                </p>
                <p>
                  <strong>Postgraduate:</strong> 23 April 2025
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Application Process</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Download and read the relevant guidance document</li>
                <li>Select and complete the appropriate application form</li>
                <li>
                  Prepare all documents before starting (forms cannot be saved)
                </li>
                <li>Submit application (no edits allowed after submission)</li>
                <li>Wait for email confirmation</li>
              </ol>
            </section>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold pb-5">Progress</p>
        <div className="pe-7">
          <Progress />
        </div>
      </div>
    </div>
  );
}
