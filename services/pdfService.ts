// Service để xuất PDF và Word sử dụng browser API và docx library
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  author?: string;
  subject?: string;
}

export class PDFService {
  // Tạo PDF từ HTML content
  static async exportToPDF(content: string, options: PDFExportOptions = {}) {
    const {
      filename = 'don-xin-nghi-phep.pdf',
      title = 'Đơn xin nghỉ phép',
      author = 'Trợ lý tạo đơn xin nghỉ phép',
      subject = 'Đơn xin nghỉ phép'
    } = options;

    try {
      // Tạo một window mới để in
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Không thể mở cửa sổ in. Vui lòng cho phép popup.');
      }

      // Tạo HTML content cho PDF
      const htmlContent = this.createPrintableHTML(content, title);
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Đợi content load xong
      await new Promise(resolve => {
        printWindow.onload = resolve;
        setTimeout(resolve, 1000); // Fallback timeout
      });

      // Trigger print dialog
      printWindow.print();
      
      // Đóng window sau khi in
      setTimeout(() => {
        printWindow.close();
      }, 1000);

      return true;
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
      throw error;
    }
  }

  // Tạo HTML content cho việc in
  private static createPrintableHTML(content: string, title: string): string {
    const currentDate = new Date().toLocaleDateString('vi-VN');
    
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.6;
            color: #000;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          
          .header h1 {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          
          .content {
            white-space: pre-wrap;
            text-align: justify;
            margin-bottom: 30px;
          }
          
          .footer {
            margin-top: 50px;
            text-align: right;
            font-style: italic;
            font-size: 12px;
            color: #666;
          }
          
          .signature-area {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            text-align: center;
            width: 200px;
          }
          
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 5px;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Được tạo bởi Trợ lý AI - ${currentDate}</p>
        </div>
        
        <div class="content">
${content}
        </div>
        
        <div class="signature-area">
          <div class="signature-box">
            <p><strong>Người phê duyệt</strong></p>
            <div class="signature-line">
              <small>(Ký tên và đóng dấu)</small>
            </div>
          </div>
          
          <div class="signature-box">
            <p><strong>Người làm đơn</strong></p>
            <div class="signature-line">
              <small>(Ký tên)</small>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Đơn này được tạo tự động bởi Trợ lý tạo đơn xin nghỉ phép</p>
          <p>Ngày tạo: ${currentDate}</p>
        </div>
      </body>
      </html>
    `;
  }

  // Xuất dưới dạng Word (.docx format) sử dụng thư viện docx
  static async exportToWord(content: string, filename: string = 'don-xin-nghi-phep.docx') {
    try {
      const currentDate = new Date().toLocaleDateString('vi-VN');

      // Tạo document Word
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: "ĐƠN XIN NGHỈ PHÉP",
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Được tạo bởi Trợ lý AI - ${currentDate}`,
                  italics: true,
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),

            // Content
            ...this.parseContentToParagraphs(content),

            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: "---",
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Ngày tạo: ${currentDate}`,
                  italics: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Đơn này được tạo tự động bởi Trợ lý tạo đơn xin nghỉ phép",
                  italics: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }],
      });

      // Tạo blob và download
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      return true;
    } catch (error) {
      console.error('Lỗi khi xuất Word:', error);
      throw error;
    }
  }

  // Parse content thành các paragraph cho Word
  private static parseContentToParagraphs(content: string): Paragraph[] {
    const lines = content.split('\n');
    const paragraphs: Paragraph[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      } else {
        // Empty line for spacing
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 100 },
          })
        );
      }
    });

    return paragraphs;
  }

  // Tạo RTF content
  private static createRTFContent(content: string): string {
    const currentDate = new Date().toLocaleDateString('vi-VN');
    
    // Escape RTF special characters
    const escapedContent = content
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\n/g, '\\par\n');

    return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs28 
{\\qc\\b ĐƠN XIN NGHỈ PHÉP\\b0\\par}
{\\qc Được tạo bởi Trợ lý AI - ${currentDate}\\par}
\\par
${escapedContent}
\\par
\\par
{\\qr Ngày tạo: ${currentDate}\\par}
{\\qr Đơn này được tạo tự động bởi Trợ lý tạo đơn xin nghỉ phép\\par}
}`;
  }

  // Xuất dưới dạng text file
  static exportToText(content: string, filename: string = 'don-xin-nghi-phep.txt') {
    try {
      const currentDate = new Date().toLocaleDateString('vi-VN');
      const textContent = `ĐƠN XIN NGHỈ PHÉP
Được tạo bởi Trợ lý AI - ${currentDate}

${content}

---
Ngày tạo: ${currentDate}
Đơn này được tạo tự động bởi Trợ lý tạo đơn xin nghỉ phép`;

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Lỗi khi xuất text:', error);
      throw error;
    }
  }
}
