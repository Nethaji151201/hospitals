import React, { useState } from 'react';
import Search from '../components/common/Search';
import DataTable, { type ColumnDef } from '../components/common/DataTable';
import CommonDialog from '../components/common/CommonDialog';
import Tooltip from '../components/common/Tooltip';
import DatePicker from '../components/common/DatePicker/DatePicker';
import { useSnackbar } from '../components/common/Snackbar';
import { CheckCircle, AlertTriangle, Info, BellRing } from 'lucide-react';

interface MockData {
  id: number;
  name: string;
  role: string;
  status: string;
  score: number;
}

const MOCK_DATA: MockData[] = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Manager' : 'User',
  status: i % 4 === 0 ? 'Inactive' : 'Active',
  score: Math.floor(Math.random() * 100),
}));

const COLUMNS: ColumnDef<MockData>[] = [
  { key: 'id', label: 'ID', sortable: true, minWidth: 80 },
  { key: 'name', label: 'Name', sortable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, resizable: true },
  {
    key: 'status',
    label: 'Status',
    render: (val) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {val}
      </span>
    )
  },
  { key: 'score', label: 'Score', sortable: true, align: 'right' }
];

const ComponentsDemo: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const { showSnackbar } = useSnackbar();

  const filteredData = MOCK_DATA.filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const triggerSnack = (variant: 'success' | 'error' | 'warning' | 'info') => {
    const icons = {
      success: <CheckCircle size={18} />,
      error: <AlertTriangle size={18} />,
      warning: <AlertTriangle size={18} />,
      info: <Info size={18} />
    };

    showSnackbar({
      message: `This is a ${variant} notification!`,
      variant,
      icon: icons[variant],
      showCloseButton: true,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Common Components Library</h1>
        <p className="text-gray-500 dark:text-gray-400">A demonstration of all custom, strictly-typed Tailwind CSS components.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DatePicker & Tooltip Section */}
        <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Inputs & Tooltips</h2>

          <div className="space-y-4">
            <DatePicker
              label="Select Birth Date"
              value={dateValue}
              onChange={(val) => setDateValue(val as Date)}
              placeholder="DD/MM/YYYY"
            />

            <div className="pt-4 flex flex-wrap gap-4">
              <Tooltip text="I appear on top!" placement="top" variant="info">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium">Top Tooltip</button>
              </Tooltip>
              <Tooltip text="Watch out!" placement="right" variant="error">
                <button className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium">Right Tooltip</button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Snackbars & Dialogs Section */}
        <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Overlays & Notifications</h2>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => triggerSnack('success')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm font-medium transition-colors">Success Snack</button>
            <button onClick={() => triggerSnack('error')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm font-medium transition-colors">Error Snack</button>
            <button onClick={() => triggerSnack('warning')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm font-medium transition-colors">Warning Snack</button>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md font-semibold transition-all transform active:scale-95"
            >
              <BellRing size={18} />
              Open Common Dialog
            </button>
          </div>
        </div>
      </div>

      {/* DataTable & Search Section */}
      <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Data Table Integration</h2>
          <Search
            placeholder="Search users..."
            onSearch={setSearchValue}
            width="100%"
          />
        </div>

        <DataTable
          headers={COLUMNS}
          data={filteredData}
          selectable
          zebra
          enablePagination
        />
      </div>

      {/* The Dialog */}
      <CommonDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Terms of Service"
        persistent
      >
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>This dialog is set to <strong>persistent</strong>, meaning you cannot close it by clicking outside or pressing Escape. Instead, it will shake to let you know it requires action!</p>
          <p>Please accept the terms manually by clicking the close button on the top right, or using the action buttons below.</p>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">Cancel</button>
            <button onClick={() => { triggerSnack('success'); setIsDialogOpen(false); }} className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 font-medium transition-colors">Accept Terms</button>
          </div>
        </div>
      </CommonDialog>
    </div>
  );
};

export default ComponentsDemo;
