import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

export default function AgentHelp() {
  const { t } = useTranslation('agent');

  const faqs = [
    { q: t('help.faqs.onboardClient.q'), a: t('help.faqs.onboardClient.a') },
    { q: t('help.faqs.paymentMethods.q'), a: t('help.faqs.paymentMethods.a') },
    { q: t('help.faqs.commission.q'), a: t('help.faqs.commission.a') },
    { q: t('help.faqs.existingAccount.q'), a: t('help.faqs.existingAccount.a') },
  ];

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title={t('help.header.title')} />

      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <div className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-asra-red" />
            {t('help.contactSupport')}
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
              {t('help.whatsapp')}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">{t('help.faqTitle')}</h2>
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
