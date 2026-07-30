export const metadata = {
  title: "Privacy Policy — FoodPoint",
  description: "How FoodPoint collects, uses, and protects your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title block */}
      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Intro */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        FoodPoint (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates a restaurant
        management platform that provides QR-based ordering, split payments, kitchen
        display, and analytics services. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you use our platform.
      </p>

      {/* Sections */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We collect information you provide directly to us when you create an
          account, including your name, email address, restaurant name, and
          password. We also collect information about your restaurant&apos;s menu
          items, prices, images, and operational data such as orders, revenue,
          and customer interactions.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Automatically collected data includes IP addresses, browser type,
          device information, and usage data through cookies and similar
          technologies.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> To provide, operate, and maintain the FoodPoint platform</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To process transactions and manage split payments</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To display your menu to customers via QR code ordering</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To provide analytics and reporting on your restaurant&apos;s performance</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To communicate with you about updates, support, and new features</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To detect, prevent, and address technical issues and fraud</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">3. Information Sharing &amp; Disclosure</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except in the following
          circumstances:
        </p>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> To service providers who assist us in operating the platform (e.g., payment processors, hosting providers)</li>
          <li className="flex gap-2"><span className="text-primary">•</span> When required by law, court order, or government regulation</li>
          <li className="flex gap-2"><span className="text-primary">•</span> To protect our rights, property, or safety, or that of our users</li>
          <li className="flex gap-2"><span className="text-primary">•</span> In connection with a merger, acquisition, or sale of assets</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We implement appropriate technical and organizational measures to
          protect your data, including encrypted password hashing, secure API
          authentication, and regular security reviews. However, no method of
          transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">5. Data Retention</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We retain your information for as long as your account is active or
          as needed to provide our services. You may request deletion of your
          account and associated data at any time by contacting us. Some
          information may be retained for legal, accounting, or reporting
          purposes even after account deletion.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">6. Customer Data</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When customers scan a QR code and place orders, we collect limited
          session data (table number, order details, payment information) to
          facilitate the transaction. This data is associated with your
          restaurant and is accessible through your dashboard. We do not
          collect personal customer accounts unless they choose to provide
          contact information.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">7. Cookies &amp; Tracking</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use cookies and similar tracking technologies to track activity on
          our platform and store certain information. Cookies are files with a
          small amount of data that may include an anonymous unique identifier.
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">8. Your Rights</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You have the right to:
        </p>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> Access the personal data we hold about you</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Request correction of inaccurate or incomplete data</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Request deletion of your account and associated data</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Opt out of marketing communications</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Withdraw consent for data processing where applicable</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date. You are advised to review
          this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If you have any questions about this Privacy Policy, please contact us:
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
