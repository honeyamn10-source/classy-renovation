import Image from 'next/image';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(215,154,18,0.2),_transparent_28%),linear-gradient(180deg,#11100d_0%,#1a1713_100%)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="space-y-8">
          <Image src="/brand-logo.svg" alt="Classy Renovations" width={320} height={88} priority />
          <div className="space-y-4 max-w-2xl">
            <p className="inline-flex rounded-full border border-gold-300/40 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200">
              Classy Renovations Inc
            </p>
            <h1 className="font-serif text-5xl leading-none text-white lg:text-7xl">AI bookkeeping built for renovation operators.</h1>
            <p className="max-w-xl text-lg leading-8 text-ink-200">
              Capture receipts, extract line items, assign the right partner and card, and keep monthly reporting, tax, and spending analytics current in one place.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-ink-200 sm:grid-cols-3">
            {['PIN login', 'Receipt OCR', 'Card analytics'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
