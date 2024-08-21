import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@contexts/StoreContext';
import { Tap } from '@components';

interface Product {
  id: string;
  name: string;
  price: number;
}

const StoreInfo: React.FC = () => {
  const { currentStore, fetchStoreDetails, fetchProductList, exitStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (!currentStore) {
      router.push('/store-select');
    } else {
      const loadStoreData = async () => {
        try {
          // AWS RDS로부터 스토어 세부 정보를 가져오는 부분 (나중에 구현)
        } catch (error) {
          console.error('Failed to load store data:', error);
        }
      };
      loadStoreData();
    }
  }, [currentStore, fetchStoreDetails, fetchProductList, router]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleExitStore = () => {
    exitStore(); // 매장 정보 초기화
    alert('안녕히 가세요!');
    router.push('/main');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {currentStore ? currentStore.name : 'Loading...'}
        </h1>
        <button
          onClick={handleExitStore}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          매장 나가기
        </button>
      </div>
      <Tap 
        tabs={['공지사항', '상품 정보']}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <div>
          {/* 공지사항 콘텐츠 */}
          <p>여기에 공지사항이 표시됩니다.</p>
        </div>
        <div>
          {/* 상품 정보 콘텐츠 */}
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.id} className="border-b py-2">
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>상품 정보가 없습니다.</p>
          )}
        </div>
      </Tap>
    </div>
  );
};

export default StoreInfo;