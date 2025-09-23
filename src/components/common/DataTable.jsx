import React from 'react';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  onRowClick,
  ...props
}) => {
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-slate-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden ${className}`}>
      <table className="w-full" {...props}>
        <thead className="bg-slate-700/50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left text-sm font-medium text-slate-300 ${
                  column.className || ''
                }`}
                style={column.style}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-slate-800/30 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 text-sm ${
                    column.cellClassName || 'text-white'
                  }`}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;