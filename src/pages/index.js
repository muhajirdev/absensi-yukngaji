import React, { useState, useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";

import Layout from "../components/layout";
import { useSpring, animated, config, useChain } from "react-spring";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";
import { OutlinedInput, InputLabel } from "@material-ui/core";

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
const AnimatedForm = animated(Form);

export default function() {
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
  return (
    <Layout>
      <Container>
        <Card style={cardStyle}>
          <animated.div style={formStyle}>
            <AnimatedForm />
          </animated.div>
        </Card>
      </Container>
    </Layout>
  );
}

function Form(props) {
  return (
    <div style={{ display: "flex-col", ...props.style }}>
      <Grid container justify="center" alignItems="center" spacing={16}>
        <Grid item>
          <TextField variant="outlined" label="Email" />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
