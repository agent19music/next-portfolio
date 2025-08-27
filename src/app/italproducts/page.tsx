"use client";

import Image from "next/image";
import { Download, FileText, Receipt, ChevronDown } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export default function ItalProductsPage() {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const contractRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<'receipt' | 'contract' | null>('receipt');
  
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
  }, []);

  const toggleSection = (section: 'receipt' | 'contract') => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleDownload = useCallback(async (type: 'receipt' | 'contract') => {
    const targetRef = type === 'receipt' ? receiptRef.current : contractRef.current;
    if (!targetRef) return;
    try {
      const { toPng } = await import("html-to-image");
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const dataUrl = await toPng(targetRef, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: "#ffffff",
        quality: 1,
        fontEmbedCSS: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `,
      });

      if (isIOS) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`<html><head><title>${type === 'receipt' ? 'Receipt' : 'Contract'}</title></head><body style="margin:0"><img src="${dataUrl}" style="max-width:100%;height:auto;display:block"/></body></html>`);
          newTab.document.close();
        }
        return;
      }

      const link = document.createElement("a");
      link.download = `ital-products-${type}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Failed to generate ${type} image:`, error);
      alert(`Failed to download ${type}. Please try again.`);
    }
  }, [isIOS]);

  const currentDate = new Date().toLocaleDateString('en-KE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center py-8 sm:py-16 px-3 sm:px-4">
      <div className="relative w-full max-w-xl sm:max-w-3xl">
        <div className="absolute inset-0 rounded-2xl shadow-[0_40px_80px_rgba(2,6,23,0.12)] -z-10" />

        {/* Document Selection Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => toggleSection('receipt')}
            className={`flex-1 flex items-center justify-between px-4 py-3 rounded-xl ring-1 transition-all ${
              activeSection === 'receipt' 
                ? 'bg-white ring-sky-500 text-sky-600 shadow-lg' 
                : 'bg-white ring-slate-200 text-slate-600 hover:ring-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5" />
              <span className="font-medium">Invoice Receipt</span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${
                activeSection === 'receipt' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          <button
            onClick={() => toggleSection('contract')}
            className={`flex-1 flex items-center justify-between px-4 py-3 rounded-xl ring-1 transition-all ${
              activeSection === 'contract' 
                ? 'bg-white ring-sky-500 text-sky-600 shadow-lg' 
                : 'bg-white ring-slate-200 text-slate-600 hover:ring-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Service Contract</span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${
                activeSection === 'contract' ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {/* Receipt Section */}
        {activeSection === 'receipt' && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-200">
            <div ref={receiptRef} className="rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <h2 className="text-slate-800 text-base sm:text-lg font-semibold">Invoice Receipt</h2>
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-slate-50 ring-1 ring-slate-200"
                    aria-label="Download Receipt"
                    onClick={() => handleDownload('receipt')}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Invoice header */}
              <div className="px-4 sm:px-8 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden ring-1 ring-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                      <Image src="/signature.png" alt="Sean Motanya" width={40} height={40} />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                      <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Recipient</div>
                      <div className="font-medium text-slate-700 text-sm sm:text-base">ITAL PRODUCTS LTD</div>
                      <div>Nairobi, Kenya</div>
                      <div>tisoeli38@gmail.com</div>
                      <div>P.O Box 48952, Nairobi, Kenya</div>
                    </div>
                  </div>

                  <div className="sm:text-right text-left text-xs sm:text-sm text-slate-600 space-y-1">
                    <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Service Provider</div>
                    <div className="font-medium text-slate-700 text-sm sm:text-base">SEAN MOTANYA</div>
                    <div>Nairobi, Kenya</div>
                    <div>seanmotanya@gmail.com</div>
                    <div>+254 745071299</div>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="text-[10px] sm:text-[11px] text-slate-400">Invoice #2024-001</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400">Date: {currentDate}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div className="px-4 sm:px-8">
                <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px] sm:min-w-0">
                      <thead className="bg-white">
                        <tr className="text-slate-400 text-xs uppercase">
                          <th className="text-left font-medium px-4 sm:px-6 py-3">Task description</th>
                          <th className="text-left font-medium px-4 sm:px-6 py-3">Duration</th>
                          <th className="text-left font-medium px-4 sm:px-6 py-3">Rate</th>
                          <th className="text-right font-medium px-4 sm:px-6 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="px-4 sm:px-6 py-4 text-sky-600">Website Design</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-700">2 weeks</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-700">8,000 KSH/week</td>
                          <td className="px-4 sm:px-6 py-4 text-right text-slate-700">16,000 KSH</td>
                        </tr>
                        <tr>
                          <td className="px-4 sm:px-6 py-4 text-sky-600">Website Development</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-700">2 weeks</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-700">8,000 KSH/week</td>
                          <td className="px-4 sm:px-6 py-4 text-right text-slate-700">16,000 KSH</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-slate-200">
                    <dl className="grid grid-cols-2 text-sm">
                      <div className="px-4 sm:px-6 py-3 text-slate-500">Subtotal</div>
                      <div className="px-4 sm:px-6 py-3 text-right text-slate-700">32,000 KSH</div>
                      <div className="px-4 sm:px-6 py-3 text-slate-500">Discount 5%</div>
                      <div className="px-4 sm:px-6 py-3 text-right text-slate-700">1,600 KSH</div>
                      <div className="px-4 sm:px-6 py-4 text-slate-700 font-medium border-t border-slate-200">Total Amount Due</div>
                      <div className="px-4 sm:px-6 py-4 text-right text-sky-600 font-semibold border-t border-slate-200">30,400 KSH</div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="px-4 sm:px-8 pt-6">
                <div className="rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4">
                  <div className="text-xs sm:text-sm uppercase text-amber-700 font-medium mb-2">Payment Schedule</div>
                  <div className="space-y-2 text-xs sm:text-sm text-amber-900">
                    <div className="flex justify-between">
                      <span>1st Payment (Design Completion):</span>
                      <span className="font-semibold">15,200 KSH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2nd Payment (Development & Deployment):</span>
                      <span className="font-semibold">15,200 KSH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              <div className="px-4 sm:px-8 pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Please transfer payment to the following account:
                  </p>
                  <div className="mt-3 inline-block rounded-lg bg-slate-50 ring-1 ring-slate-200 px-4 py-3">
                    <div className="text-[11px] sm:text-xs text-slate-500 space-y-1">
                      <div><span className="font-medium text-slate-700">Bank:</span> I&M Bank</div>
                      <div><span className="font-medium text-slate-700">Account Number:</span> 02705662966150</div>
                      <div><span className="font-medium text-slate-700">Account Name:</span> Sean Motanya</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="px-4 sm:px-8 pt-6 sm:pt-8">
                <div className="text-xs sm:text-sm uppercase text-slate-400">Terms & Conditions</div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-500">
                  Payment is due as per the schedule above. First payment upon design completion, 
                  second payment upon deployment. Transfer of ownership and credentials will occur 
                  after final payment is received.
                </p>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-8 py-6 sm:py-8 border-t border-slate-100 mt-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-slate-500">Thank you for your business!</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
                    This invoice was issued by Sean Motanya (Freelancer) • Not VAT registered
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Section */}
        {activeSection === 'contract' && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-200">
            <div ref={contractRef} className="rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <h2 className="text-slate-800 text-base sm:text-lg font-semibold">Service Contract</h2>
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-slate-50 ring-1 ring-slate-200"
                    aria-label="Download Contract"
                    onClick={() => handleDownload('contract')}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contract Header */}
              <div className="px-4 sm:px-8 pb-4 sm:pb-6">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 sm:p-6">
                  <h3 className="text-center text-lg sm:text-xl font-semibold text-slate-800 mb-4">
                    WEB DEVELOPMENT SERVICES AGREEMENT
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>This Service Agreement (&quot;Agreement&quot;) is entered into on <span className="font-medium text-slate-700">{currentDate}</span> between:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Service Provider</div>
                        <div className="font-medium text-slate-700">Sean Motanya</div>
                        <div className="text-xs">Freelance Web Developer</div>
                        <div className="text-xs">Nairobi, Kenya</div>
                        <div className="text-xs">seanmotanya@gmail.com</div>
                        <div className="text-xs">+254 745071299</div>
                      </div>
                      <div className="space-y-1">
                        <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Client</div>
                        <div className="font-medium text-slate-700">ITAL PRODUCTS LTD</div>
                        <div className="text-xs">P.O Box 48952</div>
                        <div className="text-xs">Nairobi, Kenya</div>
                        <div className="text-xs">tisoeli38@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              <div className="px-4 sm:px-8 space-y-6">
                {/* Scope of Work */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">1. SCOPE OF WORK</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>The Service Provider agrees to provide the following services:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="font-medium">Website Design:</span> Complete UI/UX design for the company website including all pages, responsive layouts, and design assets</li>
                      <li><span className="font-medium">Website Development:</span> Full-stack development, implementation of designed interfaces, backend functionality, and database setup</li>
                      <li><span className="font-medium">Deployment:</span> Website deployment to production server and initial configuration</li>
                      <li><span className="font-medium">Documentation:</span> Basic documentation for website maintenance and content management</li>
                    </ul>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">2. PAYMENT TERMS</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>The total contract value is <span className="font-semibold text-slate-700">KSH 30,400</span> payable as follows:</p>
                    <div className="bg-amber-50 rounded-lg p-3 mt-2 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">First Payment: KSH 15,200</p>
                          <p className="text-xs mt-1">Due upon completion and approval of website design</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">Final Payment: KSH 15,200</p>
                          <p className="text-xs mt-1">Due upon website deployment to production</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      All payments shall be made via bank transfer to the account specified in the invoice.
                    </p>
                  </div>
                </div>

                {/* Ownership Transfer */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">3. OWNERSHIP & INTELLECTUAL PROPERTY</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p className="font-medium">Transfer of Rights:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>All source code, design assets, and documentation remain the property of the Service Provider until final payment is received</li>
                      <li>Upon receipt of final payment, full ownership and intellectual property rights transfer to the Client</li>
                      <li>Login credentials, hosting access, and administrative tools will be transferred only after final payment clearance</li>
                    </ul>
                  </div>
                </div>

                {/* Timeline */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">4. PROJECT TIMELINE</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Design Phase:</span>
                        <span className="font-medium">2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Development Phase:</span>
                        <span className="font-medium">2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Duration:</span>
                        <span className="font-semibold">4 weeks</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Timeline commences upon contract signing. Delays caused by the Client may extend the timeline.
                    </p>
                  </div>
                </div>

                {/* Client Obligations */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">5. CLIENT OBLIGATIONS</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Provide necessary content, images, and branding materials</li>
                      <li>Timely feedback and approval at each milestone</li>
                      <li>Provide hosting details if using existing hosting service</li>
                      <li>Make payments as per the agreed schedule</li>
                    </ul>
                  </div>
                </div>

                {/* Warranties and Liability */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">6. WARRANTIES & LIABILITY</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>The Service Provider warrants that:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>All work will be original and not infringe any third-party rights</li>
                      <li>The website will be functional and free from material defects for 30 days post-deployment</li>
                      <li>Bug fixes for issues identified within 30 days will be provided at no additional cost</li>
                    </ul>
                    <p className="mt-3">Limitation of Liability: The Service Provider&apos;s liability shall not exceed the total contract value.</p>
                  </div>
                </div>

                {/* Termination */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">7. TERMINATION</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>This Agreement may be terminated:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>By mutual written consent of both parties</li>
                      <li>By either party upon material breach with 7 days written notice</li>
                      <li>Upon termination, Client shall pay for all work completed up to termination date</li>
                    </ul>
                  </div>
                </div>

                {/* Confidentiality */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">8. CONFIDENTIALITY</h4>
                  <div className="text-xs sm:text-sm text-slate-600">
                    <p>Both parties agree to maintain confidentiality of any proprietary information shared during the project and for one year thereafter.</p>
                  </div>
                </div>

                {/* Dispute Resolution */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">9. DISPUTE RESOLUTION</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <p>Any disputes arising from this Agreement shall be:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>First addressed through good faith negotiations</li>
                      <li>If unresolved, submitted to mediation in accordance with the Mediation Rules of the Chartered Institute of Arbitrators, Kenya Branch</li>
                      <li>If mediation fails, resolved through arbitration under the Arbitration Act, 1995 (Laws of Kenya)</li>
                    </ul>
                  </div>
                </div>

                {/* Governing Law */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">10. GOVERNING LAW</h4>
                  <div className="text-xs sm:text-sm text-slate-600">
                    <p>This Agreement shall be governed by and construed in accordance with the Laws of Kenya.</p>
                  </div>
                </div>

                {/* General Provisions */}
                <div className="rounded-xl ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-3">11. GENERAL PROVISIONS</h4>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="font-medium">Entire Agreement:</span> This constitutes the entire agreement between parties</li>
                      <li><span className="font-medium">Amendments:</span> Any changes must be in writing and signed by both parties</li>
                      <li><span className="font-medium">Severability:</span> If any provision is deemed invalid, other provisions remain in effect</li>
                      <li><span className="font-medium">Force Majeure:</span> Neither party liable for delays due to circumstances beyond reasonable control</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="px-4 sm:px-8 py-8 mt-8 border-t border-slate-200">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-4">ACCEPTANCE</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Service Provider</div>
                      <div className="border-b-2 border-slate-300 pb-1">
                        <p className="text-sm font-medium text-slate-700">Sean Motanya</p>
                        
                      </div>
                      <div className="text-xs text-slate-500">
                        <p>Date: {currentDate}</p>
                        <p>Sign: _________________</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Client</div>
                      <div className="border-b-2 border-slate-300 pb-1">
                        <p className="text-sm font-medium text-slate-700">ITAL PRODUCTS LTD</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        <p>Authorized Representative</p>
                        <p>Date: _________________</p>
                        <p>Sign: _________________</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-8 pb-6 text-center">
                <p className="text-[10px] sm:text-xs text-slate-400">
                  This is a legally binding contract under the Laws of Kenya
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
