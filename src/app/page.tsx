import Image from "next/image";
import WorkspaceDemo from "./workspace-demo";

const spend = [
  { month: "Jan", amount: 42, value: "$420" },
  { month: "Feb", amount: 58, value: "$580" },
  { month: "Mar", amount: 46, value: "$460" },
  { month: "Apr", amount: 76, value: "$760" },
  { month: "May", amount: 62, value: "$620" },
  { month: "Jun", amount: 86, value: "$860" },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Expense Management System home"><span className="brand-mark">E</span><span>Expense Management System</span></a>
        <nav className="site-nav" aria-label="Main navigation"><a href="#workspace">Workspace</a><a href="#workflow">Workflow</a><a href="#outcomes">Outcomes</a></nav>
        <a className="nav-action" href="#workspace">Explore the experience <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-kicker">Employee expense experience</div>
            <h1 id="hero-title">Every expense, clearly accounted for.</h1>
            <p>From the first receipt to the final reimbursement, one focused place to keep work moving.</p>
            <a className="button button-primary" href="#workspace">Explore the workspace <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-art">
            <Image src="/images/receipt-desk.png" alt="A paper receipt on a quiet desk beside a pen and paperclip" fill priority sizes="(max-width: 800px) 100vw, 46vw" className="hero-photo" />
            <div className="hero-receipt-note" aria-label="Expense saved status"><span className="status-dot status-dot-blue" /><span>Receipt captured</span><strong>$18.53</strong></div>
          </div>
        </section>

        <section className="project-intro section-wrap" aria-labelledby="intro-title">
          <div className="intro-label">The project</div>
          <div className="intro-main"><h2 id="intro-title">A calmer way through a complex process.</h2><p>Employees should not need to remember where a claim stands. This interface keeps entry, policy guidance, approval, and payment status connected in a single journey.</p></div>
          <dl className="intro-facts"><div><dt>Surface</dt><dd>Responsive employee workspace</dd></div><div><dt>Focus</dt><dd>Expense to reimbursement</dd></div><div><dt>Role</dt><dd>Frontend experience</dd></div></dl>
        </section>

        <section className="workspace-section" id="workspace" aria-labelledby="workspace-title">
          <div className="section-wrap workspace-heading"><div><p className="section-index">01 / Product workspace</p><h2 id="workspace-title">One view for what needs attention.</h2></div><p>Try the preview. Switch views, create an expense, and see how the interface responds to a policy warning.</p></div>
          <div className="section-wrap"><WorkspaceDemo /></div>
        </section>

        <section className="workflow-section section-wrap" id="workflow" aria-labelledby="workflow-title">
          <div className="workflow-heading"><p className="section-index">02 / The journey</p><h2 id="workflow-title">A clear path, even when the process is not.</h2></div>
          <div className="workflow-line"><div><span>01</span><h3>Capture</h3><p>Add details and attach a receipt.</p></div><div><span>02</span><h3>Check</h3><p>Resolve policy guidance before submission.</p></div><div><span>03</span><h3>Submit</h3><p>Group expenses into a report.</p></div><div><span>04</span><h3>Track</h3><p>Follow approval and reimbursement.</p></div></div>
        </section>

        <section className="capture-section section-wrap" aria-labelledby="capture-title">
          <div className="capture-image"><Image src="/images/receipt-in-hand.png" alt="An employee holding a travel receipt beside a laptop" fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
          <div className="capture-copy"><p className="section-index">03 / Receipt entry</p><h2 id="capture-title">Less typing. More certainty.</h2><p>Receipt assisted entry suggests the merchant, date, and amount. Employees can review every field before saving, so automation stays helpful and accountable.</p>
            <div className="extraction-sheet" aria-label="Example extracted receipt fields"><div><span>Merchant</span><strong>Riverdale Station</strong></div><div><span>Category</span><strong>Travel</strong></div><div><span>Amount</span><strong>$15.66</strong></div><p>Suggested from receipt · Review before saving</p></div>
          </div>
        </section>

        <section className="policy-section" aria-labelledby="policy-title"><div className="section-wrap policy-inner">
          <div className="policy-lead"><p className="section-index">04 / Policy guidance</p><h2 id="policy-title">Catch an issue while it is easy to fix.</h2><p>A warning explains the rule, the specific amount, and the next action. It never hides the expense or leaves the employee guessing.</p></div>
          <div className="policy-example"><div className="policy-example-top"><span>Expense review</span><span>Needs attention</span></div><h3>Meal limit exceeded</h3><p>This $92.00 meal is $17.00 above your $75.00 daily limit.</p><div className="policy-action-row"><span>Add a note for your manager or edit the amount.</span><span aria-hidden="true">↗</span></div></div>
        </div></section>

        <section className="reports-section section-wrap" aria-labelledby="reports-title">
          <div className="reports-copy"><p className="section-index">05 / Reports</p><h2 id="reports-title">Submission begins with a complete story.</h2><p>Related expenses become one report with a clear total, receipt coverage, and a useful name. Employees know exactly what will be reviewed.</p></div>
          <div className="report-preview"><div className="report-preview-header"><span>Report preview</span><span>Ready to submit</span></div><h3>Client visit · June</h3><div className="report-preview-total"><span>3 expenses</span><strong>$346.80</strong></div><div className="report-row"><span>Rail ticket</span><span>Travel</span><strong>$148.20</strong></div><div className="report-row"><span>Team lunch</span><span>Meals</span><strong>$92.00</strong></div><div className="report-row"><span>Hotel transfer</span><span>Travel</span><strong>$106.60</strong></div><div className="report-preview-foot">3 of 3 receipts attached <span>Complete</span></div></div>
        </section>

        <section className="approval-section section-wrap" aria-labelledby="approval-title">
          <div className="approval-head"><p className="section-index">06 / Approval clarity</p><h2 id="approval-title">A status that tells the whole story.</h2><p>Instead of one vague label, the claim shows where it is, who has it, and what happens next.</p></div>
          <ol className="approval-timeline"><li><span className="timeline-marker marker-complete" /><div><strong>Submitted</strong><span>Jun 12, 9:41 AM</span></div><p>Your report was sent for review.</p></li><li><span className="timeline-marker marker-complete" /><div><strong>Manager approved</strong><span>Jun 13, 2:18 PM</span></div><p>Approved by your manager.</p></li><li><span className="timeline-marker marker-current" /><div><strong>Finance review</strong><span>In progress</span></div><p>Finance is checking the claim.</p></li><li><span className="timeline-marker" /><div><strong>Reimbursement</strong><span>Next step</span></div><p>Payment details appear here when scheduled.</p></li></ol>
        </section>

        <section className="outcomes-section" id="outcomes" aria-labelledby="outcomes-title"><div className="section-wrap outcomes-inner">
          <div className="outcomes-copy"><p className="section-index">07 / Reimbursement view</p><h2 id="outcomes-title">The last mile stays visible.</h2><p>Employees can see paid claims alongside pending ones, with dates and amounts that answer the question they actually have: when will I be paid?</p></div>
          <div className="outcomes-data"><div className="chart-head"><div><span>Sample spending</span><strong>$3,700</strong></div><span>Jan to Jun</span></div><div className="bar-chart" role="img" aria-label="Sample monthly spending from January through June: $420, $580, $460, $760, $620, $860">{spend.map((item) => <div className="bar-column" key={item.month}><div className="bar" style={{ height: `${item.amount}%` }} title={`${item.month}: ${item.value}`} /><span>{item.month}</span></div>)}</div><div className="payment-row"><div><strong>Client visit · June</strong><span>Scheduled for Jun 25</span></div><strong>$346.80</strong></div><div className="payment-row"><div><strong>Office supplies · May</strong><span>Paid on Jun 04</span></div><strong>$84.50</strong></div></div>
        </div></section>

        <section className="states-section section-wrap" aria-labelledby="states-title"><div className="states-head"><p className="section-index">08 / Interaction states</p><h2 id="states-title">Designed for the moments between success.</h2></div><div className="states-list"><div><span className="state-number">01</span><h3>Empty</h3><p>A first expense begins with one clear action and a short explanation.</p></div><div><span className="state-number">02</span><h3>Loading</h3><p>Receipt extraction shows progress where the employee expects a result.</p></div><div><span className="state-number">03</span><h3>Error</h3><p>A failed upload keeps entered details and offers a direct retry.</p></div></div></section>

        <section className="closing-section section-wrap" aria-labelledby="closing-title"><p className="section-index">Expense Management System</p><h2 id="closing-title">Good financial tools make the next step obvious.</h2><a className="button button-primary" href="#workspace">Return to the workspace <span aria-hidden="true">↑</span></a></section>
      </main>
      <footer className="site-footer section-wrap"><span>Employee experience · Frontend portfolio</span><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
