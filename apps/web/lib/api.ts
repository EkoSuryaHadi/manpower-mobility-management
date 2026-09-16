import { authenticatedHeaders } from "./auth-headers";
export async function api<T>(path:string, init:RequestInit={}):Promise<T>{
 const response=await fetch("/api/backend/"+path,{...init,headers:await authenticatedHeaders(init.body?{"content-type":"application/json"}:{})});
 if(!response.ok){let message="Permintaan gagal ("+response.status+").";try{const body=await response.json();if(typeof body.detail==="string")message=body.detail;}catch{}throw new Error(message);}
 return response.json();
}
export async function downloadReport(){
 const response=await fetch("/api/backend/reports/assignments.csv",{headers:await authenticatedHeaders()});
 if(!response.ok)throw new Error("Laporan belum dapat diunduh.");
 const url=URL.createObjectURL(await response.blob()); const a=document.createElement("a");a.href=url;a.download="penugasan.csv";a.click();URL.revokeObjectURL(url);
}
