# Mfumo wa Usimamizi wa Restaurant (QR-Based Restaurant System)

**Toleo:** 1.0
**Aina ya Hati:** System Design Document (SDD)
**Lengo:** Mfumo unaomruhusu mteja kuscan QR kwenye meza yake, kuona alichohudumiwa, ku-order, na kulipa — ikiwemo *split payment* (kila mtu analipia chakula chake tu), pamoja na management panels kamili kwa mmiliki wa hoteli.

---

## 1. Utangulizi

Huu ni mfumo wa kidijitali unaobadilisha jinsi restaurant/hoteli inavyoendesha huduma za mezani na malipo. Kila meza ina **QR code ya kipekee** iliyounganishwa na namba ya meza (`table number`). Mteja akiingia, anascan QR ile na mara moja anaona:

- Menyu ya restaurant husika
- Vyakula/vinywaji vilivyoletwa kwenye meza yake (**what was served**)
- Jumla ya bili yake
- Njia za kulipa — ikiwemo kulipa **sehemu yake tu** (split payment)

Upande wa biashara, **mmiliki wa hoteli** anajisajili, anaweka menyu/meals zake, anaunda meza na QR zake, na anapata **management panels** za mauzo, wafanyakazi, jikoni na ripoti.

Mfumo ni **multi-tenant**: hoteli nyingi zinaweza kutumia mfumo mmoja, kila moja ikiwa na data, menyu, meza na wafanyakazi wake tofauti.

---

## 2. Malengo ya Mfumo

| # | Lengo | Maelezo |
|---|-------|---------|
| 1 | QR kwa kila meza | Kila meza ina QR + namba ya kipekee inayoelekeza kwenye session ya meza hiyo |
| 2 | Contactless menu & ordering | Mteja anaona menyu na anaweza ku-order bila kusubiri mhudumu |
| 3 | Kuona "what was served" | Mteja anaona orodha halisi ya vitu vilivyoletwa mezani kwake |
| 4 | Malipo ya kidijitali | Mteja analipa kupitia simu (Mobile Money, kadi, cash confirmation) |
| 5 | **Split payment** | Watu kadhaa mezani wanaweza kugawana bili — kila mmoja analipia alichokula tu |
| 6 | Management ya mauzo | Ripoti za mauzo, bidhaa zinazouzwa zaidi, mapato ya kila siku/wiki/mwezi |
| 7 | Multi-panel | Panels tofauti kwa Admin, Mmiliki, Meneja, Mhudumu, Jikoni |
| 8 | Multi-tenant | Hoteli nyingi kwenye mfumo mmoja, data ikitengana kabisa |

---

## 3. Watumiaji wa Mfumo (User Roles)

Mfumo una madaraja sita ya watumiaji, kila moja likiwa na paneli na ruhusa zake:

### 3.1 Super Admin (Mmiliki wa Mfumo Mzima)
- Anasimamia mfumo mzima na hoteli zote zilizojisajili.
- Ana-approve/ku-suspend hoteli.
- Anaweka bei za subscription/packages.
- Anaona takwimu za jumla (hoteli ngapi, mauzo ya jumla, matumizi ya mfumo).

### 3.2 Mmiliki wa Restaurant (Owner)
- Anajisajili na kufungua akaunti ya restaurant yake.
- Anaweka taarifa za biashara (jina, logo, anwani, currency, ushuru/VAT).
- Anaunda **menyu na meals** (categories, bidhaa, bei, picha).
- Anaunda **meza** na kutengeneza **QR codes**.
- Anaongeza wafanyakazi (mameneja, wahudumu, wapishi).
- Anaona **ripoti zote za mauzo** na financial dashboard.

### 3.3 Meneja (Manager)
- Anasimamia shughuli za kila siku.
- Ana-manage orders, meza na wafanyakazi wa zamu.
- Anaona ripoti za mauzo (bila ruhusa za settings nyeti).
- Anaweza kubadilisha upatikanaji wa bidhaa (in stock / out of stock).

### 3.4 Mhudumu (Waiter)
- Anaona orders zinazoingia kwenye meza alizopewa.
- Ana-confirm chakula kimefika mezani (**"served"**).
- Anaweza ku-order kwa niaba ya mteja.
- Anasaidia kwenye malipo (cash confirmation).

