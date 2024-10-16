import React from 'react'

const StatisticsCard = ({Statsdata}) => {
    let bg=`icon icon-shape bg-gradient-${Statsdata?.icon_bg} shadow-${Statsdata?.icon_bg} text-center rounded-circle`;
  return (
    <>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-8">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">{Statsdata?.heading}</p>
                    <h5 className="font-weight-bolder">
                    {Statsdata?.number}
                    </h5>
                    <p className="mb-0">
                    {Statsdata.profit ?
                      (<span className="text-success text-sm font-weight-bolder"> +{Statsdata?.performance}%</span>)
                    :
                    (<span className="text-danger text-sm font-weight-bolder"> -{Statsdata?.performance}%</span>)
                    }
                     {" "} {Statsdata?.message}
                    </p>
                  </div>
                </div>
                <div className="col-4 text-end">
                    {
                        
                  <div className={bg}>
                    <i className={`${Statsdata?.icon} text-lg opacity-101 aria-hidden="true"`}></i>
                  </div>
                    }   
                </div>
              </div>
            </div>
          </div>
        </div>
    </>

  )
}

export default StatisticsCard
