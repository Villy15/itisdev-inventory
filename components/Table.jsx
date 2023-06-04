
const Table = ({ingredients}) => {
    function getTableHeaders() {
        if (ingredients.length === 0) {
          return null;
        }

        console.log(ingredients);
    
        const ingredientKeys = Object.keys(ingredients[0]);
        return ingredientKeys.map((key) => (
          <th key={key}>{key}</th>
        ));
      }
    
      function getTableData() {
        return ingredients.map((ingredient) => (
          <tr key={ingredient.id}>
            {Object.values(ingredient).map((value, index) => (
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