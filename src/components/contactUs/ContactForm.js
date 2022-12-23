import React from "react";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
// import { createStyles, makeStyles } from '@mui/styles';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "react-bootstrap/Button";
import { useState } from "react";
// import { getJson } from '../data/api';
import { postTo } from "../../data/api";
import { validateEmail, replaceSpecialCharacters } from "../../utils/common";
import { Typography } from "@mui/material";
import { axiosError } from "../../data/axiosError";
import { logActivity } from "../../data/logging";
import "../../css/Search.css";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';


// const useStyles = makeStyles((theme) =>
// 	createStyles({
// 		formControl: {
// 			margin: theme.spacing(1),
// 			minWidth: 120,
// 		},
// 	})
// );

const ContactForm = (props) => {
  // const classes = useStyles();

  // const [contactUsData, setContactUsData] = useReducer(
  // 	(state, newState) => ({ ...state, ...newState }),
  // 	{
  // 		fname: '',
  // 		lname: '',
  // 		email: '',
  // 		message: '',
  // 	}
  // );

  // const [contactUsValidated, setContactUsValidated] = useReducer(
  // 	(state, newState) => ({ ...state, ...newState }),
  // 	{
  // 		fname: false,
  // 		lname: false,
  // 		email: false,
  // 		message: false,
  // 		form: false,
  // 	}
  // );

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [subject, setSubject] = useState("general");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [fNameValidated, setFNameValidated] = useState(false);
  const [lNameValidated, setLNameValidated] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [messageValidated, setMessageValidated] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [contactUsResponseMessage, setContactUsResponseMessage] = useState("");

  const [contactUsErrorMessage, setContactUsErrorMessage] = useState("");

  const messageMaxLen = 2400;
  const [messageCharsLeft, setMessageCharsLeft] = useState(messageMaxLen);

  // const inputLabel = useRef(null);
  const handleChange = (event) => {
    setSubject(event.target.value);
    setContactUsResponseMessage();
    setContactUsErrorMessage();
  };

  const handleWordCount = (e) => {
    const charCount = e.target.value.length;
    const charLength = messageMaxLen - charCount;
    setMessageCharsLeft(charLength);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContactUsResponseMessage();
    setContactUsErrorMessage();

    const formData = {
      fname: fname,
      lname: lname,
      email: email,
      subject: subject,
      message: escape(replaceSpecialCharacters(message)),
    };
    const url = `/auth/contact?query=${JSON.stringify(formData)}`;
    // const url = `/auth/contact?query=${JSON.stringify(contactUsData)}`;
    const myHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    postTo(url, myHeaders)
      .then((response) => {
        logActivity("user", "", "Message sent from contact us page.");
        setContactUsResponseMessage("We have received your message and will make every effort to respond to you within a reasonable amount of time."); //decodeURIComponent()
        //setContactUsData({fname: '', lname: ''})
        setFName("");
        setLName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setMessageCharsLeft(`${messageMaxLen}`);
        setFormValidated(false);
        setFNameValidated(false);
        setLNameValidated(false);
        setEmailValidated(false);
        setMessageValidated(false);
        setSubject("general");
      })
      .catch((error) => {
        setContactUsErrorMessage(
          "Oops, something went wrong! We did not receive your message. Please try again later."
        );
        axiosError(error, "", "Contact us api call.");
      });

  };

  // Allows to type in only text and "-".
  const onlyText = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z-]/g, "");
  };

  return (
    <>
      {/* Contact Us Right */}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h4>Send Message</h4>
        <p>We'd love to hear from you.</p>
        <Row>
          <Col sm={12} md={6} lg={6}>
            <Typography>
              <strong>First name * </strong>
            </Typography>
            <OutlinedInput
              id="outlined-full-width"
              required
              // label='First name'
              type="text"
              name="fname"
              value={fname}
              placeholder="Please enter your first name."
              error={(formValidated || fNameValidated) && fname === ""}
              onChange={(e) => {
                setFName(e.target.value);
                setContactUsResponseMessage();
                setContactUsErrorMessage();
              }}
              onBlur={() => setFNameValidated(true)}
              // helperText={
              //   (formValidated || fNameValidated) && fname === "" && "First name is required."
              // }
              onInput={(e) => onlyText(e)}
              style={{ margin: "5px 0 0 0" }}
              classes={{
								input: 'input-auto',
						  }}
              fullWidth
              margin="dense"
              variant="outlined"
              inputProps={{
                maxLength: 64,
              }}
            />
            {(formValidated || fNameValidated) && (fname === "") && (
              <FormHelperText error>
                {"First name is required."}
              </FormHelperText>
            )}
          </Col>
          <Col sm={12} md={6} lg={6}>
            <Typography>
              <strong>Last name *</strong>
            </Typography>
            <OutlinedInput
              id="outlined-full-width"
              required
              type="text"
              name="lname"
              value={lname}
              placeholder="Please enter your last name."
              error={(formValidated || lNameValidated) && lname === ""}
              onChange={(e) => {
                setLName(e.target.value);
                setContactUsResponseMessage();
                setContactUsErrorMessage();
              }}
              onBlur={() => setLNameValidated(true)}
              // helperText={
              //   (formValidated || lNameValidated) && lname === "" && "Last name is required."
              // }
              onInput={(e) => onlyText(e)}
              style={{ margin: "5px 0 0 0" }}
              classes={{
								input: 'input-auto',
						  }}
              fullWidth
              margin="dense"
              variant="outlined"
              inputProps={{
                maxLength: 64,
              }}
            />
            {(formValidated || lNameValidated) && (lname === "") && (
              <FormHelperText error>
                {"Last name is required."}
              </FormHelperText>
            )}
          </Col>
          <Col sm={12} md={6} lg={6}>
            <Typography>
              <strong>Subject</strong>
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={subject}
                fullWidth
                margin="dense"
                style={{ margin: "5px 0 0 0" }}
                classes={{
                  select: "select-menu-adv"
                }}
                onChange={handleChange}
              >
                <MenuItem value={"general"}>General comment</MenuItem>
                <MenuItem value={"technical"}>Technical issue</MenuItem>
                <MenuItem value={"help"}>Need help</MenuItem>
                <MenuItem value={"requestQuick"}>Request new quick search</MenuItem>
                <MenuItem value={"shareData"}>Share my data</MenuItem>
                <MenuItem value={"dataIssue"}>Report data issue</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col sm={12} md={6} lg={6}>
            <Typography>
              <strong>Email *</strong>
            </Typography>
            <OutlinedInput
              id="email"
              required
              // label='Email'
              type="email"
              name="email"
              value={email}
              style={{ margin: "5px 0 0 0" }}
              classes={{
								input: 'input-auto',
						  }}
              placeholder="example@domain.com"
              error={(formValidated || emailValidated) && !validEmail}
              onChange={(e) => {
                var emailVal = e.target.value;
                setValidEmail(validateEmail(emailVal));
                setEmail(emailVal); //setContactUsData({email: emailVal})
                setContactUsResponseMessage();
                setContactUsErrorMessage();
              }}
              onBlur={() => setEmailValidated(true)}
              // helperText={
              //   (formValidated || emailValidated) && !validEmail && "Please enter a valid email."
              // }
              fullWidth
              margin="dense"
              size="medium"
              // InputLabelProps={{
              // 	shrink: true,
              // 	style: { fontWeight: '900' },
              // }}
              variant="outlined"
              inputProps={{
                maxLength: 128,
              }}
            />
          {(formValidated || emailValidated) && !validEmail && (
            <FormHelperText error>
              {"Please enter a valid email."}
            </FormHelperText>
          )}
          </Col>
          <Col>
            <Typography>
              <strong>Message *</strong>
            </Typography>
            <OutlinedInput
              id="outlined-full-width"
              required
              // label='Message'
              name="message"
              value={message}
              type="text"
              style={{ margin: "5px 0 0 0" }}
              placeholder="Please tell us how we can help you."
              error={
                (formValidated || messageValidated) &&
                (message === "" || message.length < 5 || message.length > messageMaxLen)
              }
              onChange={(e) => {
                setMessage(e.target.value);
                setContactUsResponseMessage();
                setContactUsErrorMessage();
                handleWordCount(e);
              }}
              onBlur={() => setMessageValidated(true)}
              // helperText={
              //   (formValidated || messageValidated) &&
              //   ((message === "" && "Please leave us a message.") ||
              //     ((message.length < 5 || message.length > messageMaxLen) &&
              //       `Message should be between 5 to ${messageMaxLen} characters`))
              // }
              fullWidth
              multiline
              rows="3"
              margin="normal"
              // InputLabelProps={{
              // 	shrink: true,
              // 	style: { fontWeight: '900' },
              // }}
              variant="outlined"
              inputProps={{
                minLength: 5,
                maxLength: messageMaxLen,
              }}
            />
            {(formValidated || messageValidated) && (message === "") && (
              <FormHelperText error>
                {"Please leave us a message."}
              </FormHelperText>)}
            {(formValidated || messageValidated) && (message !== "") && (message.length < 5 || message.length > messageMaxLen) && (
              <FormHelperText error>
                {`Message should be between 5 to ${messageMaxLen} characters`}
              </FormHelperText>)}
            <div className={"text-right text-muted"} style={{ marginTop: "-5px" }}>
              {messageCharsLeft}/{messageMaxLen}
            </div>
          </Col>
        </Row>

        <div className={`alert-success ${contactUsResponseMessage ? "alert" : ""}`}>
          <strong>{contactUsResponseMessage}</strong>
        </div>
        <div className={`alert-danger ${contactUsErrorMessage ? "alert" : ""}`}>
          <strong>{contactUsErrorMessage}</strong>
        </div>
        <Button
          variant="success"
          style={{ margin: "10px 0" }}
          type="submit"
          // className={`${
          // 	!fNameValidated ||
          // 	!lNameValidated ||
          // 	!emailValidated ||
          // 	!validEmail ||
          // 	!messageValidated
          // 		? 'disabled'
          // 		: ''
          // }`}
          // size='lg'
          onClick={() => setFormValidated(true)}
          // disabled={formValidated}
          // disabled={
          // 	!fNameValidated ||
          // 	!lNameValidated ||
          // 	!emailValidated ||
          // 	!validEmail ||
          // 	!messageValidated
          // }
          // .no-drop {cursor: no-drop;}
        >
          SEND MESSAGE
        </Button>
      </form>

      <Row>
        <Col>
          <p className="text-muted">
            <strong>*</strong> These fields are required.
          </p>
        </Col>
      </Row>
    </>
  );
};
export default ContactForm;
