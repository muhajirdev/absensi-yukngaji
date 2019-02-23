import React, { useState, useEffect, useRef } from "react";
import { Router } from "@reach/router";

import Layout from "../components/layout";
import Absensi from "../components/absensi";

export default function() {
  return (
    <Router>
      <Absensi path="/kajian/:id" />
    </Router>
  );
}
