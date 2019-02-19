import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { Grommet } from "grommet";

import Header from "./header";
import "./layout.css";

const theme = {
  font: {
    family: "Roboto",
    size: "14px",
    height: "20px"
  },
  box: {
    border: {
      radius: "10px"
    }
  },
  global: {
    colors: {
      brand: "#5ac6d0",
      surface: "#fff"
    }
  }
};

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Grommet>
          <main style={{ minHeight: "100vh", height: 0 }}>{children}</main>
        </Grommet>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
