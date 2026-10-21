'use client';
import {useEffect,useState} from 'react';
import TestCheckout from './TestCheckout';
import type {checkoutScope} from '@/lib/checkout/test';
/** A structural palace anchor only; no birth data, ownership or payment fields in the URL. */
export default function CheckoutAnchor({scope,login,returnTo}:{scope?:NonNullable<Awaited<ReturnType<typeof checkoutScope>>>;login?:boolean;returnTo?:string}){
 const [anchor,setAnchor]=useState('cung-0');useEffect(()=>{const h=window.location.hash.slice(1);if(/^cung-(?:[0-9]|1[01])$/.test(h))setAnchor(h);},[]);
 return login&&!scope?<form method="post" action="/api/account/google/start"><input type="hidden" name="returnTo" value={returnTo+'#'+anchor}/><button type="submit">Đăng nhập bằng Google</button></form>:<TestCheckout scope={scope} anchor={anchor} loginReturnTo={login?returnTo:undefined}/>;
}
