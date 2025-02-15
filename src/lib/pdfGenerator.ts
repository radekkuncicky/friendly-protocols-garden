
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';
import { Protocol } from "@/types/protocol";

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

export const generatePDF = async (protocol: Protocol) => {
  // Initialize jsPDF
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Add header
  doc.setFontSize(20);
  doc.text(`Protokol č. ${protocol.protocol_number}`, 20, 20);
  
  // Add client info
  doc.setFontSize(12);
  doc.text(`Klient: ${protocol.content.client_name || ''}`, 20, 40);
  doc.text(`Společnost: ${protocol.content.company_name || ''}`, 20, 50);
  doc.text(`Projekt: ${protocol.content.project_name || ''}`, 20, 60);
  
  let currentY = 70;

  // Add items table
  if (protocol.content.items && Array.isArray(protocol.content.items)) {
    const tableData = protocol.content.items.map((item: any) => [
      item.description,
      item.quantity,
      item.unit
    ]);
    
    doc.autoTable({
      startY: currentY,
      head: [['Popis', 'Množství', 'Jednotka']],
      body: tableData,
    });

    // Update currentY to be after the table
    currentY = (doc as any).lastAutoTable?.finalY + 20 || currentY + 20;
  }

  // Add notes if present
  if (protocol.content.notes) {
    doc.text('Poznámky:', 20, currentY);
    doc.text(protocol.content.notes, 20, currentY + 10);
    currentY += 30;
  }
  
  // Add signatures if present
  if (protocol.manager_signature) {
    doc.addImage(protocol.manager_signature, 'PNG', 20, currentY, 50, 30);
    doc.text('Podpis manažera', 20, currentY + 35);
    currentY += 40;
  }
  
  if (protocol.client_signature) {
    doc.addImage(protocol.client_signature, 'PNG', 20, currentY, 50, 30);
    doc.text('Podpis klienta', 20, currentY + 35);
  }

  // Add status watermark for completed protocols
  if (protocol.status === 'completed') {
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    // Use the correct rotation syntax for jsPDF
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.text('DOKONČENO', pageWidth/2, pageHeight/2, {
      align: 'center',
      angle: 45
    });
    doc.setTextColor(0, 0, 0);
  }
  
  return doc.output('blob');
};
