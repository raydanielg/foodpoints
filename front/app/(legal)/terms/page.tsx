export const metadata = {
  title: "Terms of Service — FoodPoint",
  description: "The terms and conditions for using FoodPoint's restaurant management platform.",
}

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title block */}
      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Intro */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        Welcome to FoodPoint. These Terms of Service (&quot;Terms&quot;) govern your
        use of the FoodPoint restaurant management platform, including QR-based
        ordering, split payments, kitchen display, analytics, and all related
        features. By creating an account or using our services, you agree to
        these Terms.
      </p>

      {/* Sections */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">1. Eligibility</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You must be at least 18 years old and have the legal authority to
          enter into binding agreements to use FoodPoint. By registering, you
          represent and warrant that you meet these requirements and that the
          information you provide is accurate and complete.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">2. Your Account</h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> You are responsible for maintaining the confidentiality of your login credentials</li>
          <li className="flex gap-2"><span className="text-primary">•</span> You are responsible for all activities that occur under your account</li>
          <li className="flex gap-2"><span className="text-primary">•</span> You must notify us immediately of any unauthorized use of your account</li>
          <li className="flex gap-2"><span className="text-primary">•</span> You may not share your account credentials with third parties</li>
          <li className="flex gap-2"><span className="text-primary">•</span> One account per restaurant; additional staff may be added through the staff management feature</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">3. Acceptable Use</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You agree not to:
        </p>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> Use the platform for any illegal or unauthorized purpose</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Upload menu items, images, or content that infringes on intellectual property rights</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Attempt to disrupt, reverse engineer, or hack the platform</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Use automated scripts, bots, or scrapers without our written permission</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Transmit viruses, malware, or any other malicious code</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Misrepresent your restaurant or provide false information to customers</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">4. Restaurant Responsibilities</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          As a restaurant owner or manager using FoodPoint, you are responsible
          for:
        </p>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> The accuracy of your menu items, prices, descriptions, and images</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Fulfilling orders placed through the platform in a timely manner</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Compliance with all local health, safety, and food handling regulations</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Proper VAT and tax reporting as applicable in your jurisdiction</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Ensuring your QR codes are placed on the correct tables</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">5. Payments &amp; Fees</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          FoodPoint provides split payment functionality for your customers.
          You are responsible for all payment processing fees charged by
          third-party payment providers. FoodPoint does not hold or transfer
          funds directly. All payment disputes must be resolved between you,
          your customer, and the payment processor.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Subscription fees for FoodPoint, if applicable, will be billed
          according to your selected plan. Fees are non-refundable except as
          required by law.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          FoodPoint and its original content, features, and functionality are
          owned by FoodPoint and are protected by international copyright,
          trademark, and other intellectual property laws. You retain ownership
          of all menu items, images, and content you upload to the platform.
          By uploading content, you grant FoodPoint a non-exclusive license to
          display it as part of providing our services.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">7. Service Availability</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We strive to maintain 99.9% uptime but do not guarantee uninterrupted
          access to the platform. We may perform maintenance, updates, or
          changes that temporarily affect availability. We are not liable for
          any downtime, data loss, or business interruption resulting from
          service unavailability.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          FoodPoint shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including loss of profits, data,
          or business opportunities, arising from your use of or inability to
          use the platform. Our total liability for any claim shall not exceed
          the amount you have paid us in the preceding 12 months.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">9. Termination</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You may terminate your account at any time by contacting us. We
          reserve the right to suspend or terminate your account if you
          violate these Terms, engage in fraudulent activity, or if your
          restaurant ceases operations. Upon termination, your data will be
          retained for 30 days before permanent deletion, unless required
          by law.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">10. Governing Law</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          These Terms shall be governed by and construed in accordance with the
          laws of the United Republic of Tanzania. Any disputes arising from
          these Terms shall be resolved in the courts of Tanzania.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">11. Changes to These Terms</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We reserve the right to modify these Terms at any time. We will
          notify you of significant changes via email or through the platform.
          Your continued use of FoodPoint after changes take effect constitutes
          acceptance of the updated Terms.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">12. Contact Us</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If you have any questions about these Terms, please contact us:
        </p>
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <p className="font-semibold">FoodPoint</p>
          <p className="text-muted-foreground">Phone / WhatsApp: +255 613 976 254</p>
          <p className="text-muted-foreground">Email: support@foodpoint.co.tz</p>
        </div>
      </section>
    </div>
  )
}
