import React from 'react'

function ProductsListCard() {
  return (
    <>

<tr>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div>
                        <img
                          src="../assets/img/team-2.jpg"
                          className="avatar avatar-sm me-3"
                          alt="user1"
                        />
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">John Michael</h6>
                        <p className="text-xs text-secondary mb-0">
                          john@creative-tim.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs font-weight-bold mb-0">Electronics</p>
                    <p className="text-xs text-secondary mb-0">Mobile</p>
                  </td>
                  <td>
                    <p className="text-xs text-secondary mb-0">breathable</p>
                    <p className="text-xs text-secondary mb-0">Soft</p>
                  </td>
                  <td className="align-middle text-sm">
                    <span className="badge badge-sm bg-gradient-warning">
                      Available
                    </span>
                  </td>
                  <td className="align-middle">
                    <span className="text-secondary text-xs font-weight-bold">
                      23/04/18
                    </span>
                  </td>
                  <td className="align-middle">
                    <span className="text-secondary text-xs font-weight-bold">
                      1499
                    </span>
                  </td>
                  <td className="align-middle">
                    <a
                      href=""
                      className="text-secondary font-weight-bold text-xs"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                    >
                      Edit 
                    </a> | 
                    <a
                      href=""
                      className="text-secondary font-weight-bold text-xs"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                    >
                      View 
                    </a>
                  </td>
                </tr>

    </>
  )
}

export default ProductsListCard
