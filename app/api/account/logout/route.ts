import type {NextRequest} from 'next/server';
import {logoutCustomer} from '@/lib/customer-auth/accounts';
import {CUSTOMER_COOKIE,OAUTH_COOKIE} from '@/lib/customer-auth/config';
import {accountGuard,accountRedirect,accountCookie} from '@/lib/customer-auth/http';
export async function POST(req:NextRequest){const denied=accountGuard(req);if(denied)return denied;await logoutCustomer(req.cookies.get(CUSTOMER_COOKIE)?.value);const response=accountRedirect(req,'/la-so-cua-toi?notice=logout');response.cookies.set(CUSTOMER_COOKIE,'',accountCookie(req,0));response.cookies.set(OAUTH_COOKIE,'',accountCookie(req,0));return response;}
