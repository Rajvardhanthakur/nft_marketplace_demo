import React, { useContext } from 'react';
import { Form, FormControl, Row, Button } from 'react-bootstrap';
import { TransactionContext } from '../context/TransactionContext';

const Create = () => {
  const { uploadToNft, createNft, handleNftObj } = useContext(TransactionContext)
  return (
    <>
      <div className='container-fluid mt-5'>
        <div className='row'>
          <main role="main" className='col-lg-12 mx-auto' style={{ maxWidth: '1000px' }}>
            <div className='content mx-auto'>
              <Row className='g-4'>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={uploadToNft}
                />
                <FormControl
                  type="text"
                  size="lg"
                  placeholder='Name'
                  name="name"
                  onChange={handleNftObj}
                />
                <FormControl
                  as="textarea"
                  size="lg"
                  placeholder='Description'
                  name="description"
                  onChange={handleNftObj}
                />
                <FormControl
                  type="number"
                  size="lg"
                  placeholder='Price in ETH'
                  name="price"
                  onChange={handleNftObj}
                />
                <div className='d-grid px-0'>
                  <Button onClick={createNft} variant="primary" size="lg">
                    Create & List NFT!
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Create;