"use client";

import { useState } from 'react';
import { API_BASE_URL } from '@/services/api.config';
import { Download, Loader2 } from 'lucide-react';

export const DownloadPdfButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Adjust the URL if your production URL is different
      const response = await fetch(`${API_BASE_URL}/pdf/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "Production Report",
          summary: "This is a strictly formatted PDF generated from the server side without relying on Viewport sizes.",
          items: [
            { id: 1, desc: "A4 formatting works", status: "Success" },
            { id: 2, desc: "Random splits prevented", status: "Success" },
            { id: 3, desc: "Viewport dependencies removed", status: "Success" }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Convert response to Blob
      const blob = await response.blob();

      // Create a blob URL and force download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'professional-report.pdf';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error(error);
      alert("Something went wrong while downloading the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`group relative flex items-center justify-center gap-2 px-6 py-2.5 font-medium text-white rounded-lg shadow-sm transition-all duration-200 ${
        isLoading 
          ? "bg-blue-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download Report</span>
        </>
      )}
    </button>
  );
};
