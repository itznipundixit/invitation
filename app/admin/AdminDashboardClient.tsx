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
