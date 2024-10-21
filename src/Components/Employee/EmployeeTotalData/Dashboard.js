import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
// import './Dashboard.css';

// Mock Data
const totalPositions = 100;  // Example total number of open positions (internal + client)

const pieData = [
  { name: 'Client A', value: 400 },
  { name: 'Client B', value: 300 },
  { name: 'Client C', value: 200 },
  { name: 'Client D', value: 100 },
];

const barData = [
  { name: 'L1', candidates: 12 },
  { name: 'L2', candidates: 8 },
  { name: 'F2F', candidates: 5 },
];

const lineData = [
  { name: 'Monday', scheduled: 4 },
  { name: 'Tuesday', scheduled: 6 },
  { name: 'Wednesday', scheduled: 3 },
  { name: 'Thursday', scheduled: 7 },
  { name: 'Friday', scheduled: 5 },
];

// Fulfillment data for open vs closed positions per client
const fulfillmentData = [
  { name: 'Client A', open: 10, closed: 30 },
  { name: 'Client B', open: 15, closed: 25 },
  { name: 'Client C', open: 8, closed: 22 },
  { name: 'Client D', open: 5, closed: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
    <Col md={3}>
      <Card className="text-white bg-primary" style={{ width: '250px', height: '150px' }}>
        <Card.Body>
          <h5 className="card-title">Clients</h5>
          <h3 className="card-count">5</h3>
          <div className="card-footer">
            <Link to="/e-view-clients" className="view-details-link">View Details &rarr;</Link>
          </div>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3}>
      <Card className="text-white bg-success" style={{ width: '250px', height: '150px' }}>
        <Card.Body>
          <h5 className="card-title">Open Positions</h5>
          <h3 className="card-count">6</h3>
          <div className="card-footer">
            <a href="/e-viewopenpositions" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3}>
      <Card className="text-white bg-danger" style={{ width: '250px', height: '150px' }}>
        <Card.Body>
          <h5 className="card-title">Screening</h5>
          <h3 className="card-count">30</h3>
          <div className="card-footer">
            <a href="/e-screening" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3}>
      <Card className="text-white bg-primary" style={{ width: '250px', height: '150px' }}>
        <Card.Body>
          <h5 className="card-title">L1-candidates</h5>
          <h3 className="card-count">25</h3>
          <div className="card-footer">
            <a href="/e-L1candidates" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3}>
      <Card className="text-white bg-primary" style={{ width: '250px', height: '150px', marginTop:'50px' }}>
        <Card.Body>
          <h5 className="card-title">L2-candidates</h5>
          <h3 className="card-count">20</h3>
          <div className="card-footer">
            <a href="/e-L2candidates" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3}>
      <Card className="text-white bg-danger" style={{ width: '250px', height: '150px',marginTop:'50px' }}>
        <Card.Body>
          <h5 className="card-title">F2F-candidates </h5>
          <h3 className="card-count">2</h3>
          <div className="card-footer">
            <a href="/e-F2Fcandidates" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>


    <Col md={3}>
      <Card className="text-white bg-primary" style={{ width: '250px', height: '150px', marginTop:'50px' }}>
        <Card.Body>
          <h5 className="card-title">Productivity</h5>
          <h3 className="card-count">3</h3>
          <div className="card-footer">
            <a href="/productivity-tracker" className="view-details-link">View Details &rarr;</a>
          </div>
        </Card.Body>
      </Card>
    </Col>
    </Row>

      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Recruitment Dashboard</h2>
        </Col>
      </Row>

      {/* Total Open Positions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="text-center">
              <h4>Total Open Positions (Internal + Client)</h4>
              <h3>{totalPositions}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Pie Chart for Positions by Client */}
        <Col md={6} xs={12}>
          <Card>
            <Card.Body>
              <h4 className="text-center">Positions by Client</h4>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                   
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Card.Body>
          </Card>
        </Col>

        {/* Bar Chart for Number of Candidates at Each Stage */}
        <Col md={6} xs={12}>
          <Card>
            <Card.Body>
              <h4 className="text-center">Number of Candidates at Each Stage</h4>
              <BarChart width={400} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="candidates" fill="#82ca9d">
                  <LabelList dataKey="candidates" position="top" />
                </Bar>
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Line Chart for Scheduled Interviews */}
        <Col md={12}>
          <Card>
            <Card.Body>
              <h4 className="text-center">Scheduled Interviews (This Week)</h4>
              <LineChart
                width={800}
                height={300}
                data={lineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scheduled" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Stacked Bar Chart for Client Fulfillment Status */}
        <Col md={12}>
          <Card>
            <Card.Body>
              <h4 className="text-center">Client Fulfillment Status (Open vs Closed)</h4>
              <BarChart
                width={800}
                height={300}
                data={fulfillmentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" stackId="a" fill="#FF8042" name="Open Positions">
                  <LabelList dataKey="open" position="insideTop" />
                </Bar>
                <Bar dataKey="closed" stackId="a" fill="#0088FE" name="Closed Positions">
                  <LabelList dataKey="closed" position="insideTop" />
                </Bar>
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
