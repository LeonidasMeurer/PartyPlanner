import { Progress, Panel, Container, Sidebar, Content, Text, PanelGroup } from 'rsuite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, pieChartDefaultProps } from 'react-minimal-pie-chart';

const defaultLabelStyle = {
    fontSize: '7px',
    fontFamily: 'sans-serif',
};

const ernaehrungDefault = {
    Omnivore: 0,
    Vegetarisch: 0,
    Vegan: 0,
    kein_Alkohol: 0,
    Alkohol: 0,
    Schweinefleisch: 0,
    Lammfleisch: 0,
    Rindfleisch: 0,
    Putenfleisch: 0,
    Hünchenfleisch: 0,
    Fisch: 0,
    Milchzuckerunverträglichkeit : 0,
    Glutenunverträglich: 0,
    Fruchtzuckerunverträglichkeit: 0,
    Histaminunverträglichkeit: 0,
    teilnehmer: 0
}

const VeranstaltungStatistik = () => {
    const params = useParams();
    const [helfer, setHelfer] = useState()
    const [gaeste, setGaeste] = useState()
    const [rezeptStatistik, setRezeptStatistik] = useState(null)
    const [teilnehmerStatistik, setTeilnehmerStatistik] = useState(null)
    const [statistik, setStatistik] = useState(null)



    const getRezepte = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_veranstaltung/${params.v_id}`)
            const json = await response.json()
            console.log(json)
            console.log('test')
            const rezepteParsed = await parseRezepte(json)
            setRezeptStatistik(rezepteParsed)
            console.log('1233', rezepteParsed)
            return rezepteParsed;
        } catch (err) {
            console.error(err)
        }
    }

    const getHelfer = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${params.v_id}`)
            const json = await response.json()
            console.log('setHelfer', json)
            const userParsed = await parseUser(json)
            setTeilnehmerStatistik(userParsed)
            console.log('1233', userParsed)
            return userParsed;
        } catch (err) {
            console.error(err)
        }
    }

    const getGaeste = async (userParsed) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_gaeste/${params.v_id}`)
            const json = await response.json()
            setGaeste(json)
            const gaesteParsed = await parseGuest(json, userParsed)
            setTeilnehmerStatistik(gaesteParsed)
            console.log('1233', gaesteParsed)
            return gaesteParsed;
        } catch (err) {
            console.error(err)
        }
    }

    const parseRezepte = async (rezepte) => {

        console.log('rezepteResult')

        console.log(rezepte)

        let ernaehrungsformRezepte = rezeptStatistik ? rezeptStatistik : ernaehrungDefault

        rezepte.forEach(element => {
            console.log(element)
            Object.keys(element.r_ernaehrungsform).forEach(key => {
                console.log(key, element.r_ernaehrungsform[key]);
                if (element.r_ernaehrungsform[key] === true) {
                    ernaehrungsformRezepte = {
                        ...ernaehrungsformRezepte,
                        [key]: ernaehrungsformRezepte[key] + element.portionen
                        
                    }
                }
            })
        })
        return ernaehrungsformRezepte
    }

    const parseUser = async (user) => {

        let ernaehrungsformUser = teilnehmerStatistik ? teilnehmerStatistik : ernaehrungDefault

        user.forEach(element => {
            console.log('userresult', element)
            Object.keys(element.u_ernaehrungsform).forEach(key => {
                console.log('userresult', key, element.u_ernaehrungsform[key]);
                if (element.u_ernaehrungsform[key] === true && element.zusage === 'Zugesagt') {
                    ernaehrungsformUser = {
                        ...ernaehrungsformUser,
                        [key]: ernaehrungsformUser[key] + 1,
                        'teilnehmer': ernaehrungsformUser['teilnehmer'] + 1
                    }
                }
            })
        })
        return (ernaehrungsformUser)
    }

    const parseGuest = async (user, userParsed) => {

        let ernaehrungsformUser = userParsed

        user.forEach(element => {
            console.log('userresult', element)
            Object.keys(element.g_ernaehrungsform).forEach(key => {
                console.log('userresult', key, element.g_ernaehrungsform[key]);
                if (element.g_ernaehrungsform[key] === true && element.zusage === 'Zugesagt') {
                    ernaehrungsformUser = {
                        ...ernaehrungsformUser,
                        [key]: ernaehrungsformUser[key] + 1,
                        'teilnehmer': ernaehrungsformUser['teilnehmer'] + 1
                    }
                }
            })
        })
        return (ernaehrungsformUser)
    }

    const berechneProzente = async (rezepteParsed, ernaehrungsformUser) => {
        console.log('22', rezepteParsed)
        console.log('22', ernaehrungsformUser)
        let result = ernaehrungDefault

        const teilen = (key) => {
            const prozent = Math.round(rezepteParsed[key] / ernaehrungsformUser[key] * 100)
            console.log(prozent)
            if (prozent > 100) {
                return 100
            }
            return prozent
        }

        Object.keys(rezepteParsed).forEach(key => {
            console.log(key, rezepteParsed[key]);
            result = {
                ...result,
                [key]: teilen(key)
            }
        })
        setStatistik(result)
    }

    const createStatistik = async () => {
        const rezepteParsed = await getRezepte()
        const userParsed = await getHelfer()
        const ernaehrungsformUser = await getGaeste(userParsed)
        berechneProzente(rezepteParsed, ernaehrungsformUser)

    }

    useEffect(() => {
        createStatistik()
    }, []);


    if (!rezeptStatistik || !teilnehmerStatistik || !gaeste || !statistik) {
        return (<>loading</>)
    }

    const shiftSize = 7;

    return (
        <PanelGroup accordion bordered>
            <Panel header='Ernährung' defaultExpanded>
                <Container>
                    <Sidebar style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <PieChart
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            radius={pieChartDefaultProps.radius - shiftSize}
                            data={[
                                { title: 'Omnivore', value: teilnehmerStatistik.Omnivore, color: '#004299' },
                                { title: 'Vegetarisch', value: teilnehmerStatistik.Vegetarisch, color: '#0a5dc2' },
                                { title: 'Vegan', value: teilnehmerStatistik.Vegan, color: '#1675e0' },
                            ]}
                        />
                    </Sidebar>
                    <Content style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>Omnivore Portionen vorhanden/benötigt: {rezeptStatistik.Omnivore}/{teilnehmerStatistik.Omnivore}</Text>
                        <Progress.Line
                            percent={statistik.Omnivore}
                            strokeColor="#004299"
                        />
                        <Text>Vegetarisch Portionen vorhanden/benötigt: {rezeptStatistik.Vegetarisch}/{teilnehmerStatistik.Vegetarisch}</Text>
                        <Progress.Line
                            percent={statistik.Vegetarisch}
                            strokeColor="#0a5dc2"
                        />
                        <Text>Vegane Portionen vorhanden/benötigt: {rezeptStatistik.Vegan}/{teilnehmerStatistik.Vegan}</Text>
                        <Progress.Line
                            percent={statistik.Vegan}
                            strokeColor="#1675e0" />
                    </Content>
                </Container>
            </Panel>
            <Panel header='Getränke' defaultExpanded>
                <Container>
                    <Sidebar style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <PieChart
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            radius={pieChartDefaultProps.radius - shiftSize}
                            data={[
                                { title: 'kein_Alkohol', value: teilnehmerStatistik.kein_Alkohol, color: '#004299' },
                                { title: 'Alkohol', value: teilnehmerStatistik.Alkohol, color: '#0a5dc2' },
                            ]}
                        />
                    </Sidebar>
                    <Content style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>Kein Alkohol vorhanden/benötigt: {rezeptStatistik.kein_Alkohol}/{teilnehmerStatistik.kein_Alkohol}</Text>
                        <Progress.Line
                            percent={statistik.kein_Alkohol}
                            strokeColor="#004299"
                        />
                        <Text>Alkohol vorhanden/benötigt: {rezeptStatistik.Alkohol}/{teilnehmerStatistik.Alkohol}</Text>
                        <Progress.Line
                            percent={statistik.Alkohol}
                            strokeColor="#0a5dc2"
                        />
                    </Content>
                </Container>
            </Panel>
            
            <Panel header='Fleisch' defaultExpanded>
                <Container>
                    <Sidebar style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <PieChart
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            radius={pieChartDefaultProps.radius - shiftSize}
                            data={[
                                { title: 'Schwein', value: teilnehmerStatistik.Schweinefleisch, color: '#004299' },
                                { title: 'Lamm', value: teilnehmerStatistik.Lammfleisch, color: '#0a5dc2' },
                                { title: 'Rind', value: teilnehmerStatistik.Rindfleisch, color: '#1675e0' },
                                { title: 'Pute', value: teilnehmerStatistik.Putenfleisch, color: '#2589f5' },
                                { title: 'Hünchen', value: teilnehmerStatistik.Hünchenfleisch, color: '#3498FF' },
                                { title: 'Fisch', value: teilnehmerStatistik.Fisch, color: '#59afff' },
                            ]}
                        />
                    </Sidebar>
                    <Content style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>Schweinefleisch vorhanden/benötigt: {rezeptStatistik.Schweinefleisch}/{teilnehmerStatistik.Schweinefleisch}</Text>
                        <Progress.Line
                            percent={statistik.Schweinefleisch}
                            strokeColor="#004299"
                        />
                        <Text>Lammfleisch vorhanden/benötigt: {rezeptStatistik.Lammfleisch}/{teilnehmerStatistik.Lammfleisch}</Text>
                        <Progress.Line
                            percent={statistik.Lammfleisch}
                            strokeColor="#0a5dc2"
                        />
                        <Text>Rindfleisch vorhanden/benötigt: {rezeptStatistik.Rindfleisch}/{teilnehmerStatistik.Rindfleisch}</Text>
                        <Progress.Line
                            percent={statistik.Rindfleisch}
                            strokeColor="#1675e0"
                        />
                        <Text>Putenfleisch vorhanden/benötigt: {rezeptStatistik.Putenfleisch}/{teilnehmerStatistik.Putenfleisch}</Text>
                        <Progress.Line
                            percent={statistik.Putenfleisch}
                            strokeColor="#2589f5"
                        />
                        <Text>Hünchenfleisch vorhanden/benötigt: {rezeptStatistik.Hünchenfleisch}/{teilnehmerStatistik.Hünchenfleisch}</Text>
                        <Progress.Line
                            percent={statistik.Hünchenfleisch}
                            strokeColor="#3498FF"
                        />
                        <Text>Fisch vorhanden/benötigt: {rezeptStatistik.Fisch}/{teilnehmerStatistik.Fisch}</Text>
                        <Progress.Line
                            percent={statistik.Fisch}
                            strokeColor="#59afff"
                        />
                    </Content>
                </Container>
            </Panel>

            <Panel header='Unverträglichkeiten' defaultExpanded>
                <Container>
                    <Sidebar style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <PieChart
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            radius={pieChartDefaultProps.radius - shiftSize}
                            data={[
                                { title: 'Milchzucker', value: teilnehmerStatistik.Milchzuckerunverträglichkeit, color: '#004299' },
                                { title: 'Gluten', value: teilnehmerStatistik.Glutenunverträglich, color: '#0a5dc2' },
                                { title: 'Fruchtzucker', value: teilnehmerStatistik.Fruchtzuckerunverträglichkeit, color: '#1675e0' },
                                { title: 'Histamin', value: teilnehmerStatistik.Histaminunverträglichkeit, color: '#2589f5' },
                            ]}
                        />
                    </Sidebar>
                    <Content style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>Milchzuckerunverträglichkeit vorhanden/benötigt: {rezeptStatistik.Milchzuckerunverträglichkeit}/{teilnehmerStatistik.Milchzuckerunverträglichkeit}</Text>
                        <Progress.Line
                            percent={statistik.Milchzuckerunverträglichkeit}
                            strokeColor="#004299"
                        />
                        <Text>Glutenunverträglich vorhanden/benötigt: {rezeptStatistik.Glutenunverträglich}/{teilnehmerStatistik.Glutenunverträglich}</Text>
                        <Progress.Line
                            percent={statistik.Glutenunverträglich}
                            strokeColor="#0a5dc2"
                        />
                        <Text>Fruchtzuckerunverträglichkeit vorhanden/benötigt: {rezeptStatistik.Fruchtzuckerunverträglichkeit}/{teilnehmerStatistik.Fruchtzuckerunverträglichkeit}</Text>
                        <Progress.Line
                            percent={statistik.Fruchtzuckerunverträglichkeit}
                            strokeColor="#1675e0"
                        />
                        <Text>Histaminunverträglichkeit vorhanden/benötigt: {rezeptStatistik.Histaminunverträglichkeit}/{teilnehmerStatistik.Histaminunverträglichkeit}</Text>
                        <Progress.Line
                            percent={statistik.Histaminunverträglichkeit}
                            strokeColor="#2589f5"
                        />
                    </Content>
                </Container>
            </Panel>

        </PanelGroup>
    )
};

export default VeranstaltungStatistik;