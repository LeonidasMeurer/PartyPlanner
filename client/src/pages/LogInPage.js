import React from "react";
import Auth from "../components/Auth";
import { Navbar, Container, FlexboxGrid, Panel, Header } from 'rsuite';

const LogInPage = () => {
    return (
        <div>
            <Container>
                <Header style={{ marginBottom: '100px' }}>
                    <Navbar appearance='inverse'>
                        <Navbar.Brand href="#">PartyPlanner</Navbar.Brand>
                    </Navbar>
                </Header>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={12}>
                        <Auth />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Container>


        </div>
    );
}

export default LogInPage;