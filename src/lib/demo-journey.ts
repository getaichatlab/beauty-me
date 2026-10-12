// Only service/time choices are carried into the admin sandbox. Never customer input.
export type DemoBooking={id:string;service:string;date:string;time:string;createdAt:string};
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
const key='beauty-me-demo-bookings-v1';
const times=['anytime','morning','afternoon','evening'];
function browserStore():Store|undefined{try{return typeof window==='undefined'?undefined:window.sessionStorage;}catch{return undefined;}}
export function readDemoBookings(storage:Store|undefined=browserStore()):DemoBooking[]{
 try{const value=JSON.parse(storage?.getItem(key)||'[]');if(!Array.isArray(value))return[];
 return value.filter(v=>v&&typeof v.id==='string'&&/^demo-request-[a-f0-9-]{36}$/.test(v.id)&&typeof v.service==='string'&&/^[a-z0-9-]{1,60}$/.test(v.service)&&typeof v.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&times.includes(v.time)&&typeof v.createdAt==='string'&&!Number.isNaN(Date.parse(v.createdAt))).slice(-12).map(v=>({id:v.id,service:v.service,date:v.date,time:v.time,createdAt:v.createdAt}));
 }catch{return[];}
}
export function writeDemoBooking(input:{service:string;date:string;time:string},storage:Store|undefined=browserStore()):boolean{
 if(!storage||!/^[a-z0-9-]{1,60}$/.test(input.service)||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||!times.includes(input.time))return false;
 try{const item:DemoBooking={id:'demo-request-'+crypto.randomUUID(),service:input.service,date:input.date,time:input.time,createdAt:new Date().toISOString()};storage.setItem(key,JSON.stringify([...readDemoBookings(storage),item].slice(-12)));return true;}catch{return false;}
}
export function clearDemoBookings(storage:Store|undefined=browserStore()){try{storage?.removeItem(key);}catch{}}
