import { Copy, Mail, Share2, Users, DollarSign, Check } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

interface ReferralProps {
  onNavigate: (page: string) => void;
}

export default function Referral({ onNavigate }: ReferralProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const referralCode = 'BIOMATH-USER123';
  const referralLink = `https://biomathcore.com/signup?ref=${referralCode}`;

  const stats = {
    totalReferred: 8,
    creditsEarned: 80,
    activeReferrals: 6
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setEmail('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent('Discover BioMath Core - a gentle wellness platform that helps you understand your body. Join me and get $5 off!');
    const url = encodeURIComponent(referralLink);

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Health, Earn Rewards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Invite friends to BioMath Core and earn credits with every successful referral
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Referred</h3>
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalReferred}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits Earned</h3>
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.creditsEarned}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Referrals</h3>
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeReferrals}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Share your unique code</p>
                    <p className="text-sm text-blue-100">Send it to friends via email or social media</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Friend gets $5 discount</p>
                    <p className="text-sm text-blue-100">Applied instantly at signup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">You earn $10 credit</p>
                    <p className="text-sm text-blue-100">Added instantly after confirmed signup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Reward Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>You earn per referral:</span>
                  <span className="font-bold">$10</span>
                </div>
                <div className="flex justify-between">
                  <span>Friend gets discount:</span>
                  <span className="font-bold">$5</span>
                </div>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <p className="text-blue-100">• No limits on referrals</p>
                  <p className="text-blue-100">• Credits never expire</p>
                  <p className="text-blue-100">• Use for subscriptions & upgrades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Referral Code</h2>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your permanent code:</p>
                <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{referralCode}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share link:</p>
              <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{referralLink}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Invitation via Email</h3>
            <form onSubmit={handleSendInvite} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Friend's email address"
                required
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Send</span>
              </button>
            </form>
            {showSuccess && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>Invitation sent successfully!</span>
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share on Social Media</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
              >
                <Share2 className="h-5 w-5" />
                <span>X</span>
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Program Details</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Eligibility</h3>
              <ul className="space-y-1">
                <li>• Friend must be a new user</li>
                <li>• Code must be entered during signup</li>
                <li>• Only one referral code per account</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fraud Protection</h3>
              <ul className="space-y-1">
                <li>• No self-referrals allowed</li>
                <li>• No duplicate accounts</li>
                <li>• Abusive behavior voids rewards</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <span className="font-medium text-gray-900 dark:text-white">Refer 10+ friends?</span> You may qualify for our{' '}
              <button
                onClick={() => onNavigate('ambassador')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Ambassador Program
              </button>
              {' '}with enhanced rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
