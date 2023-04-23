import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default class NavBar extends Component {
    openHome() {

        window.location.href = "https://singular-brioche-c5506a.netlify.app/";
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
                        className="navbar-brand" to="/admin"  >KYC Blockchain | Organization</Button>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/Organization/add">Add KYC</Link>
                            <Link className="nav-link" to="/Organization/update">Update KYC</Link>
                            <Link className="nav-link" to="/Organization/request">Request KYC</Link>
                            <Link className="nav-link" to="/Organization/list">List Request</Link>
                            <Link className="nav-link" to="/Organization/view">View KYC</Link>
                            <Link className="nav-link" to="/Organization/delete">Delete Request</Link>
                        </Nav>
                        <Nav>
                            <Nav.Link>{this.props.account}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}
