import React, { useContext } from "react";
import { TransactionContext } from "./context/TransactionContext";

const App = () => {
  const { value } = useContext(TransactionContext);
  console.log(value, '-----------value')
  return (
    <>
      <h1>App</h1>
    </>
  )
}

export default App;