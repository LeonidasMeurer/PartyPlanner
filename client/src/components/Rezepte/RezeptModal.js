import React, { useState } from 'react';
import { DatePicker, Form, InputNumber, Modal, Button } from 'rsuite'
import RezeptForm from './RezeptForm';


const RezeptModal = ({ showModal, setShowModal, r_id, createRezept, selectedRezept, editMode, getData }) => {

    console.log('modal', editMode)
    return (
        <>
            <Modal
                style={{ justifyContent: 'center', alignSelf: 'center', display: "flex" }}
                overflow={true}
                open={showModal}
                onClose={() => setShowModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Rezept</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RezeptForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        r_id={r_id}
                        createRezept={createRezept}
                        selectedRezept={selectedRezept}
                        editMode={editMode}
                        getData={getData}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RezeptModal;