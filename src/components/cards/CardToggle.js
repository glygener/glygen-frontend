import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

const expandIcon = <ExpandMoreIcon fontSize="large" />;
const closeIcon = <ExpandLessIcon fontSize="large" />;
  
  const CardToggle = ({ cardid, toggle, eventKey, toggleCollapse }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {} );
  
    return (
        <span
          onClick={() => {
            toggleCollapse(cardid, toggle)
            decoratedOnClick();
          }}
          style={{cursor:"pointer"}}
          className="gg-green arrow-btn"
        >
          <span>{toggle ? closeIcon : expandIcon}</span>
        </span>
    );
  }

  export default CardToggle;