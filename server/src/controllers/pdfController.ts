import { Request, Response } from 'express';
import { createPdfBuffer } from '../services/pdfService';

export const downloadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportData = req.body;
    
    const pdfBuffer = await createPdfBuffer(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="professional-report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};
