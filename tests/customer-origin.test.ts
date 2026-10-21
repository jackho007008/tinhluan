import { afterEach, expect, it, vi } from "vitest";
import { customerRequestOrigin } from "../lib/customer-origin";
afterEach(()=>vi.unstubAllEnvs());
it("allows only canonical and explicitly configured customer origins, not internal origins",()=>{
 vi.stubEnv('APP_ORIGIN','http://localhost:3000');
 vi.stubEnv('CUSTOMER_ALLOWED_ORIGINS','https://demo.example.test');
 vi.stubEnv('INTERNAL_REVIEW_ALLOWED_ORIGINS','https://internal.example.test');
 expect(customerRequestOrigin('http://localhost:3000')).toBe(true);
 expect(customerRequestOrigin('https://demo.example.test')).toBe(true);
 for(const x of [null,'null','https://internal.example.test','https://demo.example.test.evil.test','http://demo.example.test','http://127.0.0.1:3000']) expect(customerRequestOrigin(x)).toBe(false);
});
it("malformed allowlists fail closed",()=>{
 vi.stubEnv('APP_ORIGIN','http://localhost:3000');
 for(const x of ['*','https://*.ngrok-free.app','https://demo.example.test/path','https://user:pass@demo.example.test','https://demo.example.test?x=1']){
 vi.stubEnv('CUSTOMER_ALLOWED_ORIGINS',x);expect(customerRequestOrigin('http://localhost:3000')).toBe(false);
 }
});

it("allows the explicit local homepage alongside a configured tunnel",()=>{
 vi.stubEnv('APP_ORIGIN','https://demo.example.test');
 vi.stubEnv('CUSTOMER_ALLOWED_ORIGINS','https://demo.example.test,http://localhost:3000');
 expect(customerRequestOrigin('http://localhost:3000')).toBe(true);
 expect(customerRequestOrigin('https://demo.example.test')).toBe(true);
 for(const value of ['http://localhost:3001','http://localhost:3000.evil.test','http://127.0.0.1:3000',null]) expect(customerRequestOrigin(value)).toBe(false);
});
