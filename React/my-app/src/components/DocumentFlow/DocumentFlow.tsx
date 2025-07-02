
import { useState } from 'react';
import './DocumentFlow.css';
import { DocumentModel } from '../../models/DocumentModel';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { getDocumentId, insertDocument } from '../../services/document.service';
import { useDispatch, useSelector } from 'react-redux';
import { setId, setUrlPdf } from '../../redux/slices/documentUrlSlice';
import { useNavigate } from 'react-router-dom';


function DocumentFlow() {
    const [fileName, setFileName] = useState<File | undefined>(undefined);
    const [linkToShare, setlinkToShare] = useState<string>();
    const [loading, setLoading] = useState(false);
    const myStore = useSelector((allStore) => allStore)
    const dispatch = useDispatch();

    const handleChange = (event: any) => {
        setFileName(event.target.files[0])
    }
    const sendToServer = (value: DocumentModel) => {
        if (!fileName) {
            alert('אנא בחר קובץ לפני השליחה');
            return;
        }
        setLoading(true);
        // const formData = new FormData();
        // formData.append('fileName', fileName);
        // formData.append('name', value.name);
        // formData.append('email', value.email);

        const data = {
            fileName: fileName,
            name: value.name,
            email:value.email
        };
        insertDocument(data)
            .then(data => {
                console.log(data);            
                dispatch(setUrlPdf(data.data.link))
                dispatch(setId(data.data.id))
                console.log(data.data.id);
                
                setlinkToShare(`${window.location.origin}/signature/${data.data.id}`)
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
                <p>
                    לינק למסמך לחתימה: <a href={linkToShare} target="_blank" rel="noopener noreferrer">{linkToShare}</a>
                </p>
            )}
        </form>
    </div>
}

export default DocumentFlow