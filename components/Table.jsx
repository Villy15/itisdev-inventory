
const Table = ({data}) => {
    function getTableHeaders() {
        if (data.length === 0) {
          return null;
        }

        console.log(data);
    
        const dataKeys = Object.keys(data[0]);
        return dataKeys.map((key) => (
          <th key={key}>{key}</th>
        ));
      }
    
      function getTableData() {
        return data.map((data) => (
          <tr key={data.id}>
            {Object.values(data).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ));
      }
      
    return (
        <table>
            <thead>
                <tr>
                    {getTableHeaders()}
                </tr>
            </thead>
            <tbody>
                {getTableData()}
            </tbody>
        </table>
    )
}

export default Table