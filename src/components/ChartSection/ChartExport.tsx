import { memo, useCallback } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Record } from "../../types/manageSalaryTypes/records";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExportHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .header-icon {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ExportButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? 'white' : theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary : theme.colors.borderLight};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  .button-icon {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

interface ChartExportProps {
  records: Record[];
  chartType: 'in' | 'out';
  dateRange: { from: string; to: string };
}

const ChartExport = memo(({
  records,
  chartType,
  dateRange
}: ChartExportProps) => {
  const exportToCSV = useCallback(() => {
    try {
      // Prepare CSV data
      const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
      const csvData = [
        headers,
        ...records.map(record => [
          record.date,
          record.description,
          record.tag.name,
          record.amount,
          record.type
        ])
      ];

      // Convert to CSV string
      const csvContent = csvData
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `financial-data-${chartType}-${dateRange.from}-to-${dateRange.to}.csv`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  }, [records, chartType, dateRange]);

  const exportToPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF();

      // Add title
      pdf.setFontSize(20);
      pdf.text(`${chartType === 'in' ? 'Income' : 'Expense'} Report`, 20, 20);

      // Add date range
      pdf.setFontSize(12);
      pdf.text(`Period: ${dateRange.from} to ${dateRange.to}`, 20, 35);

      // Add summary
      const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);
      pdf.text(`Total: $${totalAmount.toLocaleString()}`, 20, 45);
      pdf.text(`Transactions: ${records.length}`, 20, 55);

      // Prepare table data
      const tableData = records.map(record => [
        record.date,
        record.description,
        record.tag.name,
        `$${Number(record.amount).toLocaleString()}`,
        record.type
      ]);

      // Add table
      (pdf as any).autoTable({
        head: [['Date', 'Description', 'Category', 'Amount', 'Type']],
        body: tableData,
        startY: 70,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Download PDF
      pdf.save(`financial-report-${chartType}-${dateRange.from}-to-${dateRange.to}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }, [records, chartType, dateRange]);

  return (
    <ExportContainer>
      <ExportHeader>
        <FontAwesomeIcon icon={faDownload} className="header-icon" />
        Export Data
      </ExportHeader>

      <ExportButtons>
        <ExportButton onClick={exportToCSV}>
          <FontAwesomeIcon icon={faFileCsv} className="button-icon" />
          Export CSV
        </ExportButton>

        <ExportButton variant="primary" onClick={exportToPDF}>
          <FontAwesomeIcon icon={faFilePdf} className="button-icon" />
          Export PDF
        </ExportButton>
      </ExportButtons>
    </ExportContainer>
  );
});

ChartExport.displayName = 'ChartExport';

export default ChartExport;