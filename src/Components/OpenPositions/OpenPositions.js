import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './../Firebase/FirebaseConfig';
import { useAuth } from "./../Context/AuthContext";
import Dashboard from "../Dashboard/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

import './OpenPositions.css';

const OpenPositions = () => {
    const [positions, setPositions] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const snapshot = await db.collection('position')
                    .orderBy('createdAt', 'desc')
                    .get();

                const fetchedPositions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPositions(fetchedPositions);
            } catch (error) {
                console.error("Error fetching positions:", error);
            }
        };

        fetchPositions();
    }, [user.uid]);

   
   

   

    return (
        <div className='openpositions-container'>
            <Dashboard onToggleSidebar={setCollapsed} />
            <div className={`openpositions-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Open Positions</h3>
                    
                </div>

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Position Title</th>
                            <th>Position From</th>
                            <th>Budget</th>
                            <th>Number Of Positions</th>
                            <th>Experience (years)</th>
                            <th>Priority</th>
                            <th>Priority Description</th>
                            <th>Status</th>
                            <th>Created At</th>
                          
                        </tr>
                    </thead>
                    <tbody>
                        {positions.length > 0 ? (
                            positions.map((position, index) => (
                                <tr key={position.id}>
                                    <td>{index + 1}</td>
                                    <td>{position.positionTitle}</td>
                                    <td>{position.positionFrom}</td>
                                    <td>{position.budget}</td>
                                    <td>{position.numOfOpenPositions}</td>
                                    <td>{position.experience}</td>
                                    <td>{position.priority}</td>
                                    <td>{position.priorityDescription}</td>
                                    <td>{position.status}</td>
                                    <td>{new Date(position.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">No open positions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OpenPositions;
