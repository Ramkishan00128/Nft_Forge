import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col } from "react-bootstrap";
import ChooseSingleNFt from "../ChooseSingleNFt";

// import NftIcon from "./NftIcon";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size='200px'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Body className='p-4 font_text '>
        <div>
          <h6>Your token! balance</h6>
          <h6>{props.data.balance}</h6>
        </div>
        <h6>Choose Any 1 NFT to Stake</h6>

        {
          <div>
            {props.data.limit > 0 &&
              props.data.combination.length > 0 &&
              props.data.combination.map((v, i) => {
                return (
                  <ChooseSingleNFt
                    index={i}
                    address={props.data.NFT_STAKE}
                    handleDepositChange={() => props.data.handleDepositChange}
                    handleDepositUnChange={() =>
                      props.data.handleDepositUnChange
                    }
                  />
                );
              })}
          </div>
        }
        <h6 className='text-primary mt-2'>
          fee :{props.data.stakefee} {props.data.symbol}
        </h6>
      </Modal.Body>
      <Modal.Footer>
        <Container className='w-full'>
          <Row className='justify-content-between'>
            <Col>
              {props.data.approval > 0 &&
                props.data.approval >
                  props.data.stakingAmountOg * props.data.damount && (
                  <Button onClick={props.data.depositToken}>Deposit</Button>
                )}
              {(props.data.approval === 0 ||
                props.data.approval < props.data.stakefee) && (
                <Button className='ms-3' onClick={props.data.approveToken}>
                  Approve {props.data.symbol}
                </Button>
              )}
            </Col>
            <Col className='d-flex flex-end'>
              <Button variant='danger' onClick={props.onHide}>
                Close
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}
export default MyVerticallyCenteredModal;
