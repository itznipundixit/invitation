'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateInvitation } from '@/types/invitation';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient({
  initialInvitations,
}: {
  initialInvitations: DateInvitation[];
}) {
  const [invitations, setInvitations] = useState<DateInvitation[]>(initialInvitations);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Clear selection when page changes
    setSelectedIds([]);
  }, [currentPage]);


  const itemsPerPage = 10;
  
  // Calculate stats
  const total = invitations.length;
  const accepted = invitations.filter(i => i.accepted).length;
  const confirmed = invitations.filter(i => i.final_confirmed).length;

  // Pagination logic
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvitations = invitations.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setInvitations(invitations.filter(inv => inv.id !== id));
        // If we deleted the last item on the current page, go back a page
        if (paginatedInvitations.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        router.refresh();
      } else {
        alert('Failed to delete invitation');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedInvitations.map(inv => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} invitations?`)) return;
    
    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/invitations/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      
      if (res.ok) {
        setInvitations(invitations.filter(inv => !selectedIds.includes(inv.id)));
        setSelectedIds([]);
        
        // Adjust pagination if we deleted all items on the current page
        const remainingOnPage = paginatedInvitations.length - selectedIds.length;
        if (remainingOnPage <= 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        router.refresh();
      } else {
        alert('Failed to delete invitations');
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('An error occurred while bulk deleting');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDownloadReceipt = (inv: DateInvitation) => {
    const status = inv.final_confirmed ? 'Confirmed' : inv.accepted ? 'Accepted' : 'Pending';
    const statusClass = inv.final_confirmed ? 'status-confirmed' : inv.accepted ? 'status-accepted' : 'status-pending';
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <title>Receipt - ${inv.id.slice(0,8)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #111827;
          background-color: #f9fafb;
          padding: 40px;
          margin: 0;
          line-height: 1.5;
        }
        .receipt-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #ec4899, #be185d);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 15px; }
        .content { padding: 40px 30px; }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px dashed #e5e7eb;
        }
        .detail-row:last-of-type { border-bottom: none; }
        .detail-label { color: #6b7280; font-weight: 500; font-size: 15px; }
        .detail-value { font-weight: 600; color: #111827; font-size: 15px; text-align: right; }
        .status-badge {
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          display: inline-block;
        }
        .status-confirmed { background: #fce7f3; color: #9d174d; }
        .status-accepted { background: #d1fae5; color: #065f46; }
        .status-pending { background: #f3f4f6; color: #374151; }
        
        .agreement {
          margin-top: 40px;
          background: #fff1f2;
          border: 1px solid #ffe4e6;
          border-radius: 12px;
          padding: 24px;
        }
        .agreement h3 {
          margin: 0 0 12px;
          color: #be123c;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .agreement p { margin: 0; color: #9f1239; font-size: 15px; line-height: 1.6; }
        .highlight-fee { font-size: 18px; font-weight: 700; background: #be123c; color: white; padding: 2px 8px; border-radius: 4px; }
        
        .footer {
          text-align: center;
          padding: 24px;
          color: #9ca3af;
          font-size: 14px;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
        }
        
        @media print {
          body { background-color: #ffffff; padding: 0; }
          .receipt-container { box-shadow: none; max-width: 100%; border: none; }
          .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .agreement { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .status-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .highlight-fee { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>Booking Receipt</h1>
            <p>Reference ID: #${inv.id.slice(0,8).toUpperCase()}</p>
          </div>
          <div class="content">
            <div class="detail-row">
              <span class="detail-label">Date Issued</span>
              <span class="detail-value">${new Date().toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <span class="status-badge ${statusClass}">${status}</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Plan Day</span>
              <span class="detail-value">${inv.selected_day || 'Not selected'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${inv.selected_time || 'Not selected'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Food Choice</span>
              <span class="detail-value" style="text-transform: capitalize;">${inv.food_choice || 'Not selected'}</span>
            </div>

            <div class="agreement">
              <h3>⚠️ Cancellation Agreement</h3>
              <p>By confirming this invitation, you agree to our terms and conditions. If this reservation is cancelled, a cancellation fee of <span class="highlight-fee">₹499</span> will be charged to the original payment method. Please ensure you are available on the selected date and time.</p>
            </div>
          </div>
          <div class="footer">
            Thank you for your response! Keep this receipt for your records.
          </div>
        </div>
        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups to download the receipt.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Invitations</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Accepted</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{accepted}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Final Confirmed</h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">{confirmed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recent Responses</h2>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isBulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    onChange={handleSelectAll}
                    checked={paginatedInvitations.length > 0 && selectedIds.length === paginatedInvitations.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInvitations.length > 0 ? (
                paginatedInvitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => handleSelect(inv.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isMounted ? new Date(inv.created_at).toLocaleString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inv.final_confirmed ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">Confirmed</span>
                      ) : inv.accepted ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.selected_day || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.selected_time || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.food_choice || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <Link href={`/admin/invitations/${inv.id}`} className="text-pink-600 hover:text-pink-900">
                          View
                        </Link>
                        <button
                          onClick={() => handleDownloadReceipt(inv)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Receipt
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          disabled={isDeleting === inv.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isDeleting === inv.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No invitations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, total)}</span> of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