### 3.5 Jikoni (Kitchen / KDS – Kitchen Display System)
- Anaona orders mpya real-time.
- Anabadilisha status: *Received → Preparing → Ready*.
- Order ikiwa "Ready", mhudumu anapata notification aichukue.

### 3.6 Mteja (Customer)
- **Hahitaji ku-login** — anascan QR tu.
- Anaona menyu na anaweza ku-order.
- Anaona "what was served" kwenye meza yake.
- Anaona bili na analipa (full au split).

---

## 4. Vipengele Vikuu (Core Features)

### 4.1 QR Code kwa Kila Meza
- Kila meza ina record yenye: `table_number`, `table_qr_token` (kipekee, random), na status.
- QR ina-encode URL kama: `https://app.jina.co.tz/t/{restaurant_id}/{table_qr_token}`
- Mteja akiscan, mfumo unafungua **session ya meza** (table session) — kikundi cha watu wanaokula pamoja.
- QR **haibadiliki** (imechapishwa/imebandikwa mezani), lakini kila mlo/session ni tofauti.

### 4.2 Table Session (Kikao cha Meza)
Dhana muhimu: **session** ndiyo inayounganisha orders + watu + malipo ya mlo mmoja.

- Mteja wa kwanza akiscan → session mpya inafunguliwa (status: `open`).
- Watu wengine wa meza hiyo hiyo wakiscan → wanajiunga na session ile ile.
- Session inafungwa (`closed`) baada ya bili yote kulipwa.

### 4.3 Digital Menu & Ordering
- Menyu imepangwa kwa **categories** (mfano: Vinywaji, Nyama, Wali, Dessert).
- Kila bidhaa ina: jina, maelezo, bei, picha, muda wa maandalizi, status ya upatikanaji.
- Mteja anaongeza kwenye **cart**, anaweka maelezo ("bila pilipili"), anatuma order.
- Order inaenda **jikoni** (KDS) na kwa **mhudumu** real-time.

### 4.4 "What Was Served" (Kilichohudumiwa)
- Kila item ya order ina status ya **served / not served**.
- Mhudumu anaweka alama "served" chakula kikifika mezani.
- Mteja anaona kwenye meza yake orodha ya vilivyoletwa + bei zake — ndiyo msingi wa bili.

### 4.5 Split Payment (Kugawana Malipo) ⭐
Hii ndiyo feature kuu uliyoisisitiza. Njia tatu za kugawanya:

**(a) Split by Item — "Kila mtu alipie alichokula tu"**
- Kila item mezani inaonyeshwa.
- Kila mtu anachagua **items zake** (au mhudumu anaziweka kwenye jina la mtu).
- Mfumo unahesabu jumla ya kila mtu peke yake.
- Kila mmoja analipa sehemu yake; item ikishalipwa inaonekana **"paid"** ili isiwe double-paid.

**(b) Split Equally — "Gawa sawa kwa idadi ya watu"**
- Jumla ya bili ÷ idadi ya watu = kiasi cha kila mmoja.

**(c) Split by Amount — "Kila mtu achangie kiasi anachotaka"**
- Mtu anaweka kiasi (mfano anachangia 20,000/=), mfumo unapunguza kwenye bili iliyobaki.

> **Kanuni ya usalama:** Mfumo unafuatilia `paid_amount` dhidi ya `total_amount`. Session haiwezi kufungwa mpaka bili yote ilipwe. Kila malipo yana record (nani, kiasi gani, njia gani, saa ngapi).

### 4.6 Malipo (Payment Methods)
- **Mobile Money** (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) kupitia payment gateway.
- **Kadi** (Visa/Mastercard) kupitia gateway.
- **Cash** — mteja anachagua "cash", mhudumu anapokea pesa na ku-confirm kwenye app yake.
- Kila malipo yanaunda **receipt ya kidijitali** (na chaguo la kutuma SMS/email).

