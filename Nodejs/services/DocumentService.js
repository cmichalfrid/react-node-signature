const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const Service = require('./Service.js');
const DocumentRepo = require('../repositories/DocumentRepo.js');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class DocumentService extends Service {
    constructor() {
        super(DocumentRepo);
    }

    async insert(req, res, next) {
        console.log("📥 קובץ:", req.file);
        console.log("📥 שם:", req.body.name);
        console.log("📥 מייל:", req.body.email);
        try {
            const file = req.file;
            const { name, email } = req.body;

            if (!file) {
                return res.status(400).send("לא נשלח קובץ");
            }

            const wordBuffer = fs.readFileSync(file.path);
            const result = await mammoth.convertToHtml({ buffer: wordBuffer });
            const html = result.value;

            const pdfFileName = path.basename(file.originalname, path.extname(file.originalname)) + '.pdf';
            const pdfDir = path.join(__dirname, '../uploads/pdf');

            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }



            const pdfFilePath = path.join(pdfDir, pdfFileName);

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle0' });
            await page.pdf({ path: pdfFilePath, format: 'A4' });

            await browser.close();

            const savedDoc = await this.repo.insert({ name, email, fileName: pdfFileName });
            console.log('inserted document id:', savedDoc);

            res.status(201).json({

                message: 'המסמך הומר ונשמר בהצלחה',
                id: savedDoc,
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה במהלך העלאת המסמך");
        }

    }

    async getDocumentForId(req, res, next) {
        try {
            const file = await this.repo.get(req.params.id);
            const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
            const url = `${baseUrl}/uploads/pdf/${encodeURIComponent(file.fileName)}`;
            res.json({ ...file, url });
        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה בשליפת המסמך");
        }
    }

    async sendFileSignature(req, res, next) {
        try {
            const file = await this.repo.get(req.body.id);
            const { fileName, email } = file;
            const signatureDataUrl = req.body.signature;

            const filePath = path.join(__dirname, `../uploads/pdf/${fileName}`);
            const readPdf = fs.readFileSync(filePath);
            const pdfDoc = await PDFDocument.load(readPdf);

            const signatureImageBytes = Buffer.from(signatureDataUrl.split(',')[1], 'base64');
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            const page = pdfDoc.getPages()[0];
            const lineStartX = 230;
            const lineEndX = 360;
            const lineY = 130;

            page.drawImage(signatureImage, {
                x: lineStartX + (lineEndX - lineStartX) / 2 - 65,
                y: lineY + 8,
                width: 130,
                height: 60,
                opacity: 1,
            });

            page.drawLine({
                start: { x: lineStartX, y: lineY },
                end: { x: lineEndX, y: lineY },
                thickness: 1,
                color: rgb(0, 0, 0),
            });

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const text = 'Signature:';
            const textSize = 12;
            const textWidth = font.widthOfTextAtSize(text, textSize);
            const textX = lineStartX + (lineEndX - lineStartX) / 2 - textWidth / 2;
            const textY = lineY - 15;

            page.drawText(text, {
                x: textX,
                y: textY,
                size: textSize,
                font: font,
                color: rgb(0, 0, 0),
            });

            const signedPdfBytes = await pdfDoc.save();
            const signedFilePath = path.join(__dirname, `../uploads/pdf/${fileName}_signed.pdf`);
            fs.writeFileSync(signedFilePath, signedPdfBytes);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mf0583220705@gmail.com',
                    pass: 'jekd btkj vejo enuk'
                }
            });

            await transporter.sendMail({
                from: '"חתימה דיגיטלית" <mf0583220705@gmail.com>',
                to: email,
                subject: "המסמך החתום שלך",
                text: "שלום, מצורף קובץ המסמך החתום שלך.",
                attachments: [
                    {
                        filename: 'signed_document.pdf',
                        path: signedFilePath,
                    },
                ],
            });

            res.status(200).json({
                message: "נשמר עם חתימה",
                path: `/uploads/pdf/${fileName}_signed.pdf`
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה במהלך החתימה או השליחה");
        }
    }
}

module.exports = new DocumentService();
