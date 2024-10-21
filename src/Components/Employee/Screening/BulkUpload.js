import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../../Firebase/FirebaseConfig';
import { arrayUnion } from 'firebase/firestore';
import { Button } from 'react-bootstrap';

const BulkUploadComponent = ({ user, onUploadComplete }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Process and upload the data to Firestore
            jsonData.forEach(async (applicant) => {
                try {
                    await db.collection('applicants').doc(user.uid).update({
                        applicants: arrayUnion({
                            name: applicant['Name'],
                            email: applicant['Email'],
                            mobile: applicant['Mobile'],
                            gender: applicant['Gender'],
                            educationalQualification: applicant['Education'],
                            yearOfPassing: applicant['Year of Passing'],
                            yearsOfExperience: applicant['Experience'],
                            currentCompany: applicant['Current Company'],
                            positionInterested: applicant['Position Interested'],
                            company: applicant['Company'],
                            designation: applicant['Designation'],
                            skills: applicant['Skills'],
                            resume: applicant['Resume Link'],
                            status: 'New'
                        })
                    });
                } catch (error) {
                    console.error("Error uploading data: ", error);
                }
            });

            alert('Data uploaded successfully!');
            onUploadComplete(); // Callback to refresh data or handle post-upload
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
            <Button onClick={handleFileUpload}>Upload</Button>
        </div>
    );
};

export default BulkUploadComponent;
