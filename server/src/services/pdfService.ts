import puppeteer from 'puppeteer';
import { generateHtmlTemplate } from '../templates/documentTemplate';

export const createPdfBuffer = async (reportData: any): Promise<Buffer> => {
  const htmlContent = generateHtmlTemplate(reportData);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    const pdfBufferBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      }
    });

    // puppeteer's page.pdf returns a Uint8Array in newer versions
    const pdfBuffer = Buffer.from(pdfBufferBytes);

    await browser.close();
    return pdfBuffer;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
