import * as React from "react";
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css'
import App from "./frontend/App";
import { TransactionProvider } from "./frontend/context/TransactionContext";

const rootElement = document.getElementById("root");
ReactDOM.render(<TransactionProvider><App /></TransactionProvider>, rootElement);