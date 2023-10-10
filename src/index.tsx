import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {router} from "./routes";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <div>
            <RouterProvider router={router}/>
            <ToastContainer
                hideProgressBar={true}
                autoClose={2000}
                closeButton={false}
                position="top-right"
            />
        </div>
    </React.StrictMode>
);
