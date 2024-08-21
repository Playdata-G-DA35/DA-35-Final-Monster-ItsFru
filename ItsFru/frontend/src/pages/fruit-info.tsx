import React from 'react';
import Image from 'next/image';
import { Card, Button } from '@components';
import { useRouter } from 'next/router';
import { useCart } from '@contexts/CartContext';
import { toast } from 'react-toastify';

const FruitInfo: React.FC = () => {
    const router = useRouter();
    const { addToCart } = useCart();

    const fruitOptions = [
        {
            id: 'apple-hongok',
            name: '사과 - 홍옥',
            quality: '상',
            freshness: '보통',
            originalPrice: 2000,
            damageRate: '8%',
            discountRate: '10%',
            salePrice: 1800,
            image: '/images/logo-original.png',
        },
        {
            id: 'banana-chiquita',
            name: '바나나 - 치키타',
            quality: '중',
            freshness: '좋음',
            originalPrice: 1500,
            damageRate: '5%',
            discountRate: '15%',
            salePrice: 1275,
            image: '/images/logo-original.png',
        },
    ];

    const randomFruit = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];

    const handleAddToCart = () => {
        addToCart({
            id: `${randomFruit.id}-${Date.now()}`, // 고유한 ID 생성
            name: randomFruit.name,
            price: randomFruit.salePrice,
        });
        toast.success('장바구니에 담겼습니다.');
        router.push('/cart');
    };

    const handleSelectAgain = () => {
        router.push('/fruit-select');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">과일 분석 결과</h2>
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src={randomFruit.image}
                        alt="과일 이미지"
                        width={150}
                        height={150}
                        className="mb-4"
                    />
                    <ul className="text-lg">
                        <li>과일: {randomFruit.name.split(' - ')[0]}</li>
                        <li>품종: {randomFruit.name.split(' - ')[1]}</li>
                        <li>품질: {randomFruit.quality}</li>
                        <li>신선도: {randomFruit.freshness}</li>
                        <li>상품가: {randomFruit.originalPrice}원</li>
                        <li>손상도: {randomFruit.damageRate}</li>
                        <li>할인율: {randomFruit.discountRate}</li>
                        <li>판매가: {randomFruit.salePrice}원</li>
                    </ul>
                </div>
                <div className="flex flex-col space-y-4 mt-6">
                    <Button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">
                        장바구니에 담기
                    </Button>
                    <Button onClick={handleSelectAgain} className="bg-red-500 text-white px-4 py-2 rounded">
                        과일 다시 고르기
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default FruitInfo;