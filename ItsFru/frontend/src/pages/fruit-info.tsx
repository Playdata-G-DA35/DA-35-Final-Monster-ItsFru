import React from 'react';
import Image from 'next/image';
import { Card, Button } from '@components';
import { useRouter } from 'next/router';
// import { useCart } from '@contexts/CartContext';
// import { useStore } from '@contexts/StoreContext';
// import { toast } from 'react-toastify';

const FruitInfo: React.FC = () => {
    const router = useRouter();
    // const { addAnalyzedFruitToCart } = useCart();
    // const { fruitAnalysis, currentStore } = useStore();

    // useEffect(() => {
    //     if (!fruitAnalysis || !currentStore) {
    //         toast.error('과일 분석 정보가 없습니다.');
    //         router.push('/fruit-select');
    //     }
    // }, [fruitAnalysis, currentStore, router]);

    // if (!fruitAnalysis || !currentStore) {
    //     return <div>Loading...</div>;
    // }

    const handleAddToCart = () => {
        // addAnalyzedFruitToCart(fruitAnalysis);
        router.push('/cart');
    };

    const handleSelectAgain = () => {
        router.push('/fruit-select');
    };

    const fruitAnalysis = {
        fruit_type: '사과',
        quality: '상',
        freshness: '중상',
        price: 4100,
        discount_rate: 0.14,
    };

    const discountedPrice = fruitAnalysis.price * (1 - fruitAnalysis.discount_rate);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">과일 분석 결과</h2>
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/images/result-apple.png"
                        alt="사과 이미지"
                        width={150}
                        height={150}
                        className="mb-4"
                    />
                    <ul className="text-lg">
                        <li>과일: {fruitAnalysis.fruit_type}</li>
                        <li>품질: {fruitAnalysis.quality}</li>
                        <li>신선도: {fruitAnalysis.freshness}</li>
                        <li>상품가: {fruitAnalysis.price.toLocaleString()}원</li>
                        <li>할인율: {(fruitAnalysis.discount_rate * 100).toFixed(1)}%</li>
                        <li>판매가: {discountedPrice.toLocaleString()}원</li>
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