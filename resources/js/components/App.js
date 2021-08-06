import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Container, Row, Col, Form, Button, ProgressBar, Table, Alert} from 'react-bootstrap';

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [button, setButton] = useState('info');
    const [progress, setProgress] = useState();
    const [fileRows, setFileRows] = useState();
    const [rowsData, setRowsData] = useState();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState();
    const [variant, setVariant] = useState('success');

    const submitHandler = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('file', selectedFiles[0]);
        axios.post('/insert', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: data => {
                setProgress(Math.round((100 * data.loaded) / data.total));
            },
        }).then(function (response) {
            setVariant(response.data.status === 1 ? 'success' : 'danger')
            setMessage(response.data.message);
            setShow(true);
            getData();
            // console.log('response', response);
        })
            .catch(function (error) {
                setMessage(error.data.message)
                setShow(true)
                setProgress(0);
                console.log('error', error);
            });
    };

    const getData = () => {
        setTimeout(() => {
            axios.get('/listData').then(({data}) => {
                setRowsData(data.data);
                setFileRows(null);
                setShow(false);
                console.log(rowsData)
            });
        }, 5000);
    }

    const readSelectedFile = e => {
        const file = e.target.files;
        setSelectedFiles(file);
        setButton('danger');
        const reader = new FileReader();
        let result;
        reader.onload = function (e) {
            result = parseResult(e.target.result);
            setFileRows(result);
        };
        reader.readAsText(file[0]);
    };

    const parseResult = result => {
        let resultArray = [];
        result = result.replace(/(\r\n|\n|\r)/gm, '\n');
        result.split("\n").forEach(function (row) {
            let rowArray = [];
            row.split(",").forEach(function (cell) {
                rowArray.push(cell);
            });
            resultArray.push(rowArray);
        });
        return resultArray;
    }

    const showForm = () => {
        setRowsData(null);
        setProgress(null);
        setButton('info');
    }

    return (
        <Container>
            <Row className='justify-content-center'>
                <Col md='8'>
                    <div className='card'>
                        <div className="card-header">Upload file</div>
                        <div className="card-body">
                            {
                                rowsData && <Button variant="primary" onClick={showForm}>New file</Button>
                            }
                            <Alert variant={variant} show={show} onClose={() => setShow(false)} dismissible>
                                {message}
                            </Alert>
                            {
                                !rowsData && <div>
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group>
                                            <Form.File
                                                label="Please select File"
                                                name="file"
                                                onChange={(e) => {
                                                    readSelectedFile(e)
                                                }}
                                                accept=".csv"
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant={button} type="submit">
                                                Upload
                                            </Button>
                                        </Form.Group>
                                        {progress && <ProgressBar now={progress} label={`${progress}%`}/>}
                                    </Form>
                                    <hr/>
                                </div>
                            }
                            {
                                fileRows && !rowsData && <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Domain Name</th>
                                        <th>Expired Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        fileRows.map((item, index) => {
                                            return (<tr key={++index}>
                                                <td>{++index}</td>
                                                <td>{item[0]}</td>
                                                <td>{item[1]}</td>
                                            </tr>);
                                        })
                                    }
                                    </tbody>
                                </Table>
                            }
                            {
                                rowsData && <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Domain Name</th>
                                        <th>Expired Date</th>
                                        <th>Is Valid</th>
                                        <th>Valid until</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        Object.keys(rowsData).map(index => {
                                            return (<tr key={rowsData[index].id}>
                                                <td>{rowsData[index].id}</td>
                                                <td>{rowsData[index].name}</td>
                                                <td>{rowsData[index].expire_date}</td>
                                                <td>{!!rowsData[index].is_valid ? 'true' : 'false'}</td>
                                                <td>{rowsData[index].valid_until}</td>
                                            </tr>);
                                        })
                                    }
                                    </tbody>
                                </Table>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
