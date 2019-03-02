import React, { useState, useEffect, useRef } from "react";
import { getFirebaseApp } from "../firebase";
import { doc, docData } from "rxfire/firestore";

import Layout from "../components/layout";
import { useSpring, animated, config, useChain } from "react-spring";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Grid, Row, Col, Box, Typography } from "@smooth-ui/core-sc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";

const Container = styled.div`
  ${tw`bg-primary flex justify-center items-center h-screen`};
`;
const Card = styled(animated(Paper))`
  ${tw`bg-surface rounded flex justify-center items-center`};
`;

const app = getFirebaseApp();

export default props => {
  const [kajian, setKajian] = useState();
  const [regional, setRegional] = useState();
  const [locationName, setLocationName] = useState();
  const [speakers, setSpeakers] = useState([]);
  const refKajian = app
    .firestore()
    .collection("kajian")
    .doc(props.id);

  useState(() => {
    docData(refKajian).subscribe(data => {
      setKajian(data.title);
      setRegional(data.regional);
      setLocationName(data.locationName);
      setSpeakers(data.speakers);
    });
  }, []);

  return (
    <Grid fluid height="100vh" gutter={0}>
      <ToastContainer autoClose={2000} />
      <Row height="100%">
        <Col xs={4} backgroundColor="#5ac6d0" gutter={10}>
          <Box mx="auto" width="75%">
            <Logo />
            <Typography variant="h2" color="white">
              {kajian}
            </Typography>
            <Typography variant="h2" color="white">
              {regional}
            </Typography>
            <Typography variant="h2" color="white">
              {locationName}
            </Typography>
            {speakers.map(speaker => (
              <Typography key={speaker} variant="h5" color="white">
                {speaker}
              </Typography>
            ))}
          </Box>
        </Col>
        <Col xs={8} gutter={0}>
          <Form id={props.id} />
        </Col>
      </Row>
    </Grid>
  );
};

const Logo = () => (
  <Box mx="auto">
    <img src={require("../images/logoYukNgaji.jpg")} />
  </Box>
);

const SignUpForm = ({
  name,
  setName,
  email,
  setEmail,
  domisili,
  setDomisili,
  phone,
  setPhone,
  checkIn,
  resetState
}) => {
  const handleSignUp = async e => {
    e.preventDefault();
    const ref = app
      .firestore()
      .collection("users")
      .doc(email);
    await ref.set({
      name,
      email,
      domisili,
      phone
    });
    await checkIn({ firstTime: true });
    resetState();
  };
  return (
    <form onSubmit={handleSignUp}>
      <TextField
        variant="outlined"
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        variant="outlined"
        label="Nomor HP"
        onChange={e => setPhone(e.target.value)}
        value={phone}
      />
      <TextField
        variant="outlined"
        label="Domisili"
        value={domisili}
        onChange={e => setDomisili(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
const LoginForm = ({ setPage, setEmail, email, resetState, checkIn }) => {
  const handleLogin = async e => {
    e.preventDefault();
    const ref = app
      .firestore()
      .collection("users")
      .doc(email);
    const user = await ref.get();
    if (user.exists) {
      await checkIn({ firstTime: false });
      resetState();
    } else {
      setPage("register");
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <TextField
        variant="outlined"
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </form>
  );
};

export function Form(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [domisili, setDomisili] = useState("");

  const [page, setPage] = useState("login");

  const cardRef = useRef();
  const formRef = useRef();
  const cardStyle = useSpring({
    ref: cardRef,
    config: config.stiff,
    from: {
      opacity: 0,
      width: "40em",
      height: "10em"
    },
    to: {
      opacity: 1,
      height: "20em",
      width: "50em"
    }
  });
  const formStyle = useSpring({
    ref: formRef,
    from: {
      opacity: 0,
      top: -10,
      position: "relative"
    },
    to: {
      opacity: 1,
      top: 0
    }
  });
  useChain([cardRef, formRef], [0, 0.3]);

  const resetState = () => {
    setEmail("");
    setDomisili("");
    setName("");
    setPhone("");
    setPage("login");
  };

  const checkIn = ({ firstTime }) => {
    const ref = app
      .firestore()
      .collection("absensi")
      .add({
        user: email,
        kajian: props.id,
        firstTime
      })
      .then(() => toast("Absen berhasil"));
  };

  return (
    <Layout>
      <Container>
        <Card style={cardStyle}>
          {page === "login" ? (
            <LoginForm
              setEmail={setEmail}
              setPage={setPage}
              email={email}
              resetState={resetState}
              checkIn={checkIn}
            />
          ) : (
            <SignUpForm
              setEmail={setEmail}
              email={email}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              domisili={domisili}
              setDomisili={setDomisili}
              resetState={resetState}
              checkIn={checkIn}
              setPage={setPage}
            />
          )}
        </Card>
      </Container>
    </Layout>
  );
}
