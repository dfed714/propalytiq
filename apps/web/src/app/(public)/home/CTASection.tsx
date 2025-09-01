"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto purple-gradient-bg rounded-2xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to make data-driven property investments?
          </h2>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-3xl">
            Join property investors who are using AI to make smarter, faster
            investment decisions.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
          >
            <Link href="/analysis">Start Your Analysis Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
