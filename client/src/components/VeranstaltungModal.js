import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import VeranstaltungFrom from './VeranstaltungForm';


const VeranstaltungModal = ({ showModal, setShowModal, veranstaltung, editMode, userEmail, userId, getData }) => {
    const datum = new Date(veranstaltung.datum)

    const [formValue, setFormValue] = useState({
        v_name: editMode ? veranstaltung.v_name : null,
        teilnehmer_anzahl: editMode ? veranstaltung.teilnehmer_anzahl : null,
        datum: editMode ? datum : null,
        beschreibung: editMode ? veranstaltung.beschreibung : null,
        user_name: userEmail,
        ort: editMode ? veranstaltung.ort : null,
        user_id: userId,
    })


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
                    <VeranstaltungFrom
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