import React, { useState, useEffect, useRef } from "react";
import { getFirebaseApp } from "../firebase";
import { doc, docData } from "rxfire/firestore";

import Layout from "../components/layout";
import { useSpring, animated, config, useChain } from "react-spring";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Grid, Row, Col, Box, Typography } from "@smooth-ui/core-sc";

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
  const refKajian = app
    .firestore()
    .collection("kajian")
    .doc(props.id);

  docData(refKajian).subscribe(data => {
    setKajian(data.title);
    setRegional(data.regional);
  });
  return (
    <Grid fluid height="100vh" gutter={0}>
      <Row height="100%">
        <Col xs={4} backgroundColor="#5ac6d0" gutter={10}>
          <Logo />
          <Typography variant="h2" color="white">
            {kajian}
          </Typography>
        </Col>
        <Col xs={8} gutter={0}>
          <Form id={props.id} />
        </Col>
      </Row>
    </Grid>
  );
};

const Logo = () => (
  <Box width={0.8} mx="auto">
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
  const handleSignUp = async () => {
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
    await checkIn();
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
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
    const userExist = await ref.get().then(item => item.exists);
    if (userExist) {
      await checkIn();
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

  const checkIn = () => {
    const ref = app
      .firestore()
      .collection("absensi")
      .add({
        user: email,
        kajian: props.id
      });
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
