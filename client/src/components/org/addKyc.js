import React, { useEffect } from "react";
import { Form, Container, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Addkyc(props) {
    useEffect(() => {
        document.title = 'Add KYC'
        props.cleanState()
        // eslint-disable-next-line
    }, [])
    return (
        <Container>
            <h2 style={{ margin: "auto", width: "80%", padding: "20px 10px 10px 10px" }}>Add new KYC </h2>
            <Form style={{ margin: "auto", width: "80%", padding: "30px 10px 10px 10px" }} onSubmit={props.handleSubmit}>
                <Form.Group>
                    <Form.Label>Eth Address : </Form.Label>
                    <Form.Control type="text" name="eth_address" onChange={props.handleChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name : </Form.Label>
                    <Form.Control type="text" name="name" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Father's Name : </Form.Label>
                    <Form.Control type="text" name="fatherName" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Mother's Name : </Form.Label>
                    <Form.Control type="text" name="motherName" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Grandfather's Name : </Form.Label>
                    <Form.Control type="text" name="grandfatherName" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Temporay Address : </Form.Label>
                    <Form.Control type="text" name="temporaryAddress" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Permanent Address : </Form.Label>
                    <Form.Control type="text" name="permanenetAddress" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>DOB : </Form.Label>
                    <Form.Control type="date" name="dob" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number : </Form.Label>
                    <Form.Control type="number" name="contactNumber" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <br></br>
                <Button variant="primary" type="submit" value="Submit" >Add</Button>
            </Form>
            <div style={{ margin: "auto", width: "80%", padding: "10px", color: "green" }}>
                {props.loading ? <p style={{ color: 'blue' }}>Adding Customer KYC...</p>
                    : props.error ? <p style={{ color: "red" }}>{props.errormsg}</p> : props.added && <p>Customer KYC Added</p>}
            </div>
        </Container>
    )
}