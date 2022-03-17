import React from 'react';
import { Dialog } from "@material-ui/core";
import Iframe from "react-iframe";
import { GLYGEN_BASENAME, GLYGEN_DOMAIN } from "../../envVariables";

// var perf =require('../../GlycoGlyphPublic/public/index_relative.html');

const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;

// import Page from '../../GlycoGlyphPublic/public/index_relative.html';
// var htmlDoc = {__html: Page};

const GlycoGlyph = (props) => {

    return (
        
        <Dialog
            open={props.show}
            fullScreen
            // maxWidth={'lg'}
            // classes= {{
            //     paper: "alert-dialog",
            // }}
            style={{margin:40}}
            disableScrollLock
            onClose={() => {
                // setSuperSearchQuerySelect(props.superSearchQuerySelect);
                props.setOpen(false);
            }} 
        >  
        <Iframe
            width="100%"
            height="100%"
            src={ GLYGEN_DOMAIN + basename + '/GlycoGlyphPublic/public/index_relative.html'}
            // src={ GLYGEN_DOMAIN + basename + '/GlycoGlyphPublic/public/index.html'}
            // src={ GLYGEN_DOMAIN + basename + '/GlycoGlyphPublic/public/index-min.html'}
            frameBorder="0"
            scrolling="no"
            allow="encrypted-media"
            allowFullScreen={false}>
        </Iframe>

     {/* <div dangerouslySetInnerHTML={{__html: '<div class="ext">Hello!</div>'}}/> */}
     </Dialog>
)};


export default GlycoGlyph;