import { Modal } from 'rsuite'
import VeranstaltungForm from './VeranstaltungForm';


const VeranstaltungModal = ({ showModal, setShowModal, veranstaltung, editMode, userEmail, userId, getData }) => {

    return (
        <>
            <Modal
                style={{ justifyContent: 'center', alignSelf: 'center', display: "flex" }}
                overflow={true}
                open={showModal}
                onClose={() => setShowModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Veranstaltung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VeranstaltungForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        editMode={editMode}
                        veranstaltung={veranstaltung}
                        userEmail={userEmail}
                        userId={userId}
                        getData={getData}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VeranstaltungModal;