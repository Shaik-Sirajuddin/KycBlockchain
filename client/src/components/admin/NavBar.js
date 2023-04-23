import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default class NavBar extends Component {

    openHome() {
        window.location.href = "http://localhost:3000";
    }
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Button
                        style={{
                            'backgroundColor': 'white'
                        }}
                        onClick={this.openHome}
                        className="navbar-brand" to="/admin"  >KYC Blockchain | Admin</Button>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/admin/add">Add Organization</Link>
                            <Link className="nav-link" to="/admin/view">View Organization</Link>
                            <Link className="nav-link" to="/admin/remove">Remove Organization</Link>
                        </Nav>
                        <Nav>
                            <Nav.Link>{this.props.account}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        )
    }
}
