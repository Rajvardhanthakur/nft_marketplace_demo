import React, { useContext } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { ethers } from "ethers";

import { TransactionContext } from "../context/TransactionContext";

const Home = () => {
  const { marketplaceItems, buyMarketItem } = useContext(TransactionContext);
  return (
    <>
      <div className="flex justify-center">
        {
          marketplaceItems.length > 0 ?
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {
                  marketplaceItems.map((item, index) => {
                    return (
                      <Col key={index} className="overflow-hidden">
                        <Card>
                          <Card.Img variant="top" src={item?.image} />
                          <Card.Body color="secondary">
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                              {item.description}
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <div className="d-grid">
                              <Button onClick={() => { buyMarketItem(item) }} variant="primary" size="lg">
                                Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                              </Button>
                            </div>
                          </Card.Footer>
                        </Card>
                      </Col>
                    )
                  })
                }
              </Row>
            </div>
            :
            (
              <main style={{ padding: '1rem 0' }}>
                <h2>No listed assets</h2>
              </main>
            )
        }
      </div>
    </>
  )
}

export default Home;