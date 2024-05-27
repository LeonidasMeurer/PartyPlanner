import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button, ButtonToolbar, Checkbox, Input, Panel, Form } from 'rsuite'

export const ernaehrungsform_default = {
    Omnivore: false,
    Vegetarisch: false,
    Vegan: false,
    kein_Alkohol: false,
    Alkohol: false,
    Schweinefleisch: false,
    Lammfleisch: false,
    Rindfleisch: false,
    Putenfleisch: false,
    Hünchenfleisch: false,
    Fisch: false,
    Milchzuckerunverträglichkeit : false,
    Glutenunverträglich: false,
    Fruchtzuckerunverträglichkeit: false,
    Histaminunverträglichkeit: false
}


const Ernaehrungsform = ({ ernaehrungsform, setErnaerungsform, alergienLabel }) => {


    const changeErnaerungsform = (value) => {
        setErnaerungsform({
            ...ernaehrungsform,
            [value]: ernaehrungsform[value] === true ? false : true
        })
    }


    return (

        <>
            <Form.ControlLabel>Ernährungform:</Form.ControlLabel>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Omnivore}
                    value={"Omnivore"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Ominvore</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Vegetarisch}
                    value={"Vegetarisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Vegetarisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Vegan}
                    value={"Vegan"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Vegan</Checkbox>
                <Form.ControlLabel>Getränke:</Form.ControlLabel>
                <Checkbox
                    defaultChecked={ernaehrungsform?.kein_Alkohol}
                    value={"kein_Alkohol"}
                    onChange={(value) => changeErnaerungsform(value)}
                >kein_Alkohol</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Alkohol}
                    value={"Alkohol"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Alkohol</Checkbox>
                <Form.ControlLabel>Fleisch:</Form.ControlLabel>
                <Checkbox
                    defaultChecked={ernaehrungsform?.kein_Schweinefleisch}
                    value={"Schweinefleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Schweinefleisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Lammfleisch}
                    value={"Lammfleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Lammfleisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Rindfleisch}
                    value={"Rindfleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Rindfleisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Putenfleisch}
                    value={"Putenfleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Putenfleisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Hünchenfleisch}
                    value={"Hünchenfleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Hünchenfleisch</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Fisch}
                    value={"Fisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Fisch</Checkbox>
                <Form.ControlLabel>{alergienLabel}</Form.ControlLabel>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Milchzuckerunverträglichkeit}
                    value={"Milchzuckerunverträglichkeit"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Milchzuckerunverträglichkeit</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Glutenunverträglichkeit}
                    value={"Glutenunverträglichkeit"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Glutenunverträglichkeit</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Fruchtzuckerunverträglichkeit}
                    value={"Fruchtzuckerunverträglichkeit"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Fruchtzuckerunverträglichkeit</Checkbox>
                <Checkbox
                    defaultChecked={ernaehrungsform?.Histaminunverträglichkeit}
                    value={"Histaminunverträglichkeit"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Histaminunverträglichkeit</Checkbox>
            </div>
        </>
    );
};

export default Ernaehrungsform;