import React, { useState, useLayoutEffect } from "react";
import { Link } from "@material-ui/core";
import "../../css/Sidebar.css";

function Sidebar({ items, offset = 105 }) {
  const [activeLink, setActiveLink] = useState(items[0].id);

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
            <Link href={"#" + id}>
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
