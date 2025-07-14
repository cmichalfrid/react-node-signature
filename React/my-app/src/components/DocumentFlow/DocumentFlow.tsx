
import { useState } from 'react';
import './DocumentFlow.css';
import { DocumentModel } from '../../models/DocumentModel';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { getDocumentId, insertDocument } from '../../services/document.service';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setFile, setId, setUrlPdf } from '../../redux/slices/documentUrlSlice';
import { useNavigate } from 'react-router-dom';


function DocumentFlow() {
    console.log("Rendering DocumentFlow component");

    const [fileName, setFileName] = useState<File | undefined>(undefined);
    const [linkToShare, setlinkToShare] = useState<string>();
    const [loading, setLoading] = useState(false);
    const myStore = useSelector((allStore) => allStore)
    const dispatch = useDispatch();

    const handleChange = (event: any) => {
        console.log('File selected:', event.target.files[0]);

        setFileName(event.target.files[0])
    }
    const sendToServer = (value: DocumentModel) => {
        console.log("📨 sendToServer called with:", value, fileName);

        console.log("📨 sendToServer called with:", value);

        if (!fileName) {
            alert('אנא בחר קובץ לפני השליחה');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', fileName);
        formData.append('name', value.name);
        formData.append('email', value.email);
        console.log("נשלח ל־insertDocument:", formData);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }
        insertDocument(formData)
            .then(data => {

                console.log(data.data);
                dispatch(setUrlPdf(`/api/document/${data.data.id}`.trim()));
                dispatch(setId(data.data.id));
                dispatch(setEmail(data.data.email));
                dispatch(setFile(data.data.file)); 
                setlinkToShare(`https://react-node-signature-gqey.onrender.com/signature/${data.data.id}`.trim());
                console.log(linkToShare);
                
            })
            .finally(() => setLoading(false));
    };

    const myForm = useFormik({
        initialValues: new DocumentModel(),
        onSubmit: sendToServer,
        validationSchema: yup.object().shape({
            name: yup.string().required("שדה חובה"),
            email: yup.string().email()
        })
    })
    return <div className="DocumentFlow">
        <form onSubmit={myForm.handleSubmit} className="upload-form">
            <div className="input-group">
                <label htmlFor="name">שם מלא</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={myForm.values.name}
                    onChange={myForm.handleChange}
                />
                {myForm.errors.name && (
                    <small className="form-text text-danger">{myForm.errors.name}</small>
                )}
            </div>

            <div className="input-group">
                <label htmlFor="email">אימייל</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={myForm.values.email}
                    onChange={myForm.handleChange}
                />
                {myForm.errors.email && (
                    <small className="form-text text-danger">{myForm.errors.email}</small>
                )}
            </div>

            <label htmlFor="file-upload" className="upload-label">בחר מסמך לחתימה</label>
            <input
                type="file"
                id="file-upload"
                className="upload-input"
                onChange={handleChange}
            />

            {fileName && <p className="file-name">📄 {fileName.name}</p>}

            <button type="submit">צור לינק לחתימה</button>

            {loading && <p>⏳ יוצרים את הלינק...</p>}
            {linkToShare && (
                <div className="share-link">
                    <strong>לינק למסמך לחתימה:</strong>
                    <br />
                    <a
                        href={linkToShare}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {linkToShare}
                    </a>
                </div>
            )}
        </form>

    </div>
}

export default DocumentFlow