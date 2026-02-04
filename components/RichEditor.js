'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

export default function RichEditor({ value, onChange }) {
    // Dynamic import to avoid SSR issues with Quill
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), []);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    return (
        <div className="rich-editor-container">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                style={{ height: '300px', marginBottom: '50px' }} // Extra margin for toolbar
            />
        </div>
    );
}
