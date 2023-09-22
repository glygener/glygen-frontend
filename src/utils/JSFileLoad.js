import { useEffect } from "react";
import PropTypes from "prop-types";

export default function JSFileLoad(src) {
    useEffect(() => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }, [src])
}

JSFileLoad.propTypes = {
    src: PropTypes.string,
};
