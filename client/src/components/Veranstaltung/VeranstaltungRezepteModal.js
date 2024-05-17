import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import VeranstaltungFrom from '../Veranstaltung/VeranstaltungForm';
import VeranstaltungRezepteForm from './VeranstaltungRezepteForm';



const VeranstaltungRezepteModal = ({ showModal, setShowModal, v_id, selectedRezept, userRezepte, editMode, getData }) => {

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
                    <VeranstaltungRezepteForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        v_id={v_id}
                        userRezepte={userRezepte}
                        editMode={editMode}
                        selectedRezept={selectedRezept}
                        getData={getData}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VeranstaltungRezepteModal;