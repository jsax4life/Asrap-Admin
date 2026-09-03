import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

const faqs = [
  {
    q: 'Comment intégrer un nouveau client ?',
    a: 'Allez dans « Intégrer des clients » dans le menu, choisissez s\'il s\'agit d\'un auditeur, d\'un artiste ou d\'un annonceur, remplissez ses informations, sélectionnez un forfait d\'abonnement et encaissez le paiement si nécessaire.',
  },
  {
    q: 'Quels moyens de paiement puis-je accepter ?',
    a: 'Vous pouvez enregistrer des paiements en espèces, par Mobile Money, par virement bancaire ou par carte lors de la configuration d\'un abonnement pour un client.',
  },
  {
    q: 'Comment ma commission est-elle calculée ?',
    a: 'Vous gagnez 10 % de commission sur chaque abonnement payant que vous aidez à mettre en place. Consultez vos gains dans la page Transactions.',
  },
  {
    q: 'Que faire si un client a déjà un compte ?',
    a: 'Recherchez-le dans « Mes clients ». S\'il n\'apparaît pas, contactez le support Asrapa pour lier un compte existant à votre profil d\'agent.',
  },
];

export default function AgentHelp() {
  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title="Aide et assistance" />

      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <div className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-asra-red" />
            Contacter le support
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
              Support WhatsApp disponible du lundi au samedi, de 8h à 18h
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">Questions fréquentes</h2>
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
