const Table = ({ data, columns, currentPage, itemsPerPage  }) => {
  function getTableHeaders() {
    if (!columns || columns.length === 0 || data.length === 0) {
      return null;
    }
    console.log("HIIIIIIIIIIII");
    console.log(data);
    console.log(columns);

    return (
      <>
        <th className="row-number">#</th>
        {columns.map((column) => (
          <th key={column.key}>{column.label}</th>
        ))}
      </>
    );
  }

  function getTableData() {
    if (!columns || columns.length === 0 || data.length === 0) {
      return null;
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
  
    return data.map((item, index) => (
      <tr key={item.id}>
        <td className="row-number">{startIndex + index + 1}</td>
        {columns.map((column) => {
          const cellData = getNestedValue(item, column.key);
          const dataType = typeof cellData;
          const className = dataType === "number" ? "row-right" : "row-left";
  
          return (
            <td key={column.key} className={className}>
              {cellData}
            </td>
          );
        })}
      </tr>
    ));
  }
  
  function getNestedValue(obj, key) {
    const keys = key.split(".");
    let value = obj;
  
    for (const nestedKey of keys) {
      if (value && typeof value === "object" && nestedKey in value) {
        value = value[nestedKey];
      } else {
        return null;
      }
    }
  
    return value;
  }
  


  return (
    <table>
      <thead>
        <tr>{getTableHeaders()}</tr>
      </thead>
      <tbody>{getTableData()}</tbody>
    </table>
  );
};

export default Table;