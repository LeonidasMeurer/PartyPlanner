import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import VeranstaltungFrom from '../Veranstaltung/VeranstaltungForm';
import GuestForm from './GaesteForm';



const GuestModal = ({ showModal, setShowModal, v_id, createGuest }) => {

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
                    <GuestForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        v_id={v_id}
                        createGuest={createGuest}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default GuestModal;