import Container from '@/components/container';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  return (
    <Container>
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Pricing Plans</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Basic Plan */}
          <div className="flex-1 border rounded-xl p-8 shadow-sm bg-white flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Basic</h3>
            <p className="text-4xl font-bold mb-2">
              $9<span className="text-base font-normal">/mo</span>
            </p>
            <ul className="mb-6 text-gray-600">
              <li>✔️ 1 User</li>
              <li>✔️ Basic Support</li>
              <li>✔️ 5 Projects</li>
            </ul>
            <Button>Choose Basic</Button>
          </div>
          {/* Pro Plan */}
          <div className="flex-1 border-2 border-blue-500 rounded-xl p-8 shadow-md bg-blue-50 flex flex-col items-center scale-105">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Pro</h3>
            <p className="text-4xl font-bold mb-2 text-blue-700">
              $29<span className="text-base font-normal">/mo</span>
            </p>
            <ul className="mb-6 text-gray-700">
              <li>✔️ 5 Users</li>
              <li>✔️ Priority Support</li>
              <li>✔️ Unlimited Projects</li>
            </ul>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Choose Pro
            </Button>
          </div>
          {/* Enterprise Plan */}
          <div className="flex-1 border rounded-xl p-8 shadow-sm bg-white flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-4xl font-bold mb-2">Custom</p>
            <ul className="mb-6 text-gray-600">
              <li>✔️ Unlimited Users</li>
              <li>✔️ Dedicated Support</li>
              <li>✔️ Custom Integrations</li>
            </ul>
            <Button>Contact Sales</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
