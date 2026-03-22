import { Router } from 'express';
import { downloadPdf } from '../controllers/pdfController';

const router = Router();

router.post('/download', downloadPdf);

export default router;
