import { Building2, Microscope, Heart, Handshake, TrendingUp, Globe, Users, Award, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

interface PartnershipProps {
  onNavigate: (page: string) => void;
}

export default function Partnership({ onNavigate }: PartnershipProps) {
  const [formData, setFormData] = useState({
    partnershipType: '',
    contactName: '',
    organization: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partnership inquiry:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="py-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Partner With Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Join forces with BioMath Core to revolutionize healthcare through AI innovation
            </p>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-500/30 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Business Development</h3>
                <p className="text-blue-100 mb-6">
                  Strategic partnerships, distribution, and market expansion opportunities
                </p>
                <ul className="space-y-3 text-blue-50">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Revenue sharing models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Co-marketing initiatives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Market access</span>
                  </li>
                </ul>
              </div>

              <div className="group bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-500/30 rounded-2xl p-8 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/20 transition-all transform hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                  <Microscope className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Scientists & Researchers</h3>
                <p className="text-orange-100 mb-6">
                  Collaborate on cutting-edge AI health research and clinical validation
                </p>
                <ul className="space-y-3 text-orange-50">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                    <span>Data access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                    <span>Publication opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                    <span>Collaborative research</span>
                  </li>
                </ul>
              </div>

              <div className="group bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-500/30 rounded-2xl p-8 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Healthcare Professionals</h3>
                <p className="text-green-100 mb-6">
                  Integrate our platform into your practice and improve patient outcomes
                </p>
                <ul className="space-y-3 text-green-50">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Practice integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Training & support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Patient monitoring tools</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <img
                src="/Screenshot 2025-10-21 at 08.40.56.png"
                alt="Partnership Opportunities"
                className="w-full h-auto"
              />
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Partner With BioMath Core?</h2>
              <p className="text-xl text-gray-400">Join a growing ecosystem of health innovation leaders</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-2 border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">Growing Market</h3>
                <p className="text-sm text-cyan-100">$350B+ digital health market opportunity</p>
              </div>

              <div className="group bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-2 border-amber-500/30 rounded-xl p-6 text-center hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">Global Reach</h3>
                <p className="text-sm text-amber-100">Expand your impact worldwide</p>
              </div>

              <div className="group bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-2 border-emerald-500/30 rounded-xl p-6 text-center hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-emerald-500/50 transition-shadow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">User Base</h3>
                <p className="text-sm text-emerald-100">Access to engaged health-conscious users</p>
              </div>

              <div className="group bg-gradient-to-br from-rose-900/40 to-rose-800/20 border-2 border-rose-500/30 rounded-xl p-6 text-center hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/20 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">Innovation Leader</h3>
                <p className="text-sm text-rose-100">Cutting-edge AI health technology</p>
              </div>
            </div>
          </section>


          <section className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h2>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="mb-6">
                <label className="block text-white mb-3 font-medium">Partnership Type</label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select partnership type</option>
                  <option value="business">Business Development</option>
                  <option value="research">Research & Science</option>
                  <option value="healthcare">Healthcare Professional</option>
                  <option value="technology">Technology Integration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-3 font-medium">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Company/Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-3 font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-white mb-3 font-medium">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.02]"
              >
                Submit Inquiry
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400 mb-2">Or reach us directly</p>
              <p className="text-white font-medium">partnerships@biomathcore.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
