//AnswerAlert.jsx

import * as React from "react";
import Alert from "@mui/material/Alert";

import Stack from "@mui/material/Stack";

import "./AnswerAlert.css";

export default function AnswerAlert({ severity, message, className }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2} className={className}>
      <Alert severity={severity} variant="filled" className="answer-alert">
        {message}
      </Alert>
    </Stack>
  );
}
