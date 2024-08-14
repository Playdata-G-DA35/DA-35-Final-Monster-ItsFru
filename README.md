# DA-35-Final-Monster-ItsFru

## (보완 예정)
## It's Fru : 객체 인식을 이용한 무인 과일 매장 결제 서비스
1. 인건비 절감을 위해 무인 매장이 늘어나는 추세 (기사)[],
2. 건강한 식문화에 대한 관심으로 과일 수요는 늘어나는 반면 (기사)[], 
3. 과일 가격의 소비자 부담은 늘어나고 있음 (기사)[], 하자가 있는 저렴한 과일에 대한 수요 (기사)[]
4. 무인 과일 매장은 이미 존재하는데(오롯)[], 비교적 문제가 되었던 점은 재고 처리 및 가격 태깅
5. 객체 인식을 통해 가격 태깅 및 손상율에 따른 할인 제공, 무인 결제 자동화 프로젝트

ItsFru/ 프로젝트 폴더 <br>
├── data/ 데이터셋 관련 <br>
├── backend/ 백엔드, Fast API <br>
├── frontend/ 프론트엔드, Next.JS <br>
├── models/ Yolo 및 기타 비전, 회귀 모델 <br>
├── notebooks/ 작업 과정 노트북들 <br>
├── tests/ 실행, 확인 테스트용 <br>
├── docs/ 설명 문서 <br>
├── references/ 참조 문서 <br>
Reports/ 산출물 관련 <br>


```
DA-35-Final-Monster-ItsFru
├─ .gitignore
├─ ItsFru
│  ├─ .gitignore
│  ├─ backend
│  │  ├─ app
│  │  │  ├─ api
│  │  │  │  ├─ crud.py
│  │  │  │  ├─ dependencies.py
│  │  │  │  ├─ endpoints
│  │  │  │  │  ├─ auth.py
│  │  │  │  │  ├─ products.py
│  │  │  │  │  ├─ store.py
│  │  │  │  │  ├─ user.py
│  │  │  │  │  └─ __init__.py
│  │  │  │  ├─ models.py
│  │  │  │  ├─ schemas.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ core
│  │  │  │  ├─ aws_rds.py
│  │  │  │  ├─ aws_s3.py
│  │  │  │  ├─ config.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ db
│  │  │  │  ├─ base.py
│  │  │  │  ├─ session.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ main.py
│  │  │  ├─ services
│  │  │  │  ├─ payment_service.py
│  │  │  │  └─ recognition_service.py
│  │  │  └─ __init__.py
│  │  └─ FastAPI.md
│  ├─ frontend
│  │  ├─ .eslintrc.json
│  │  ├─ .gitignore
│  │  ├─ frontend.md
│  │  ├─ next.config.js
│  │  ├─ next.config.mjs
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ postcss.config.js
│  │  ├─ postcss.config.mjs
│  │  ├─ public
│  │  │  ├─ favicon.ico
│  │  │  ├─ icons
│  │  │  │  └─ 192_logo_icon.png
│  │  │  ├─ images
│  │  │  │  ├─ logo-home.png
│  │  │  │  └─ logo-original.png
│  │  │  ├─ manifest.json
│  │  │  ├─ service-worker.js
│  │  │  ├─ sw.js
│  │  ├─ src
│  │  │  ├─ components
│  │  │  │  ├─ Button
│  │  │  │  │  ├─ Button.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ Card
│  │  │  │  │  ├─ Card.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ ErrorMessage
│  │  │  │  │  ├─ ErrorMessage.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ Footer
│  │  │  │  │  ├─ Footer.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ Header
│  │  │  │  │  ├─ Header.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ Input
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ Input.tsx
│  │  │  │  ├─ LogoutButton
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ LogoutButton.tsx
│  │  │  │  ├─ Modal
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ Modal.tsx
│  │  │  │  ├─ Spinner
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ Spinner.tsx
│  │  │  │  ├─ Tap
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ Tap.tsx
│  │  │  │  └─ Toast
│  │  │  │     ├─ index.ts
│  │  │  │     └─ Toast.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockUsers.json
│  │  │  ├─ pages
│  │  │  │  ├─ api
│  │  │  │  │  └─ hello.ts
│  │  │  │  ├─ checkout.tsx
│  │  │  │  ├─ fruit-info.tsx
│  │  │  │  ├─ fruit-select.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ login.tsx
│  │  │  │  ├─ main.tsx
│  │  │  │  ├─ profile.tsx
│  │  │  │  ├─ purchase-history.tsx
│  │  │  │  ├─ qr-reader.tsx
│  │  │  │  ├─ signup.tsx
│  │  │  │  ├─ store-confirm.tsx
│  │  │  │  ├─ store-info.tsx
│  │  │  │  ├─ store-map.tsx
│  │  │  │  ├─ withdrawal.tsx
│  │  │  │  ├─ _app.tsx
│  │  │  │  └─ _document.tsx
│  │  │  └─ styles
│  │  │     └─ globals.css
│  │  ├─ tailwind.config.js
│  │  ├─ tailwind.config.ts
│  │  └─ tsconfig.json
│  ├─ infra
│  │  ├─ infra.md
│  │  └─ scripts
│  │     └─ aws.md
│  ├─ models
│  │  ├─ fruit_condition
│  │  │  └─ fruit_condition.md
│  │  ├─ fruit_price_prediction
│  │  │  └─ price_prediction.md
│  │  └─ fruit_recognition
│  │     └─ fruit_recognition.md
│  └─ tests
│     ├─ backend
│     ├─ etc
│     ├─ frontend
│     └─ models

```