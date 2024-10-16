import React, { useState } from "react";
import "./Nav.css";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';

function Navbar() {
  const [navbar,setNavbar]=useState(false);

  const navItems = [
    {
      id: 1,
      element: "Home",
      url: "hero",
    },
    {
      id: 2,
      element: "Features",
      url: "features",
    },
    {
      id: 3,
      element: "Overview",
      url: "overview",
    },
    {
      id: 4,
      element: "pricing",
      url: "pricing",
    },
    {
      id: 5,
      element: "Team",
      url: "team",
    },
    {
      id: 6,
      element: "Blog",
      url: "blog",
    },
    {
      id: 5,
      element: "Contact",
      url: "contact",
    },
  ];

  const changeNav=()=>{
    if(window.scrollY>0){
      setNavbar(true)
    }else{
      setNavbar(false)
    }
  }

  window.addEventListener('scroll',changeNav)

  return (
    <>
      <div className={navbar?'nav-container active' : 'nav-container'}> 
        <div className="container ">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-12 ">
              <nav className=" navbar navbar-expand-lg">
                <a className="nav-brand ">
                  <img
                    src={navbar?'https://preview.uideck.com/items/appvilla/assets/images/logo/logo.svg  ':'https://preview.uideck.com/items/appvilla/assets/images/logo/white-logo.svg'}
                    className="logo-img"
                  />
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button> 
                <div
                  className="collapse navbar-collapse   justify-content-center
" 
                  id="navbarSupportedContent"
                ><div className="">
                  <ul className="navbar-nav  me-auto mb-2 mb-lg-0 ">
                    {navItems.map((el, index) => {
                      return (
                        <li className="nav-item " key={index}>
                          <Link
                            className={navbar? 'nav-link na-1 active bold' :'nav-link na-1' }
                            aria-current="page"
                            to={el.url}
                            spy={true}
                            smooth={true}
                            offset={50}
                            duration={500}
                          >
                            {el.element}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  </div>
                </div>
                <button className=" btn-nav btn btn border-light " type="submit">
                  Get It Now
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      

    </>
  );
}

export default Navbar;
