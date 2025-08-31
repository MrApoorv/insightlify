import React, { useState, useRef } from 'react';
import './Analyzer.css';

const BASE_URL =
  process.env.REACT_APP_ENV === "DEV"
    ? process.env.REACT_APP_DEVELOPMENT_URL
    : process.env.REACT_APP_PRODUCTION_URL;


const AnalysisCard = ({ title, children, className = '' }) => (
    <div className={`analysis-card ${className}`}>
        <h3 className="card-title">{title}</h3>
        {children}
    </div>
);

const Pill = ({ text }) => <span className="pill">{text}</span>;

const RewriteCard = ({ title, text }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <AnalysisCard title={title} className="rewrite-card">
            <p>{text}</p>
            <button onClick={handleCopy} className={`copy-button ${isCopied ? 'copied' : ''}`}>
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </AnalysisCard>
    );
};

const Features = () => (
    <section className="features-section">
        <ul className="features-list">
            <li className="feature-item"><strong>Multi-format Support</strong>Upload PDFs and Images.</li>
            <li className="feature-item"><strong>OCR Support</strong>Extracts text from images using Tesseract OCR.</li>
            <li className="feature-item"><strong>PDF Parsing</strong>Extracts text from PDFs using PyMuPDF.</li>
            <li className="feature-item"><strong>AI-Powered Analysis</strong>Uses Google Gemini API for structured insights.</li>
        </ul>
    </section>
);



export default function Analyzer() {
    const [inputType, setInputType] = useState('file');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => { const file = event.target.files[0]; if (file) { setSelectedFile(file); setError(''); setAnalysisResult(null); } };
    const handleTextChange = (event) => { setInputText(event.target.value); setError(''); setAnalysisResult(null); };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if ((inputType === 'text' && !inputText.trim()) || (inputType === 'file' && !selectedFile)) {
            setError(inputType === 'text' ? 'Please enter some text.' : 'Please select or drop a file.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysisResult(null);
        const formData = new FormData();
        if (inputType === 'file') { formData.append('file', selectedFile); } else { formData.append('text', inputText); }
        try {
            const response = await fetch(`${BASE_URL}/analyzer/upload/`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            let data = await response.json();
            if (typeof data.analysis === 'string') {
                const cleanedString = data.analysis.replace(/```json\n|```/g, '');
                data.analysis = JSON.parse(cleanedString);
            }
            setAnalysisResult(data);
        } catch (err) {
            console.error("Analysis failed:", err);
            setError('Failed to get analysis. Please check the console.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) { setSelectedFile(file); setError(''); setAnalysisResult(null); } };
    const onDropZoneClick = () => { fileInputRef.current.click(); };
    const get = (key) => analysisResult?.[key] ?? analysisResult?.analysis?.[key];

    return (
        <div className="analyzer-container">
            <header className="hero-section">
                <h1>📖 Insightlify</h1>
                <p className="subtitle">
                    Analyze. Improve. Increase Engagement — with Insightlify.
                </p>
            </header>

            <Features />

            <section className="input-section">
                <div className="tabs">
                    <button className={inputType === 'text' ? 'active-tab' : 'tab'} onClick={() => setInputType('text')}>Text Input</button>
                    <button className={inputType === 'file' ? 'active-tab' : 'tab'} onClick={() => setInputType('file')}>File Upload</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {inputType === 'text' ? (
                        <textarea value={inputText} onChange={handleTextChange} placeholder="Paste your text here..." className="textarea" rows="10" />
                    ) : (
                        <div className={`file-input-container ${isDragging ? 'active' : ''}`} onClick={onDropZoneClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.txt" style={{ display: 'none' }} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3.75 18A5.25 5.25 0 009 20.25h6A5.25 5.25 0 0020.25 15m-16.5 0A5.25 5.25 0 019 9.75h.386c-.01-.044-.022-.088-.022-.132a3.75 3.75 0 017.5 0c0 .044-.012.088-.022.132H15a5.25 5.25 0 015.25 5.25m-16.5 0l2.25-2.25" /></svg>
                            {selectedFile ? <p>Selected File: <strong>{selectedFile.name}</strong></p> : <p><strong>Drag & Drop</strong> your file here, or click to select</p>}
                        </div>
                    )}
                    <button type="submit" className="submit-button" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Analyze Content'}</button>
                </form>
                {error && <p className="error-text">{error}</p>}
            </section>

            {isLoading && <div className="spinner"></div>}

            {analysisResult && (
                 <section className="results-container">
                    <h2 className="section-title">Analysis Results</h2>
                    
                    <div className="key-metrics">
                        <AnalysisCard title="Sentiment"><p className="sentiment-value">{get('sentiment')}</p></AnalysisCard>
                        <AnalysisCard title="Engagement Score">
                           <div className="engagement-score-container">
                                <div className="score-circle" style={{ '--score-percent': `${get('engagement_score') * 10}%` }}>
                                    <div className="score-text">{get('engagement_score')}<span>/10</span></div>
                                </div>
                            </div>
                        </AnalysisCard>
                        <AnalysisCard title="Target Audience"><p>{get('audience')}</p></AnalysisCard>

                        {/* Suggestions card is now here */}
                        <AnalysisCard title="Suggestions for Improvement" className="suggestions-card">
                            <ul className="suggestions-list">
                                {(get('suggestions') ?? []).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </AnalysisCard>
                    </div>

                    <div className="results-grid" style={{marginTop: '20px'}}>
                        <AnalysisCard title="Emotions"><div className="pill-container">{(get('emotions') ?? []).map(e => <Pill key={e} text={e} />)}</div></AnalysisCard>
                        <AnalysisCard title="Main Topics"><div className="pill-container">{(get('topics') ?? []).map(t => <Pill key={t} text={t} />)}</div></AnalysisCard>
                        <AnalysisCard title="Suggested Hashtags"><div className="pill-container">{(get('hashtags') ?? []).map(h => <Pill key={h} text={h} />)}</div></AnalysisCard>
                    </div>
                    
                    <h2 className="section-title">Rewrites</h2>
                    <div className="results-grid">
                        <RewriteCard title="Friendly (Instagram Style)" text={get('rewrites')?.friendly ?? 'N/A'}/>
                        <RewriteCard title="Professional (LinkedIn Style)" text={get('rewrites')?.professional ?? 'N/A'}/>
                        <RewriteCard title="Concise (Twitter/X Style)" text={get('rewrites')?.concise ?? 'N/A'}/>
                    </div>
                </section>
            )}
        </div>
    );
}