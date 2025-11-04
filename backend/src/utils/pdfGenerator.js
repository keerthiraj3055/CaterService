const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoicePDF(invoiceData, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${invoiceData.orderId}`);
  doc.text(`Date: ${invoiceData.date}`);
  doc.text(`Customer: ${invoiceData.customer}`);
  doc.text(`Total: $${invoiceData.total}`);
  doc.moveDown();
  doc.text('Items:');
  invoiceData.items.forEach(item => {
    doc.text(`- ${item.name} x${item.quantity} ($${item.price})`);
  });

  doc.end();
}

module.exports = generateInvoicePDF;
