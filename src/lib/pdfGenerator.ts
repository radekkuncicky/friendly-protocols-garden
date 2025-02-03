import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

export const generatePDF = async (protocol: any) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Add header
  doc.setFontSize(20);
  doc.text(`Protokol č. ${protocol.protocol_number}`, 20, 20);
  
  // Add client info
  doc.setFontSize(12);
  doc.text(`Klient: ${protocol.content.client_name || ''}`, 20, 40);
  doc.text(`Společnost: ${protocol.content.company_name || ''}`, 20, 50);
  doc.text(`Projekt: ${protocol.content.project_name || ''}`, 20, 60);
  
  // Add items table
  const tableData = (protocol.content.items || []).map((item: any) => [
    item.description,
    item.quantity,
    item.unit
  ]);
  
  doc.autoTable({
    startY: 70,
    head: [['Popis', 'Množství', 'Jednotka']],
    body: tableData,
  });
  
  // Add signatures if present
  let currentY = (doc as any).lastAutoTable.finalY + 20;
  
  if (protocol.manager_signature) {
    doc.addImage(protocol.manager_signature, 'PNG', 20, currentY, 50, 30);
    doc.text('Podpis manažera', 20, currentY + 35);
    currentY += 40;
  }
  
  if (protocol.client_signature) {
    doc.addImage(protocol.client_signature, 'PNG', 20, currentY, 50, 30);
    doc.text('Podpis klienta', 20, currentY + 35);
  }
  
  return doc.output('blob');
};