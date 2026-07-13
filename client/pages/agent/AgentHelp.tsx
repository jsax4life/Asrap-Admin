import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

const faqs = [
  {
    q: 'How do I onboard a new client?',
    a: 'Go to "Onboard Clients" in the menu, choose whether they are a Listener, Artist, or Advertiser, fill in their details, select a subscription plan, and collect payment if applicable.',
  },
  {
    q: 'What payment methods can I accept?',
    a: 'You can record Cash, Mobile Money, Bank Transfer, or Card payments when setting up a subscription for a client.',
  },
  {
    q: 'How is my commission calculated?',
    a: 'You earn 10% commission on every paid subscription you help set up. View your earnings in the Transactions page.',
  },
  {
    q: 'What if a client already has an account?',
    a: 'Search for them in "My Clients". If they are not listed, contact Asrapa support to link an existing account to your agent profile.',
  },
];

export default function AgentHelp() {
  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title="Help & Support" />

      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <div className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-asra-red" />
            Contact Support
          </h2>
          <div className="space-y-3">
            <a href="tel:+2348000000000" className="flex items-center gap-3 text-asra-gray-6 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              +234 800 000 0000
            </a>
            <a href="mailto:agents@asrapa.com" className="flex items-center gap-3 text-asra-gray-6 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              agents@asrapa.com
            </a>
            <p className="flex items-center gap-3 text-asra-gray-6">
              <MessageCircle className="w-4 h-4" />
              WhatsApp support available Mon–Sat, 8am–6pm
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
                <p className="text-white font-medium mb-2">{faq.q}</p>
                <p className="text-asra-gray-6 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
