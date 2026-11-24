import http from 'k6/http';
import { sleep, check } from 'k6';

// FAIL демонстраци: results/run-fail.txt энэ скриптээр гарсан.
// thresholds_script.js-тэй ялгаа нь зөвхөн p(95) босго (408 -> 50).
export const options = {
    vus: 30,
    duration: '1m',
    thresholds: {
        http_req_duration: ['p(95)<50'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const res = http.get('https://test.k6.io');
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}