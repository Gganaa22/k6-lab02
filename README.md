# Lab 02: Гүйцэтгэлийн хэмжүүрийг k6-аар хэмжих

**Оюутны нэр:** Д.Гантогтох
**Оюутны код:** B242270139

## 1. k6 Version

k6 v2.2.0 (commit/00a9a1b7f5, go1.26.5, windows/amd64)

## 2. Гурван түвшний (5/30/100 VU) хэмжилтийн хүснэгт

| VU Түвшин | http_req_duration (p90) | http_req_duration (p95) | Throughput (http_reqs/s) | Error Rate (http_req_failed) |
| :--- | :--- | :--- | :--- | :--- |
| **5 VU** | 265.55ms | 271.92ms | 6.96 reqs/s | 0.00% |
| **30 VU** | 289.32ms | 309.05ms | 42.09 reqs/s | 0.00% |
| **100 VU** | 303.12ms | 380.72ms | 137.43 reqs/s | 0.00% |

## 3. Stages туршилт — АЖИГЛАЛТ (алдаа гарсан)

Эх сурвалж: results/run-stages.txt (stages_script.js: 5→30→100→0 VU, 2м30с)

checks_succeeded: 20.48% (42/205)
http_req_failed:  64.42% (163/253)
http_req_duration: avg=7.47s  p90=30.35s  p95=1m0s (timeout)

Энэ бол run-100vu.txt-ийн steady-state 100 VU (0% алдаа) үр дүнгээс эрс ялгаатай. Steady load (тогтмол 100 VU шууд эхлэх) ба ramping load (5-аас 100 хүртэл аажим өсөх) ижил дээд VU-тэй ч огт өөр үр дүн өгсөн нь: (1) test.k6.io нь гадаад, олон хэрэглэгч зэрэг ашигладаг демо сервер тул тогтмол багтаамжтай биш байж болно; (2) Windows дээр их хэмжээний зэрэгцээ connection нээгдэхэд ephemeral port / socket хязгаарт хүрсэн байж болно; (3) VU тоо огцом өсөхөд (ялангуяа 1m23s-с хойш хурдан ramp хэсэгт) сервер рүү connection storm үүссэн байж болзошгүй. Энэ нь steady-state тестийн p95-аас ganц дээд VU тоог хараад дүгнэх нь хангалтгүй, харин ачаалал нэмэгдэх хурд (ramp rate) өөрөө тусдаа хэмжигдэхүүн болохыг харуулж байна.


## 4. SLO (Threshold) Үндэслэл
Baseline тооцоолол

5 VU baseline (Алхам 2, run-05vu.txt): p95 = 271.92ms

SLO threshold = baseline × 1.5 = 271.92 × 1.5 ≈ 408ms

Pass туршилтын үр дүн (results/run-pass.txt)
thresholds_script.js дотор p(95)<408 босго тавьж ажиллуулахад дараах бодит үр дүн гарч PASS болсон:

Бодит p95 latency: 345.09ms (✓ 'p(95)<408')

Throughput: 40.46 req/s (2438 requests)

Error Rate: 0.00% (✓ 'rate<0.01')

FAIL демонстраци (results/run-fail.txt)
Хатуу threshold (p(95)<500ms / олон хүсэлттэй нөхцөлд) тавихад тест FAIL болж, k6 нь exit status code = 1 буцаасан. CI/CD pipeline яг энэ exit code-оор автомат build-ийг зогсоодог.


## 5. Дэлгэцийн зургууд

### Threshold PASS
![PASS](screenshots/pass.png)

### Threshold FAIL
![FAIL](screenshots/fail.png)

### Stages Test Output
![Stages](screenshots/stages.png)


## 6. Дүгнэлт
VU тоо 5-аас 100 болж өсөхөд throughput 6.96-аас 137.43 хүсэлт/секунд хүртэл бараг шугаман өссөн бол p95 latency 271.92ms-ээс 380.72ms хүртэл дунд зэрэг (~40%) нэмэгдсэн — энэ нь Лекц 2-ын "ачаалал өсөхөд throughput ба latency хоорондын зөрчил үүсдэг" ойлголтыг баталж байна. Гурван steady-state түвшинд алдааны хувь 0% хэвээр байсан нь test.k6.io тогтмол ачаалалд сайн даацтай болохыг харуулна. Харин ижил дээд 100 VU-тэй ч ramping (stages) хувилбарт checks_succeeded 20.48% хүртэл унаж, http_req_failed 64.42% болсон нь маш чухал ялгаа — steady load ба ramping load нь ижил VU дээр ч бүрэн өөр үр дүн өгч болохыг харуулж байна. SLO threshold-оо 5 VU-ийн бодит p95 (271.92ms) дээр суурилж 408ms болгон шинэчлэхэд бодит p95 нь 345.09ms гарж амжилттай PASS болсон. Харин хатуу threshold тавихад тест FAIL болж exit status 1 буцаасан нь CI pipeline-ийн quality gate хэрхэн ажилладгийг харуулсан.