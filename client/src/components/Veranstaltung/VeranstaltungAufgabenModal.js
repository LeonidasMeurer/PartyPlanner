import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import VeranstaltungFrom from '../Veranstaltung/VeranstaltungForm';
import VeranstaltungAufgabenForm from './VeranstaltungAufgabenForm';



const VeranstaltungAufgabenModal = ({ showModal, setShowModal, v_id, createAufgabe, helfer }) => {

    return (
        <>
            <Modal
                style={{ justifyContent: 'center', alignSelf: 'center', display: "flex" }}
                overflow={true}
                open={showModal}
                onClose={() => setShowModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Aufgabe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VeranstaltungAufgabenForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        v_id={v_id}
                        createAufgabe={createAufgabe}
                        helfer={helfer}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VeranstaltungAufgabenModal;