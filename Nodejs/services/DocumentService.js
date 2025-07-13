const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
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
        try {
            const file = req.file;
            const { name, email } = req.body;

            if (!file) {
                return res.status(400).send("לא נשלח קובץ");
            }

            const wordBuffer = fs.readFileSync(file.path);

            const pdfFileName = path.basename(file.originalname, path.extname(file.originalname)) + '.pdf';
            const pdfDir = path.join(__dirname, '../uploads/pdf');

            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            const pdfBuffer = await new Promise((resolve, reject) => {
                libre.convert(wordBuffer, '.pdf', undefined, (err, done) => {
                    if (err) return reject(err);
                    resolve(done);
                });
            });

            const base64Data = pdfBuffer.toString('base64');

            const savedDoc = await this.repo.insert({ name, email, fileData: base64Data });
            console.log('inserted document id:', savedDoc.id);

            res.status(201).json({
                message: 'המסמך הומר ונשמר בהצלחה',
                email: savedDoc.email,
                file: savedDoc.fileData,
                link: `/signature/${savedDoc.id}`,
                id:savedDoc.id
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה במהלך העלאת המסמך");
        }
    }

    async getDocumentForId(req, res, next) {
        try {
            const file = await this.repo.get(req.params.id);
             console.log('📄 file loaded from repo:', file);
            if (!file) return res.status(404).send("מסמך לא נמצא");

            const pdfBuffer = Buffer.from(file.fileData, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${file.name}.pdf"`);
            res.send(pdfBuffer);

        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה בשליפת המסמך");
        }
    }

    async sendFileSignature(req, res, next) {
        try {
            const file = await this.repo.get(req.body.id);
            if (!file) return res.status(404).send("מסמך לא נמצא");

            const { fileData, email, name } = file;
            const signatureDataUrl = req.body.signature;

            const pdfBuffer = Buffer.from(fileData, 'base64');
            const pdfDoc = await PDFDocument.load(pdfBuffer);

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
            const signedBase64 = signedPdfBytes.toString('base64');

            await this.repo.update(req.body.id, { signedFileData: signedBase64 });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mf0583220705@gmail.com',
                    pass: 'jekd btkj vejo enuk',
                },
            });

            await transporter.sendMail({
                from: '"חתימה דיגיטלית" <mf0583220705@gmail.com>',
                to: email,
                subject: "המסמך החתום שלך",
                text: "שלום, מצורף קובץ המסמך החתום שלך.",
                attachments: [
                    {
                        filename: 'signed_document.pdf',
                        content: signedPdfBytes,
                        contentType: 'application/pdf',
                    },
                ],
            });

            res.status(200).json({
                message: "המסמך נשמר עם חתימה ונשלח במייל",
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("שגיאה במהלך החתימה או השליחה");
        }
    }
}

module.exports = new DocumentService();