### 4.7 Sales Management & Analytics
- Dashboard ya mauzo: leo, wiki, mwezi, mwaka.
- Bidhaa zinazouzwa zaidi (**top sellers**) na zisizouzwa (**slow movers**).
- Mauzo kwa muda (peak hours), kwa meza, kwa mhudumu.
- Mapato kwa njia ya malipo (Mobile Money vs Cash vs Card).
- Export ya ripoti (PDF / Excel).

---

## 5. Mtiririko wa Matumizi (User Flows)

### 5.1 Mtiririko wa Mteja (Customer Flow)
```
1. Mteja anakaa mezani
2. Anascan QR ya meza  →  App inafunguka (hakuna login)
3. Anaona menyu + "meza yangu" (kilichoagizwa/kilicholetwa)
4. Anaongeza vitu kwenye cart  →  anatuma order
5. Order inaenda jikoni + mhudumu
6. Jikoni: Received → Preparing → Ready
7. Mhudumu analeta chakula  →  ana-mark "served"
8. Mteja anaona "what was served" + bili
9. Anachagua kulipa:
      → Lipa yote (full)
      → Split by item (alichokula tu)
      → Split equally
      → Split by amount
10. Malipo yanakamilika  →  receipt ya kidijitali
11. Bili yote ikilipwa  →  session inafungwa
```

### 5.2 Onboarding ya Mmiliki (Owner Flow)
```
1. Mmiliki anajisajili (jina, email, simu)
2. Anaweka taarifa za restaurant (logo, anwani, currency, VAT)
3. Anachagua package/subscription
4. Anaunda categories + kuweka meals/bidhaa (bei, picha)
5. Anaunda meza (namba)  →  mfumo unazalisha QR kila meza
6. Ana-print / kubandika QR mezani
7. Anaongeza wafanyakazi + ku-assign roles
8. Restaurant iko "live" — tayari kupokea wateja
```

### 5.3 Mtiririko wa Jikoni (Kitchen Flow)
```
Order mpya  →  inaonekana kwenye Kitchen Display (KDS)
Mpishi: "Preparing"  →  akimaliza: "Ready"
Notification inaenda kwa mhudumu wa meza husika
```

---

## 6. Muundo wa Kiufundi (System Architecture)

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENTS (Watumiaji)                    │
│  Customer PWA │ Owner Panel │ Waiter App │ Kitchen (KDS)  │
│  Manager Panel │ Super Admin Panel                        │
└─────────────────────────┬────────────────────────────────┘
                          │  HTTPS / REST + WebSocket
┌─────────────────────────▼────────────────────────────────┐
│                    BACKEND API SERVER                      │
│  Auth │ Menu │ Orders │ Tables/QR │ Payments │ Reports    │
│  Real-time engine (WebSocket) kwa live orders             │
└──────┬───────────────────────┬─────────────────┬─────────┘
       │                       │                 │
