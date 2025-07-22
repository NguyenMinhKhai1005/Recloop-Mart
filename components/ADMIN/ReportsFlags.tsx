import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchReports,
  resolveReport,
  deleteReport,
  fetchReportById,
} from "../../redux/slices/reportSlice";

const ReportDetailModal = ({ report, onClose }: { report: any; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    ></div>
    <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full z-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Report Details - ID: {report.id}</h2>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &times;
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-500">Product</h3>
          <p className="text-gray-900">{report.productTitle}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Reporter</h3>
          <p className="text-gray-900">{report.reporterName}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Reason</h3>
          <p className="text-gray-900">{report.reason}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Date</h3>
          <p className="text-gray-900">{new Date(report.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Status</h3>
          <p className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${report.isResolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {report.isResolved ? "Resolved" : "Pending"}
          </p>
        </div>
      </div>
    </div>
  </div>
);


const ReportsFlags: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { reports, selectedReport, loading, error } = useSelector(
    (state: RootState) => state.reports
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleResolve = (id: number) => {
    dispatch(resolveReport(id));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      dispatch(deleteReport(id));
    }
  };

  const handleViewDetails = (id: number) => {
    dispatch(fetchReportById(id)).then(() => {
      setIsModalOpen(true);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading && reports.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports & Flags</h1>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{report.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.productTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reporterName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${report.isResolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {report.isResolved ? "Resolved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleViewDetails(report.id)} 
                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {!report.isResolved && (
                        <button 
                          onClick={() => handleResolve(report.id)} 
                          className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                          title="Resolve"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(report.id)} 
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && selectedReport && (
        <ReportDetailModal report={selectedReport} onClose={closeModal} />
      )}
    </>
  );
};

export default ReportsFlags;
