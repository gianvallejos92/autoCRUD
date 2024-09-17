import React, { useEffect, useState } from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/record/list/1").then(
      response => response.json()
    ).then (
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    <div>
      <table>
        <thead>
          {(typeof backendData.fields === 'undefined') ? (
            console.log('Loading')
            ) : (       
            <tr>{
              backendData.fields.map(field => (
                <th key={field.id}>{field.name}</th>
              ))
            }</tr> 
          )}
        </thead>
        <tbody>
              {
                (typeof backendData.records === 'undefined') ? (
                  console.log('Loading')
                ) : (
                  backendData.records.map(function (val) {
                    return (
                      <tr>
                        {
                          val.values.map((item, ind) => (
                            <td key={ind}>{ item.value }</td>
                          ))
                        }
                      </tr>
                    )
                  })
                )
              } 
        </tbody>
      </table>
    </div>
  );
}

export default App;
