import type {NextRequest} from 'next/server';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {checkoutOrder} from '@/lib/checkout/test';
import {trialJson} from '@/lib/trial/http';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const order=await checkoutOrder(req.cookies.get(CUSTOMER_COOKIE)?.value,(await params).id);
 return order?trialJson(order):trialJson({error:'Không mở được đơn hàng.'},404);
}
