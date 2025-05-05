import React, { useState, useEffect, useRef } from "react";
import Drawer from '@mui/material/Drawer';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from "react-bootstrap/Button";
import { logActivity } from "../../data/logging";
import IDCart from "./IDCart";
import { useNavigate} from 'react-router-dom';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const IDCartFullScreen = props => {
  const theme = useTheme()

  const {
    open, 
    setOpen
  } = props;

  const [size, setSize] = useState("50%");

  const handleClose = () => {
    setOpen(false);
  };

  const openedMixin = (theme) => ({
    width: size,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden'
  });

  useEffect(() => {
    let message = "IDCart";
    logActivity("user", "", message);    
  }, [open]);
  const nodeRef = useRef(null);

  return (
    <>
      <React.Fragment anchor={"right"}>
        <Drawer
          anchor={"right"}
          appear={true}
          open={open}
          onClose={handleClose}
          variant="transparent"
          sx={{
            width: size,
            flexShrink: 0,
            flexDirection: "initial",
            '& .MuiDrawer-paper': openedMixin(theme),
          }}
          TransitionComponent={Transition}
          SlideProps={{
            direction: "left", in: true, timeout: 300
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div className="alert-dialog-content">
          <AppBar sx={{ position: 'relative' }} className="gg-blue">
            <Toolbar>
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                {"ID Cart"}
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          
          <div className="list-page-container" style={{ padding: "25px", width: "100%", flexDirection: "initial" }}>
            <div className={"sidebar-page-outreach"}>
              <div className="list-mainpage-container">
                  <div className="text-end pb-3" >
                    <Button
                      type="button"
                      style={{ marginLeft: "10px", paddingBottom: "5px", paddingTop: "5px" }}
                      className="gg-btn-blue"
                      onClick={() => { 
                        setSize(size === "50%" ? "100%" : "50%")
                      }}>
                        {size === "50%" ? <FullscreenIcon/> : <FullscreenExitIcon/>}
                    </Button>
                  </div>
                  <IDCart handleClose={handleClose} size={size}/>                
              </div>
            </div>
          </div>
          </div>
        </Drawer>
      </React.Fragment>
    </>);
};

export default IDCartFullScreen;