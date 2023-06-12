import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col } from "react-bootstrap";

// import NftIcon from "./NftIcon";

function UnStakeModal(props) {
  return (
    <Modal
      {...props}
      size='200px'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Body className='p-4 font_text '>
        <div>
          <h6>Please Confirm IF You Want to Unstake</h6>
          {/* <h6>{props.data.balance}</h6> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Container className='w-full'>
          <Row className='justify-content-between'>
            <Col>
              <Button onClick={props.data.unstake}>Unstake</Button>
            </Col>
            <Col className='d-flex flex-end'>
              <Button variant='danger' onClick={props.onHide}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}
export default UnStakeModal;
