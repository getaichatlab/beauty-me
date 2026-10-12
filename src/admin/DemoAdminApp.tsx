import {useState} from 'react';
import AdminApp from './AdminApp';
import {createDemoTransport} from './demo';
export default function DemoAdminApp(){
 const [transport]=useState(()=>{let storage;try{storage=typeof window!=='undefined'?window.sessionStorage:undefined;}catch{}return createDemoTransport(storage);});
 return <AdminApp transport={transport.api} demo onResetDemo={transport.reset}/>;
}
