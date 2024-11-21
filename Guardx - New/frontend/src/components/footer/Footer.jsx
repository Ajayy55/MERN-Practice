import React from 'react'

function Footer() {
  return (
    <>
        <footer className="footer">
  <div className="d-sm-flex justify-content-center justify-content-sm-between">
    <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
      Copyright © 2024{" "}
      <a href="https://www.designersx.us/" target="_blank">
        DesignersX
      </a>
      . All rights reserved.
    </span>
    <span className="text-muted float-none float-sm-end d-block mt-1 mt-sm-0 text-center">
      {" "}
      <span className="text-muted float-none float-sm-end d-block mt-1 mt-sm-0 text-center">
        {/* Hand-crafted &amp; made with <i className="mdi mdi-heart text-danger" /> */}
      </span>{" "}
      {/* <i className="mdi mdi-heart text-danger" /> */}
    </span>
  </div>
</footer>

    </>
  )
}

export default Footer
