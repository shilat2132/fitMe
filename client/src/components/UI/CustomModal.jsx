import { Modal } from "react-bootstrap";

const CustomModal = ({show, setShow, title, body, triggerHandler, defaultBtns = true})=>{

    const handleClose = () => setShow(false);


    return(
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{body}</Modal.Body>

                <Modal.Footer>
                {defaultBtns && <>
                    <button className="cancelBtn" onClick={handleClose}>
                    No
                    </button>

                    <button className="okBtn" onClick={triggerHandler}>
                        Yes
                    </button>
                </>}
                </Modal.Footer>
            </Modal>
    )
}

export default CustomModal
