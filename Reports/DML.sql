-- 사용자 데이터 삽입
INSERT INTO Users (username, password, email, phone_number) VALUES
('홍길동', '$2a$10$xxxxxxxxxxxxxxxxxxxxxx', 'hong@example.com', '010-1234-5678'),
('김철수', '$2a$10$xxxxxxxxxxxxxxxxxxxxxx', 'kim@example.com', '010-2345-6789');

-- 상품 데이터 삽입
INSERT INTO Products (name, description, price, discount_rate, stock, status, image_url) VALUES
('사과', '신선한 유기농 사과입니다.', 3000.00, 15.00, 50, '판매중', 'https://example.com/apple.jpg'),
('바나나', '신선한 바나나입니다.', 2000.00, 0.00, 100, '판매중', 'https://example.com/banana.jpg');

-- 장바구니 데이터 삽입
INSERT INTO Cart (user_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 1, 5);

-- 주문 데이터 삽입
INSERT INTO Orders (user_id, total_amount, status) VALUES
(1, 6000.00, '완료'),
(2, 3000.00, '처리중');

-- 주문 상세 데이터 삽입
INSERT INTO Order_Items (order_id, product_id, quantity, price, discount_rate) VALUES
(1, 1, 2, 3000.00, 15.00),
(1, 2, 1, 2000.00, 0.00),
(2, 1, 5, 3000.00, 0.00);

-- 결제 데이터 삽입
INSERT INTO Payments (order_id, payment_type, amount, status) VALUES
(1, '신용카드', 6000.00, '성공'),
(2, '계좌이체', 3000.00, '성공');

-- 배송 데이터 삽입
INSERT INTO Shipping (order_id, address, city, state, zip_code, country, shipping_date, delivery_status) VALUES
(1, '서울시 강남구 테헤란로 123', '서울', '서울특별시', '06134', '대한민국', '2024-08-11 10:00:00', '배송 중'),
(2, '부산시 해운대구 해운대해변로 456', '부산', '부산광역시', '06135', '대한민국', '2024-08-12 10:00:00', '배송 완료');

-- 할인 정책 데이터 삽입
INSERT INTO Discounts (product_id, discount_rate, start_date, end_date) VALUES
(1, 20.00, '2024-08-10 00:00:00', '2024-08-20 23:59:59'),
(2, 10.00, '2024-08-15 00:00:00', '2024-08-25 23:59:59');