import React, { useState, useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/Sidebar.css";

/**
 * Component to display sidebar links.
 **/
function Sidebar({ items, offset = 105 }) {
  const [activeLink, setActiveLink] = useState(items[0].id);

 /**
 * useEffect Hack to handle mozilla back button issue. 
 * Issue - Protein details page - site page - click browser back button and then click on sidebar link - user goes back to site page.
 **/
  useEffect(() => {
  }, [items])

   /**
   * useLayoutEffect to handle page scroll event and set active side bar link.
   **/
  useLayoutEffect(() => {
    const handleScrollEvent = () => {
      items &&
        items.map((item) => {
          var element = document.getElementById(item.id);
          if (element) {
            var elementOffsetTop = element.offsetTop;
            var winPageYOffset = window.pageYOffset;
            var elementOffsetHeight = element.offsetHeight;

            if (
              parseInt(elementOffsetTop) +
                parseInt(elementOffsetHeight) +
                parseInt(offset) >
                parseInt(winPageYOffset) &&
              parseInt(elementOffsetTop) + parseInt(offset) <
                parseInt(winPageYOffset)
            ) {
              setActiveLink(item.id);
            }
          }
        });
    };

    window.addEventListener("scroll", handleScrollEvent);
  }, [items, offset]);

  return (
    <div className="sidebar-container sidbar-top-padding">
      <div className="sidebar">
        {items.map(({ label, id }) => (
          <>
            <Link to={"#" + id}>
              <ul
                key={id}
                button
                onClick={() => setActiveLink(id)}         
                className={
                  "sidebar-item" + (activeLink === id ? " active" : "")
                }
              >
                <li className="sidebar-item-text">{label}</li>
              </ul>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
