import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="row w-100">
            <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
              <div className="card col-lg-4 mx-auto">
                <div className="card-body px-5 py-5">
                  <h3 className="card-title text-start mb-3">Register</h3>
                  <form>
                    <div className="form-group">
                      <label>Username</label>
                      <input type="text" className="form-control p_input" />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control p_input" />
                    </div>

                    <div className="form-group">
                      <label>Mobile</label>
                      <input type="Number" className="form-control p_input" />
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control p_input" />
                    </div>

                    <div className="form-group d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <label className="form-check-label">
                          {/* <input type="checkbox" className="form-check-input" />{" "} */}{" "}
                        </label>
                      </div>
                      <a href="#" className="forgot-pass">
                        Forgot password
                      </a>
                    </div>
                    <div className="text-center d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block enter-btn"
                      >
                        Register
                      </button>
                    </div>

                    <div className="d-flex">
                      <button className="btn btn-facebook col me-2">
                        <i className="mdi mdi-facebook" /> Facebook{" "}
                      </button>
                      <button className="btn btn-google col">
                        <i className="mdi mdi-google-plus" /> Google plus{" "}
                      </button>
                    </div>
                    <p className="sign-up text-center">
                      Already have an Account?<Link to='/login'> Log In</Link>
                    </p>
                    <p className="terms">
                      By creating an account you are accepting our
                      <a href="#"> Terms &amp; Conditions</a>
                    </p>

                  </form>
                </div>
              </div>
            </div>
            {/* content-wrapper ends */}
          </div>
          {/* row ends */}
        </div>
        {/* page-body-wrapper ends */}
      </div>
    </>
  );
}

export default Signup;
