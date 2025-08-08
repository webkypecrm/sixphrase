import React from 'react';
import { Link } from 'react-router-dom';

const ManageColumns = ({ handleManageColumns, manageColumns, manageColumnsSlider, setManageColumnsSlider }) => {

  // console.log('manageColumns =>', manageColumns)

  const manageColumnsArray = Object.keys(manageColumns);

  // console.log('manageColumnsArray =>', manageColumnsArray)

  return (
    <div className={`toggle-popup ${manageColumnsSlider ? "sidebar-popup" : ""}`}>
      <div className="sidebar-layout" style={{ maxWidth: '320px' }}>
        <div className="manage-dropdwon">
          <div className="sidebar-header">
            <h4>Manage Columns?</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => {
                setManageColumnsSlider(false)
              }}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="dropdown-menu dropdown-menu-md-end show" style={{ width: '100%' }} ></div>
          <ul>
            {manageColumnsArray.map((item, index) =>
              <li key={index}>
                <p>
                  <i className="ti ti-grip-vertical" />
                  {item}
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id={`col-${item}${index}`}
                    className="check"
                    checked={manageColumns[item]}
                    onChange={() => handleManageColumns(item)}
                  />
                  <label
                    htmlFor={`col-${item}${index}`}
                    className="checktoggle"
                  />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ManageColumns 



// const ManageColumns = ({ handleManageColumns, manageColumns }) => {
//   const manageColumnsArray = manageColumns ? Object.keys(manageColumns) : [];

//   return (
//     <ul>
//       {manageColumnsArray.map((item, index) => (
//         <li key={index}>
//           <p>
//             <i className="ti ti-grip-vertical" />
//             {item}
//           </p>
//           <div className="status-toggle">
//             <input
//               type="checkbox"
//               id={`col-${item}${index}`}
//               className="check"
//               checked={manageColumns[item]}
//               onChange={() => handleManageColumns(item)}
//             />
//             <label htmlFor={`col-${item}${index}`} className="checktoggle" />
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default ManageColumns;