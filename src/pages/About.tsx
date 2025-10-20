import { Target, MapPin, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-orange-500 mb-3 tracking-wide uppercase">
              MISSION-DRIVEN INNOVATION
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-blue-400">BioMath</span> Core
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Digital health and biomath analytics platform engineered for precision, transparency,
              and human-centered intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
                </div>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  We build trustworthy, practical wellness intelligence at the intersection of{' '}
                  <span className="font-bold text-white">biomathematics</span>,{' '}
                  <span className="font-bold text-white">computational biology</span>, and{' '}
                  <span className="font-bold text-white">AI</span>. BioMath Core helps people and professionals navigate complex health questions with precise, explainable guidance — focused on prevention, wellness, and long-term resilience.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <MapPin className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Our Founder</h2>
                </div>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  <span className="font-bold text-white">Michael Kofman</span> is a visionary technology entrepreneur and creator of BioMath Core — a platform uniting advanced analytics, AI, and human health.
                </p>
                <p>
                  Through <span className="text-blue-400 font-semibold">Digital Invest Inc.</span> and{' '}
                  <span className="text-blue-400 font-semibold">BioMath Life</span>, he turns rigorous science into usable systems that scale.
                </p>
                <p>
                  Recognized by <span className="text-orange-500 font-semibold">Healthcare Tech Outlook</span>.{' '}
                  <a href="#" className="text-orange-500 hover:text-orange-400 underline transition-colors">
                    Read the interview →
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gray-900/30 backdrop-blur border border-gray-800 rounded-xl p-8">
            <p className="text-gray-300 text-lg">
              Our platform spans{' '}
              <span className="font-bold text-white">20 categories with 180+ services</span>{' '}
              (and growing). We expand only when the signal is strong — based on real user needs and evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Our Team</h2>
          </div>

          <div className="space-y-6 text-gray-300">
            <p>
              We began our journey in <span className="font-bold text-white">2008</span>, working in digital healthcare and biomathematical modeling across different countries worldwide. Over these years, we have gained{' '}
              <span className="font-bold text-white">tremendous practical experience</span>, deep understanding of user needs, and expertise in integrating science, technology, and human health.
            </p>

            <p>
              By studying real people's needs — from patients to clinicians, from families to corporate programs — we arrived at{' '}
              <span className="font-bold text-white">today's understanding</span> of what is truly necessary for preventive medicine, wellness management, and long-term health. This understanding became the foundation of our{' '}
              <span className="font-bold text-white">Human Data Model</span>, which forms the core of the BioMath Core platform.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 my-6">
              <p className="text-gray-300">
                <span className="font-bold text-white">BioMath Core Platform</span> is not just a set of tools. It is a{' '}
                <span className="font-bold text-white">living ecosystem</span> capable of incorporating multiple services, implementing innovations, and leveraging achievements from various sciences — from biomathematics and epidemiology to machine learning and behavioral psychology —{' '}
                <span className="font-bold text-white">for the benefit of users</span>.
              </p>
            </div>

            <p>
              We continuously work on <span className="font-bold text-white">platform improvement</span>: enhancing model accuracy, expanding health category coverage, increasing algorithm transparency, and deepening personalization. We have{' '}
              <span className="font-bold text-white">big plans</span> — from integrating advanced wearable devices to implementing genomic analytics and predictive horizons.
            </p>

            <p>
              We are <span className="font-bold text-white">full of energy and enthusiasm</span>, passionate about our work, and convinced of its value. This endeavor has been shaped by years of applied experience, hundreds of consultations with users and professionals, thousands of hours of research and development.
            </p>

            <div className="border-l-4 border-orange-500 pl-6 py-2 my-6">
              <p className="text-gray-300">
                Throughout our journey, we have assembled and collaborated with{' '}
                <span className="font-bold text-white">talented specialists</span> — engineers, biomathematicians, clinicians, data analysts, designers, and researchers — who share our vision,{' '}
                <span className="font-bold text-white">goals, and plans</span>.
              </p>
            </div>

            <p>
              Today, we are <span className="font-bold text-white">one large team of passionate professionals</span>, experts in our field, committed to innovation and ready for{' '}
              <span className="font-bold text-white">a great path of development</span>. We are building the future of digital healthcare — transparent, human-centered, and science-based.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
