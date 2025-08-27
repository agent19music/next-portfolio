"use client";

import Image from "next/image";
import { Download, Printer, FileText, Receipt, ChevronDown } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export default function ReceiptPage() {
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
        // iOS Safari often blocks programmatic downloads; open in a new tab instead
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`<html><head><title>${type === 'receipt' ? 'Receipt' : 'Contract'}</title></head><body style="margin:0"><img src="${dataUrl}" style="max-width:100%;height:auto;display:block"/></body></html>`);
          newTab.document.close();
        }
        return;
      }

      const link = document.createElement("a");
      link.download = `${type}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to generate ${type} image:`, error);
      alert(`Failed to download ${type}. Please try again.`);
    }
  }, [isIOS]);
  const handlePrint = useCallback(() => {
    if (!receiptRef.current) return;
    const printContents = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { size: auto; margin: 12mm; }
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background: #fff; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <div>${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Give time for images to load before printing
    const interval = setInterval(() => {
      const imgs = printWindow.document.images;
      const allLoaded = Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
      if (allLoaded) {
        clearInterval(interval);
        printWindow.print();
        printWindow.close();
      }
    }, 150);
  }, []);
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center py-8 sm:py-16 px-3 sm:px-4">
      <div className="relative w-full max-w-xl sm:max-w-3xl">
        <div className="absolute inset-0 rounded-2xl shadow-[0_40px_80px_rgba(2,6,23,0.12)] -z-10" />

        <div ref={receiptRef} className="rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <h2 className="text-slate-800 text-base sm:text-lg font-semibold">Preview</h2>
            <div className="flex items-center gap-2 text-slate-500">
              <button
                type="button"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-slate-50 ring-1 ring-slate-200"
                aria-label="Download"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </button>
               {/* <button
               type="button"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-slate-50 ring-1 ring-slate-200"
                aria-label="Print"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
              </button> */}
            </div>
          </div>

          {/* Invoice header */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden ring-1 ring-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                  <Image src="/signature.png" alt="Camposocial" width={40} height={40} />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                  <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Recipient</div>
                  <div className="font-medium text-slate-700 text-sm sm:text-base">ITAL PRODUCTS LTD</div>
                  <div>Nairobi, Kenya</div>
                  {/* <div>VAT: 42374</div>      */}
                  <div>tisoeli38@gmail.com</div>
                  <div>P.O Box 48952, Nairobi, Kenya</div>
                  <div>Tax Identification Number: </div>
                  <div>Bank Account Number: </div>
                  <div>Bank Name: </div>
                  <div>Bank Branch: </div>
                  <div>Bank Account Name: </div>
                </div>
              </div>

              <div className="sm:text-right text-left text-xs sm:text-sm text-slate-600 space-y-1">
                <div className="uppercase tracking-wide text-[10px] sm:text-[11px] text-slate-400">Sender</div>
                <div className="font-medium text-slate-700 text-sm sm:text-base">SEAN MOTANYA</div>
                <div>Nairobi, Kenya</div>
                        {/* <div>VAT: 22501084</div>
                     */}
                  <div>seanmotanya@gmail.com</div>
                  <div>+254 745071299</div>
                
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
                      <th className="text-left font-medium px-4 sm:px-6 py-3">Weeks</th>
                      <th className="text-left font-medium px-4 sm:px-6 py-3">Rate</th>
                      <th className="text-right font-medium px-4 sm:px-6 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 sm:px-6 py-4 text-sky-600">Website Design</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">2</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">8,000 KSH</td>
                      <td className="px-4 sm:px-6 py-4 text-right text-slate-700">16,000 KSH</td>
                    </tr>
                    <tr>
                      <td className="px-4 sm:px-6 py-4 text-sky-600">Website Development</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">2</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">8,000 KSH</td>
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
                  <div className="px-4 sm:px-6 py-4 text-slate-700 font-medium border-t border-slate-200">Total</div>
                  <div className="px-4 sm:px-6 py-4 text-right text-sky-600 font-semibold border-t border-slate-200">30,400 KSH</div>
                </dl>
              </div>
            </div>
          </div>

          {/* Payment note */}
          <div className="px-4 sm:px-8 pt-4 sm:pt-6">
            <p className="text-center text-xs sm:text-sm text-slate-500">
              Transfer the amount to the personal account below. Please include invoice number on your check.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
                <span>Bank: I&M Bank</span>
              <span>Account Number: 02705662966150</span>
            </div>
          </div>

          {/* Notes */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8">
            <div className="text-xs sm:text-sm uppercase text-slate-400">Notes</div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-500">
              All amounts are in KSH. Please make the payment within 15 days from the issue of date of this invoice. 
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">Thank you for your confidence in my work.</p>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] sm:text-xs text-slate-500">
              <div>
                <div className="uppercase text-[10px] text-slate-400">SEAN MOTANYA</div>
                <div>Nairobi, Kenya</div>
              </div>
              <div className="text-left sm:text-center">
                <div>seanmotanya@gmail.com</div>
                <div>+254 745071299</div>
              </div>
              <div className="sm:text-right text-left">
                <div>Freelance work by Sean Motanya</div>
                <div>Not a registered company</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


