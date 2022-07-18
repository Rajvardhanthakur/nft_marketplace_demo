import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const Navigation = () => {
  const { connectedAccount, connectWallet } = useContext(TransactionContext);
  return (
    <>
      <Navbar expand="lg" bg="secondary" variant="dark">
        <Container>
          <Navbar.Brand>
            <img src={"data:image/png;base64,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"} width="40" height="40" /> &nbsp; NFT Marketplace
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/create">Create</Nav.Link>
              <Nav.Link as={Link} to="/items">My Listed Items</Nav.Link>
              <Nav.Link as={Link} to="/purchases">My Purchase</Nav.Link>
            </Nav>
            <Nav>
              {
                connectedAccount ? (
                  <Nav.Link
                    href={`https://etherscan.io/address/${connectedAccount}`}
                  >
                    <Button variant="outline-ligth"> {shortenAddress(connectedAccount)}</Button>
                  </Nav.Link>
                ) : (
                  <Button onClick={connectWallet} variant="outline-light">Connect Wallet</Button>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Navigation;