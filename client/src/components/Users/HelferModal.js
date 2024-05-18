import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import VeranstaltungFrom from '../Veranstaltung/VeranstaltungForm';
import HelferForm from './HelferForm';



const HelferModal = ({ showHelferModal, setShowHelferModal, createHelfer }) => {

    return (
        <>
            <Modal
                style={{ justifyContent: 'center', alignSelf: 'center', display: "flex" }}
                overflow={true}
                open={showHelferModal}
                onClose={() => setShowHelferModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Veranstaltung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HelferForm
                        showModal={showHelferModal}
                        setShowHelferModal={setShowHelferModal}
                        createHelfer={createHelfer}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default HelferModal;