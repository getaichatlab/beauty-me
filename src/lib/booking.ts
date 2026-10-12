export function localDate(date=new Date()):string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function validPhone(value:string):boolean {
  const trimmed=value.trim();
  if(!/^\+?[\d\s()-]+$/.test(trimmed))return false;
  const digits=trimmed.replace(/\D/g,'');
  return digits.startsWith('998')?digits.length===12:digits.length>=9&&digits.length<=15;
}
export function formatDate(value:string,lang:'uz'|'ru'):string {
  const [year,month,day]=value.split('-').map(Number);
  const months={uz:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']};
  return lang==='uz'?`${day}-${months.uz[month-1]} ${year}`:`${day} ${months.ru[month-1]} ${year} г.`;
}
