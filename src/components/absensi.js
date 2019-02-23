import React, { useState, useEffect, useRef } from "react";
import { getFirebaseApp } from "../firebase";
import { doc, docData } from "rxfire/firestore";

import Layout from "../components/layout";
import { useSpring, animated, config, useChain } from "react-spring";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import styled from "styled-components";

const Container = styled.div`
  ${tw`bg-primary flex justify-center items-center h-screen`};
`;
const Card = styled(animated.div)`
  ${tw`bg-surface rounded flex justify-center items-center`};
`;

const Input = styled.input`
  ${tw`w-full border-none bg-grey-lighter rounded py-4 px-2`};
`;

const AnimatedCard = Card.withComponent(animated.div);

export default function(props) {
  const app = getFirebaseApp();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [domisili, setDomisili] = useState("");

  const [title, setTitle] = useState("");

  const [page, setPage] = useState("login");

  useState(() => {
    const ref = app
      .firestore()
      .collection("kajian")
      .doc(props.id);
    docData(ref).subscribe(data => {
      setTitle(data.title);
    });
  }, [props.id]);

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

  const handleLogin = async () => {
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

  const handleRegister = async () => {
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

  const handleSubmit = e => {
    e.preventDefault();
    if (page === "login") {
      handleLogin();
    }
    if (page === "register") {
      handleRegister();
    }
  };
  return (
    <Layout>
      <Container>
        <h1>{title}</h1>
        <Card style={cardStyle}>
          <animated.div style={formStyle}>
            <form onSubmit={handleSubmit}>
              {page === "register" && (
                <TextField
                  variant="outlined"
                  label="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              )}
              <TextField
                variant="outlined"
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {page === "register" && (
                <>
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
                </>
              )}
              <Button type="submit">Submit</Button>
            </form>
          </animated.div>
        </Card>
      </Container>
    </Layout>
  );
}
