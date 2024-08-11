-- 사용자 정보 테이블 생성
CREATE TABLE Users COMMENT '사용자 정보 테이블' (
    user_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 사용자 고유 ID',
    username VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시 저장)',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일 주소 (유니크 제약조건)',
    phone_number VARCHAR(15) COMMENT '전화번호',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일'
);

-- 상품 정보 테이블 생성
CREATE TABLE Products COMMENT '상품 정보 테이블' (
    product_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 상품 고유 ID',
    name VARCHAR(100) NOT NULL COMMENT '상품 이름',
    description TEXT COMMENT '상품 설명',
    price DECIMAL(10, 2) NOT NULL COMMENT '상품 가격',
    discount_rate DECIMAL(5, 2) DEFAULT 0 COMMENT '할인율 (기본값 0)',
    stock INT NOT NULL COMMENT '재고 수량',
    status VARCHAR(20) NOT NULL COMMENT '상품 상태 (예: 판매중, 재고부족, 단종)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '상품 등록일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '상품 수정일',
    image_url VARCHAR(255) COMMENT '상품 이미지 URL'
);

-- 장바구니 정보 테이블 생성
CREATE TABLE Cart COMMENT '장바구니 정보 테이블' (
    cart_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 장바구니 고유 ID',
    user_id INT COMMENT '외래키, 사용자 ID',
    product_id INT COMMENT '외래키, 상품 ID',
    quantity INT NOT NULL COMMENT '수량',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '장바구니에 추가된 일자',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- 주문 정보 테이블 생성
CREATE TABLE Orders COMMENT '주문 정보 테이블' (
    order_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 주문 고유 ID',
    user_id INT COMMENT '외래키, 사용자 ID',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '총 주문 금액',
    status VARCHAR(20) NOT NULL COMMENT '주문 상태 (예: 처리중, 완료, 취소)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '주문 일자',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 주문 상세 정보 테이블 생성
CREATE TABLE Order_Items COMMENT '주문 상세 정보 테이블' (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 주문 상세 고유 ID',
    order_id INT COMMENT '외래키, 주문 ID',
    product_id INT COMMENT '외래키, 상품 ID',
    quantity INT NOT NULL COMMENT '수량',
    price DECIMAL(10, 2) NOT NULL COMMENT '상품 가격 (주문 시점 가격)',
    discount_rate DECIMAL(5, 2) COMMENT '적용된 할인율',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) 
    FOREIGN KEY (product_id) REFERENCES Products(product_id) 
);

-- 결제 정보 테이블 생성
CREATE TABLE Payments COMMENT '결제 정보 테이블' (
    payment_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 결제 고유 ID',
    order_id INT COMMENT '외래키, 주문 ID',
    payment_type VARCHAR(20) NOT NULL COMMENT '결제 방법 (예: 신용카드, 계좌이체)',
    amount DECIMAL(10, 2) NOT NULL COMMENT '결제 금액',
    status VARCHAR(20) NOT NULL COMMENT '결제 상태 (예: 성공, 실패)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '결제 일시',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- 배송 정보 테이블 생성
CREATE TABLE Shipping COMMENT '배송 정보 테이블' (
    shipping_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 배송 고유 ID',
    order_id INT COMMENT '외래키, 주문 ID',
    address VARCHAR(255) NOT NULL COMMENT '배송 주소',
    city VARCHAR(100) NOT NULL COMMENT '도시',
    state VARCHAR(100) NOT NULL COMMENT '주/도',
    zip_code VARCHAR(20) NOT NULL COMMENT '우편번호',
    country VARCHAR(100) NOT NULL COMMENT '국가',
    shipping_date DATETIME NOT NULL COMMENT '배송일',
    delivery_status VARCHAR(20) NOT NULL COMMENT '배송 상태 (예: 배송 중, 배송 완료, 반품)',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- 할인 정책 테이블 생성
CREATE TABLE Discounts COMMENT '할인 정책 테이블' (
    discount_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '기본키, 할인 정책 고유 ID',
    product_id INT COMMENT '외래키, 상품 ID',
    discount_rate DECIMAL(5, 2) NOT NULL COMMENT '할인율 (0~100)',
    start_date DATETIME NOT NULL COMMENT '할인 시작일',
    end_date DATETIME NOT NULL COMMENT '할인 종료일',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '할인 정책 등록일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '할인 정책 수정일',
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);