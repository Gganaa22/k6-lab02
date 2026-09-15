import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 5 },   // Халаалт
        { duration: '1m',  target: 30 },  // Өсгөлт
        { duration: '30s', target: 100 }, // Оргил
        { duration: '30s', target: 0 },   // Буулт[cite: 1]
    ],
};

export default function () {
    const res = http.get('https://test.k6.io');
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}
