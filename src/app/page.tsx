import {
  ChevronRight,
  ClipboardEdit,
  LayoutDashboard,
  ListChecks,
  CalendarCheck,
  UploadCloud,
  Send,
  Users,
  MessageSquareText,
  Goal,
  UsersRound,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";
import React from "react";

const Index = () => {
  const teamMembers = [
    {
      name: "Nafis",
      role: "Tech Lead",
      description: "Architecting the technology that powers our platform.",
      icon: <BrainCircuit className="w-8 h-8 text-cyan-500" />,
    },
    {
      name: "Pradeepta",
      role: "CEO",
      description: "Visionary leader driving ScholarMatch AI's mission.",
      icon: <Goal className="w-8 h-8 text-cyan-500" />,
    },
    {
      name: "Aria",
      role: "Marketing Lead",
      description: "Connecting students with ScholarMatch AI's opportunities.",
      icon: <UsersRound className="w-8 h-8 text-cyan-500" />,
    },
  ];

  const userJourneySteps = [
    {
      id: 1,
      title: "Profile Creation",
      description:
        "Sign up and tell us about your academic background, interests, and preferences. This helps us find scholarships tailored for you.",
      icon: <ClipboardEdit className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 2,
      title: "Personalized Scholarship Dashboard",
      description:
        "Access a dashboard showing matched scholarships, sorted by relevance and deadline. Save your preferred ones.",
      icon: <LayoutDashboard className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 3,
      title: "Select & Apply",
      description:
        "Choose scholarships and activate the Application Tracker. We'll guide you through each step.",
      icon: <ListChecks className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 4,
      title: "Calendar & To-Do Checklist",
      description:
        "Get an auto-generated calendar with deadlines and a to-do list for all required documents (transcripts, SOP, LORs, etc.).",
      icon: <CalendarCheck className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 5,
      title: "Document Upload & Progress Tracking",
      description:
        "Upload files directly, mark tasks as done, and watch your application progress. Receive reminders for pending items.",
      icon: <UploadCloud className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 6,
      title: "Final Review & Submission Support",
      description:
        "Our system checks for completeness. We offer guidance for submission and provide tools to package your application.",
      icon: <Send className="w-10 h-10 mb-4 text-blue-500" />,
    },
    {
      id: 7,
      title: "Mentoring & Guidance",
      description:
        "Post-submission, access mentorship sessions for interview prep, follow-up strategies, and connect with our community.",
      icon: <MessageSquareText className="w-10 h-10 mb-4 text-blue-500" />,
    },
  ];

  return (
    <div className="font-inter bg-slate-50 text-slate-800 min-h-screen">
      {/* Header/Nav - Removed */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-cyan-600">
                ScholarMatch
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#mission"
                className="text-slate-600 hover:text-cyan-600 transition-colors"
              >
                Mission
              </a>
              <a
                href="#how-it-works"
                className="text-slate-600 hover:text-cyan-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#team"
                className="text-slate-600 hover:text-cyan-600 transition-colors"
              >
                Team
              </a>
              <a
                href="#cta"
                className="text-slate-600 hover:text-cyan-600 transition-colors"
              >
                Get Started
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-cyan-600 font-medium rounded-lg hover:bg-cyan-50 transition-colors"
              >
                Login
              </a>
              <a
                href="/sign-up"
                className="px-4 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Updated to match the image reference */}
      <section className="pb-20 pt-40 px-40 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 px-4">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                ScholarMatch.
                <span className="text-gradient">AI</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-medium text-cyan-700 mb-6">
                Personalized Scholarship Pathways.
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                ScholarMatch AI creates a unified and accessible platform where
                every student can tell their unique story, seamlessly manage
                their application journey, and get a fair shot at scholarships
                that match their potential.
              </p>
              <p className="text-lg italic text-slate-600 mb-8 px-4 me-4">
                "To empower{" "}
                <span className="text-gradient font-bold">48,000</span> students
                each year by 2027 with the tools to find, apply for, and win
                scholarships."
              </p>
              <div className="flex flex-wrap items-center justify-center me-25 pt-5">
                <a
                  href="/login"
                  className="px-8 py-4 text-white font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <img
                src="/image.png"
                alt="ScholarMatch AI Platform"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 md:py-24 px-30 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-semibold uppercase text-cyan-600 tracking-wider mb-2">
            Our Commitment
          </h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Empowering Students, Achieving Dreams
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-12">
            "To empower{" "}
            <strong className="text-blue-600">48,000 students</strong> each year
            by <strong className="text-blue-600">2027</strong> with the tools to
            find, apply for, and win scholarships."
          </p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left p-6 bg-slate-100 rounded-xl shadow-lg">
              <Goal className="w-12 h-12 text-cyan-500 mb-4" />
              <h4 className="text-2xl font-semibold text-slate-800 mb-2">
                Our Vision
              </h4>
              <p className="text-slate-600">
                To create a unified and accessible platform where every student,
                regardless of background, can tell their unique story,
                seamlessly manage their application journey, and get a fair shot
                at scholarships that match their potential.
              </p>
            </div>
            <div className="text-left p-6 bg-slate-100 rounded-xl shadow-lg h-full">
              <Users className="w-12 h-12 text-blue-500 mb-4" />
              <h4 className="text-2xl font-semibold text-slate-800 mb-2">
                Our Mission
              </h4>
              <p className="text-slate-600">
                To empower 48,000 students each year by 2027 with the tools to
                find, apply for, and win scholarships, making higher education
                more accessible for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-25 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
            Your Journey with ScholarMatch AI
          </h2>
          <p className="text-lg text-slate-700 text-center max-w-2xl mx-auto mb-16">
            Follow these simple steps to navigate your scholarship application
            process with ease and confidence.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userJourneySteps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-4 rounded-full mb-6 inline-block">
                  {React.cloneElement(step.icon, {
                    className: "w-10 h-10 text-blue-600",
                  })}
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" className="py-16 px-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
            Expert Mentorship
          </h2>
          <p className="text-lg text-slate-700 text-center max-w-2xl mx-auto mb-16">
            Get personalized guidance from experienced professionals who
            understand the scholarship landscape
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <MessageSquare className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-800">
                1:1 Consultations
              </h4>
              <p className="text-slate-600 text-sm">
                Schedule personalized sessions with mentors to discuss your
                scholarship strategy and get expert advice tailored to your
                goals.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <ListChecks className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-800">
                Application Review
              </h4>
              <p className="text-slate-600 text-sm">
                Get detailed feedback on your scholarship applications, essays,
                and supporting materials from experienced professionals.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <CalendarCheck className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-800">
                Ongoing Support
              </h4>
              <p className="text-slate-600 text-sm">
                Receive continuous guidance throughout your scholarship journey,
                from search to submission to acceptance.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="/sign-up-mentor"
              className="inline-flex items-center px-6 py-3 text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
            >
              Get Started <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-slate-700 text-center max-w-2xl mx-auto mb-16">
            The passionate individuals dedicated to making your scholarship
            dreams a reality.
          </p>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="bg-slate-50 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mb-4 inline-block p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full">
                  {member.icon}
                </div>
                <h4 className="text-2xl font-semibold text-slate-800">
                  {member.name}
                </h4>
                <p className="text-cyan-600 font-medium mb-2">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 md:py-32 bg-gradient-to-r from-cyan-600 to-blue-600"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Scholarship?
          </h2>
          <p className="text-lg sm:text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
            Join ScholarMatch AI today and take the first step towards securing
            your future. Let us guide you.
          </p>
          <a
            href="#" // Replace with actual sign-up link
            className="px-10 py-5 text-cyan-600 bg-white font-bold rounded-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center text-lg"
          >
            Start Your Journey Now <ChevronRight className="ml-2 w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-800 text-slate-400 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} ScholarMatch AI. All rights
            reserved.
          </p>
          <p className="text-sm mt-1">
            Empowering students, one scholarship at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
