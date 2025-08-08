import React, { useState } from "react";
import { Table } from "antd";

const DataTable = ({
  dataSource,
  columns,
  onSelectionChange,
  pageSize = 50,
  totalPages = 15,
  onFetchRecord,
  disableSelection,
  pagination = true,
  rowClassName,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange(newSelectedRowKeys);
  };

  const rowSelection = disableSelection
    ? null // Disable row selection
    : {
        selectedRowKeys,
        onChange: onSelectChange,
      };

  return (
    <Table
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      rowClassName={rowClassName}
      columns={columns}
      dataSource={dataSource}
      // pagination={{
      //   pageSize: pageSize,
      //   total: totalPages,
      //   showSizeChanger: false,
      //   onChange: (page) => {
      //     onFetchRecord(page)
      //   }
      // }}
      pagination={
        pagination
          ? {
              pageSize: pageSize,
              total: totalPages,
              showSizeChanger: false,
              onChange: (page) => {
                onFetchRecord(page);
              },
            }
          : false // ✅ DISABLE pagination if passed as false
      }
      // Assuming `id` is the unique identifier of each record
    />
  );
};

export default DataTable;
