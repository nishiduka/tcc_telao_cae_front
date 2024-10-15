import { ReactNode } from 'react';
import { Table as TableComb } from 'reactstrap';

const Table = <T extends { [key: string]: string | number | Date }>({
  headers,
  data,
}: {
  headers: {
    label: string;
    key: string | ((data: T) => string | ReactNode);
  }[];
  data: T[];
}) => {
  const renderCell = (
    item: T,
    key: string | ((data: T) => string | ReactNode)
  ) => {
    if (typeof key === 'function') {
      return key(item);
    }

    if (item[key] instanceof Date) {
      return item[key].toLocaleDateString();
    }

    return item[key];
  };

  const renderClassCenter = (index: number) => {
    if (index === 0) {
      return 'text-start';
    }

    return 'text-center';
  };

  return (
    <TableComb hover>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={header.label} className={renderClassCenter(index)}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 &&
          data.map((item: T, index: number) => (
            <tr key={index}>
              {headers.map((header, headerIndex) => (
                <td
                  key={header.label}
                  className={`align-middle ${renderClassCenter(headerIndex)}`}
                >
                  {renderCell(item, header.key)}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </TableComb>
  );
};

export default Table;
