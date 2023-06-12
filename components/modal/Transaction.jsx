import Modal from "react-bootstrap/Modal";

function TransAction(props) {
  return (
    <Modal
      {...props}
      size='200px'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Body>
        <div className='transaction'>
          <h4>Transaction is processing...</h4>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default TransAction;
