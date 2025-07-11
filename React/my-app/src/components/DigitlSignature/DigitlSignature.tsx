import SignatureCanvas from 'react-signature-canvas';
import './DigitlSignature.css';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { sendSignature } from '../../services/document.service';
import { setUrlPdf, setId } from '../../redux/slices/documentUrlSlice';

function DigitlSignature() {
    const sigCanvas = useRef<SignatureCanvas>(null!);
    const documentUrlSlice = useSelector((store: any) => store.documentUrlSlice);
    const dispatch = useDispatch();
   
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [showViewer, setShowViewer] = useState(false);
    const id = documentUrlSlice.id
    const file = documentUrlSlice.file
    const pdfUrl=`data:application/pdf;base64,${file}`
    const saveSignature = () => {
        if (!id) {
            alert('לא ניתן לשמור חתימה: מזהה מסמך חסר');
            return;
        }
        const data = {
            id,
            signature: sigCanvas.current?.toDataURL('image/png'),
        };
        sendSignature(data)
            .then(() => alert('המסמך החתום נשלח בהצלחה'))
            .catch(() => alert('שגיאה בשליחת החתימה'));
    };

    return (
        <div className='DigitlSignature' dir="rtl" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>חתימה על המסמך</h2>

            { pdfUrl? (
                <>
                    {!showViewer ? (
                        <div
                            onClick={() => setShowViewer(true)}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                width: '320px',
                                margin: '20px auto',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#fefefe',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '28px',
                                        height: '32px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: '10px',
                                    }}
                                >
                                    PDF
                                </div>
                            </div>
                            <div style={{ color: '#777', fontSize: '12px' }}>הקלקי לפתיחה</div>
                        </div>
                    ) : (
                        <div
                            style={{
                                height: '750px',
                                width: '100%',
                                border: '1px solid #ccc',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginBottom: '2rem',
                            }}
                        >
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
                            </Worker>
                        </div>
                    )}
                </>
            ) : (
                <p>לא נמצא מסמך</p>
            )}

            <h3>חתום כאן</h3>
            <div
                style={{
                    border: '2px solid #000',
                    borderRadius: '10px',
                    padding: '20px',
                    width: '300px',
                    height: '150px',
                    backgroundColor: '#f9f9f9',
                    margin: '20px auto',
                }}
            >
                <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
                <div className="signature-buttons">
                    <button onClick={() => sigCanvas.current?.clear()}>נקה</button>
                    <button onClick={saveSignature}>שמור</button>
                </div>
            </div>
        </div>
    );
}

export default DigitlSignature;
