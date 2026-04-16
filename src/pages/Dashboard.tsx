import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Defining our data interface
interface User {
  id: number;
  name: string;
  role: string | null;
  status: 'Active' | 'Inactive';
}



const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="animate-fade-in p-2">

      <div className="bg-white dark:bg-sidebar rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 flex justify-between flex-wrap gap-4 items-center bg-white dark:bg-sidebar">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sm" fontSize="small" />
            <input
              type="text"
              placeholder="Search by name, role or status"
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-64 md:w-80 outline-none focus:border-primary transition-colors"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors shadow-sm text-sm font-medium">
            <AddIcon fontSize="small" /> Add
          </button>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-6 py-3 text-sm font-medium w-20">S.No</th>
                <th className="px-6 py-3 text-sm font-medium border-l border-white/10">User Name <span className="float-right text-gray-400">↓↑</span></th>
                <th className="px-6 py-3 text-sm font-medium border-l border-white/10">Role <span className="float-right text-gray-400">↓↑</span></th>
                <th className="px-6 py-3 text-sm font-medium border-l border-white/10">Status <span className="float-right text-gray-400">↓↑</span></th>
                <th className="px-6 py-3 text-sm font-medium border-l border-white/10 text-center w-32">Actions</th>
              </tr>
              {/* Green bottom border line from design */}
              <tr>
                <th colSpan={5} className="h-1 bg-primary p-0"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-text-muted">Loading data...</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-text-muted text-center">{user.id}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-text-main">{user.name}</td>
                    <td className="px-6 py-3.5 text-sm text-text-muted">{user.role}</td>
                    <td className="px-6 py-3.5 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.status === 'Active'
                          ? 'bg-green-50 text-primary border-green-200 dark:bg-green-900/10 dark:border-green-800'
                          : 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button className="px-4 py-1 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 dark:bg-sidebar dark:border-gray-700 dark:hover:bg-gray-800 text-text-main transition-colors shadow-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-text-muted">
          <div>Showing 1 to {users.length} of {users.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Prev</button>
            <button className="px-3 py-1 bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
