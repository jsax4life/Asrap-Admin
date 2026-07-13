import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SUBSCRIPTION_PLANS } from '@/constants';
import { agentService } from '@/services/agentService';
import { ClientType, OnboardingFormData, SubscriptionPlan } from '@/types';

interface OnboardClientFormProps {
  clientType: ClientType;
  title: string;
  subtitle: string;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
] as const;

export function OnboardClientForm({ clientType, title, subtitle }: OnboardClientFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OnboardingFormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    clientType,
    subscriptionPlan: undefined,
    paymentMethod: 'mobile_money',
    notes: '',
    stageName: '',
    genre: '',
    companyName: '',
    businessType: '',
  });

  const availablePlans = Object.entries(SUBSCRIPTION_PLANS).filter(([, plan]) =>
    plan.clientTypes.includes(clientType)
  );

  const update = (field: keyof OnboardingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedPlan = form.subscriptionPlan ? SUBSCRIPTION_PLANS[form.subscriptionPlan] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (clientType === 'artist' && !form.stageName) {
      toast.error('Stage name is required for artists');
      return;
    }
    if (clientType === 'advertiser' && !form.companyName) {
      toast.error('Company name is required for advertisers');
      return;
    }

    setLoading(true);
    try {
      await agentService.onboardClient(form);
      toast.success(`${title} onboarded successfully!`);
      navigate('/agent/clients');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to onboard client. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title={title} />

      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/agent/onboarding')}
          className="text-asra-red hover:text-red-400 text-sm font-medium mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to onboarding options
        </button>

        <p className="text-asra-gray-6 mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 space-y-4">
            <h3 className="text-white font-bold">Personal Information</h3>

            <div className="space-y-2">
              <Label className="text-white">Full Name *</Label>
              <Input
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Enter client's full name"
                className="bg-asra-gray-2 border-asra-gray-5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="email@example.com"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Phone Number *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update('dateOfBirth', e.target.value)}
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Location / City</Label>
                <Input
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g. Lagos, Abuja"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
            </div>
          </section>

          {clientType === 'artist' && (
            <section className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 space-y-4">
              <h3 className="text-white font-bold">Artist Details</h3>
              <div className="space-y-2">
                <Label className="text-white">Stage Name *</Label>
                <Input
                  value={form.stageName}
                  onChange={(e) => update('stageName', e.target.value)}
                  placeholder="Artist or band name"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Genre</Label>
                <Input
                  value={form.genre}
                  onChange={(e) => update('genre', e.target.value)}
                  placeholder="e.g. Afrobeats, Hip-Hop"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
            </section>
          )}

          {clientType === 'advertiser' && (
            <section className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 space-y-4">
              <h3 className="text-white font-bold">Business Details</h3>
              <div className="space-y-2">
                <Label className="text-white">Company Name *</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="Business or brand name"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Business Type</Label>
                <Input
                  value={form.businessType}
                  onChange={(e) => update('businessType', e.target.value)}
                  placeholder="e.g. Restaurant, Retail, Events"
                  className="bg-asra-gray-2 border-asra-gray-5 text-white"
                />
              </div>
            </section>
          )}

          <section className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 space-y-4">
            <h3 className="text-white font-bold">Subscription Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePlans.map(([key, plan]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update('subscriptionPlan', key as SubscriptionPlan)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    form.subscriptionPlan === key
                      ? 'border-asra-red bg-asra-red/10'
                      : 'border-asra-gray-2 hover:border-asra-gray-5'
                  }`}
                >
                  <p className="text-white font-medium">{plan.label}</p>
                  <p className="text-asra-gray-6 text-sm">
                    {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}/month`}
                  </p>
                </button>
              ))}
            </div>

            {selectedPlan && selectedPlan.price > 0 && (
              <div className="space-y-2">
                <Label className="text-white">Payment Method</Label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => update('paymentMethod', e.target.value)}
                  className="w-full bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 space-y-4">
            <h3 className="text-white font-bold">Notes (optional)</h3>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Any additional notes about this client..."
              rows={3}
              className="w-full bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 resize-none"
            />
          </section>

          {selectedPlan && selectedPlan.price > 0 && (
            <div className="bg-asra-gray-1 rounded-lg p-4 border border-asra-red/30 flex justify-between items-center">
              <span className="text-asra-gray-6">Total to collect</span>
              <span className="text-white text-xl font-bold">₦{selectedPlan.price.toLocaleString()}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-asra-red hover:bg-asra-red/90 text-white py-6 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete Onboarding`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}