┌──────▼──────┐      ┌─────────▼────────┐  ┌─────▼─────────┐
│  Database   │      │ Payment Gateway  │  │ Notifications │
│ (PostgreSQL)│      │ (M-Pesa/Tigo/    │  │ (SMS / Email  │
│             │      │  Card gateway)   │  │  / Push)      │
└─────────────┘      └──────────────────┘  └───────────────┘
```

**Vipengele muhimu:**
- **Real-time (WebSocket):** orders zinaonekana jikoni/kwa mhudumu papo hapo bila ku-refresh.
- **PWA (Progressive Web App)** kwa mteja: inafunguka kwenye browser bila kupakua app.
- **Multi-tenant isolation:** kila query inachujwa kwa `restaurant_id`.

---

## 7. Muundo wa Database (Database Schema)

Zifuatazo ni jedwali kuu (tables) za mfumo:

### `restaurants`
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | Kitambulisho cha restaurant |
| name | string | Jina la restaurant |
| logo_url | string | Logo |
| currency | string | Mfano: TZS |
| vat_percent | decimal | Ushuru (%) |
| subscription_status | enum | active / suspended |
| created_at | timestamp | |

### `users` (wafanyakazi)
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| restaurant_id | UUID (FK) | Ni wa hoteli gani |
| name | string | |
| phone / email | string | |
| password_hash | string | |
| role | enum | super_admin / owner / manager / waiter / kitchen |

### `tables` (meza)
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| restaurant_id | UUID (FK) | |
| table_number | string | Namba ya meza (mf. "T-05") |
| qr_token | string (unique) | Token ya QR |
| status | enum | free / occupied |

### `menu_categories`
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| restaurant_id | UUID (FK) | |
| name | string | Mf. "Vinywaji" |
| sort_order | int | |

### `menu_items` (meals)
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| restaurant_id | UUID (FK) | |
| category_id | UUID (FK) | |
| name | string | |
| description | text | |
| price | decimal | |
| image_url | string | |
| prep_time_min | int | Muda wa maandalizi |
| is_available | boolean | In stock / out of stock |

### `table_sessions` (kikao cha meza)
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| restaurant_id | UUID (FK) | |
| table_id | UUID (FK) | |
| status | enum | open / closed |
| total_amount | decimal | Jumla ya bili |
| paid_amount | decimal | Kilicholipwa hadi sasa |
| opened_at / closed_at | timestamp | |

### `orders`
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| session_id | UUID (FK) | Ni kikao gani |
| placed_by | enum | customer / waiter |
| status | enum | received / preparing / ready / served |
| created_at | timestamp | |

### `order_items`
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| order_id | UUID (FK) | |
| menu_item_id | UUID (FK) | |
| quantity | int | |
| unit_price | decimal | Bei wakati wa ku-order |
| notes | text | Mf. "bila pilipili" |
| served | boolean | Kimeletwa mezani? |
| paid | boolean | Kimelipiwa? (muhimu kwa split) |
| paid_by_label | string | Nani alilipia (kwa split by item) |

### `payments`
| Column | Aina | Maelezo |
|--------|------|---------|
| id | UUID (PK) | |
| session_id | UUID (FK) | |
| amount | decimal | Kiasi kilicholipwa |
| method | enum | mobile_money / card / cash |
| split_type | enum | full / by_item / equal / by_amount |
| payer_label | string | Jina/kitambulisho cha aliyelipa |
| status | enum | pending / completed / failed |
| transaction_ref | string | Reference ya gateway |
| created_at | timestamp | |

> **Uhusiano muhimu:** `restaurant → tables → sessions → orders → order_items`, na `sessions → payments`. Field za `served` na `paid` kwenye `order_items` ndizo zinazowezesha "what was served" na "split payment".

---

## 8. Paneli za Usimamizi (Management Panels)

### 8.1 Super Admin Panel
- Orodha ya hoteli zote + status.
- Approve / suspend hoteli.
- Usimamizi wa subscriptions/packages.
- Takwimu za jumla za mfumo.

### 8.2 Owner Panel (Muhimu Zaidi)
- **Dashboard:** mauzo ya leo, orders active, top sellers.
- **Menu Management:** categories, meals, bei, picha, upatikanaji.
- **Table & QR Management:** unda meza, zalisha/print QR.
- **Staff Management:** ongeza wafanyakazi + roles.
- **Sales Reports:** kwa siku/wiki/mwezi, export PDF/Excel.
- **Settings:** logo, currency, VAT, payment accounts.

### 8.3 Manager Panel
- Live orders board (meza zote).
- Manage upatikanaji wa bidhaa.
- Ripoti za mauzo za kila siku.
- Usimamizi wa zamu za wafanyakazi.

### 8.4 Waiter App
- Meza alizopewa + orders zake.
- Weka "served" kwa items.
- Order kwa niaba ya mteja.
- Cash confirmation.

### 8.5 Kitchen Display (KDS)
- Orders mpya real-time.
- Badilisha status (Preparing / Ready).
- Mpangilio wa vipaumbele (FIFO au kwa muda).

---

## 9. Malipo & Split Payment (Kina)

### Mfano wa Split by Item
Fikiria meza yenye watu 3 (Asha, Juma, Neema), bili ya jumla **45,000/=**:

| Item | Bei | Aliyekula |
|------|-----|-----------|
| Wali maharage | 8,000 | Asha |
| Juisi | 4,000 | Asha |
| Nyama choma | 15,000 | Juma |
| Soda | 3,000 | Juma |
| Chips kuku | 12,000 | Neema |
| Maji | 3,000 | Neema |

- **Asha analipa 12,000** (wali + juisi) → items zake zinawekwa "paid".
- **Juma analipa 18,000** (nyama + soda).
- **Neema analipa 15,000** (chips + maji).
- Mfumo: `paid_amount = 45,000 = total_amount` → session **closed** ✅

> Kila mtu anascan QR ile ile, anachagua items zake, analipa peke yake. Item iliyolipwa haionekani tena kwa mwingine.

### Uthibitisho wa Usalama wa Malipo
- Malipo yote yanapita **payment gateway** yenye usalama (hakuna kushika kadi/PIN moja kwa moja).
- Kila transaction ina `transaction_ref` inayohifadhiwa.
- Cash inahitaji **confirmation ya mhudumu** ili kuzuia udanganyifu.
- Session **haiwezi kufungwa** kama `paid_amount < total_amount`.

---

## 10. Teknolojia Inayopendekezwa (Tech Stack)

| Sehemu | Teknolojia (Chaguo) | Sababu |
|--------|---------------------|--------|
| Frontend (Customer PWA) | React / Next.js | PWA, inafunguka bila kupakua app |
| Panels (Admin/Owner) | React + component library | UI za dashboard |
| Backend API | Node.js (NestJS) au Laravel/Django | Imara, ina community kubwa |
| Database | PostgreSQL | Uhusiano imara, multi-tenant |
| Real-time | WebSocket (Socket.io) | Live orders/KDS |
| QR generation | Maktaba ya QR (server-side) | Kutengeneza QR za meza |
| Payments | Payment gateway ya Mobile Money + card | M-Pesa/Tigo/Airtel + Visa/MC |
| Hosting | Cloud (VPS / managed) | Uwezo wa kupanuka |
| Notifications | SMS gateway + Push (PWA) | Receipt + notifications |

> **Kumbuka:** Vituo hivi ni mapendekezo; timu ya development inaweza kuchagua stack nyingine yenye uwezo sawa.

---

## 11. Usalama (Security)

- **Data isolation:** kila hoteli inaona data yake tu (`restaurant_id` scoping kwenye kila query).
- **Roles & permissions:** kila daraja lina ruhusa mahususi (RBAC).
- **QR token:** random & isiyokisiwa; inaweza ku-rotate ikiibiwa.
- **Payment security:** PCI-conscious — tumia gateway, usihifadhi taarifa nyeti za kadi.
- **Audit log:** kila malipo/refund/badiliko nyeti linahifadhiwa (nani, lini).
- **HTTPS** kila mahali; passwords zime-hash (bcrypt/argon2).

---

## 12. Awamu za Utekelezaji (Implementation Roadmap)

| Awamu | Vipengele | Matokeo |
|-------|-----------|---------|
| **Awamu 1 — MVP** | Owner signup, menu, tables + QR, mteja anascan & anaona menyu, ordering, KDS, malipo ya full | Restaurant moja inaweza kuendesha huduma |
| **Awamu 2 — Split Payment** | Split by item / equal / by amount, receipts za kidijitali | Kila mtu analipia chake |
| **Awamu 3 — Analytics** | Sales dashboard, top sellers, export ripoti | Maamuzi ya kibiashara |
| **Awamu 4 — Scale** | Multi-tenant kamili, super admin, subscriptions, SMS/push | Hoteli nyingi + biashara ya mfumo |

---

## 13. Muhtasari (Summary)

Mfumo huu unatatua matatizo makuu ya restaurant ya kisasa:
- **Mteja:** anascan QR, anaona alichohudumiwa, anaagiza, na **analipia chake tu** kupitia split payment.
- **Mmiliki:** anajisajili, anaweka meals, anaunda meza + QR, na anapata **management panels** kamili za mauzo, wafanyakazi na jikoni.
- **Biashara:** ni **multi-tenant** — hoteli nyingi kwenye mfumo mmoja, ukiwa na uwezo wa kupanuka.

Muundo umepangwa kwa **awamu** ili kuanza na MVP kisha kuongeza vipengele hatua kwa hatua.

---

*Mwisho wa hati.*
