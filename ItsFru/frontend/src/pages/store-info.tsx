import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@contexts/StoreContext';
import { useAuth } from '@contexts/AuthContext';
import { Tap, Spinner, ErrorMessage } from '@components';
import { toast } from 'react-toastify';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { storeId } = context.query;
  
  if (!storeId || Array.isArray(storeId)) {
    return {
      redirect: {
        destination: '/store-select',
        permanent: false,
      },
    };
  }

  return {
    props: { initialStoreId: storeId },
  };
};

interface StoreInfoProps {
  initialStoreId: string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ initialStoreId }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { 
    currentStore, 
    products, 
    notices, 
    fetchStoreInfo,
    fetchStoreProducts, 
    fetchStoreNotices, 
    exitStore,
    isLoading,
    setCurrentStore
  } = useStore();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoreData = async () => {
      if (!currentStore || currentStore.store_id !== Number(initialStoreId)) {
        setLocalLoading(true);
        try {
          setError(null);
          const token = getToken();
          if (!token) {
            throw new Error('Authentication required');
          }

          const storeInfo = await fetchStoreInfo(Number(initialStoreId), token);
          setCurrentStore(storeInfo);

          await Promise.all([
            fetchStoreProducts(Number(initialStoreId), token),
            fetchStoreNotices(Number(initialStoreId), token)
          ]);
        } catch (err) {
          console.error('Failed to load store data:', err);
          const errorMessage = '매장 정보를 불러오는데 실패했습니다. 에러: ' + (err instanceof Error ? err.message : String(err));
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLocalLoading(false);
        }
      } else {
        setLocalLoading(false);
      }
    };

    loadStoreData();
  }, [initialStoreId, currentStore, fetchStoreInfo, fetchStoreProducts, fetchStoreNotices, getToken, setCurrentStore]);

  const handleExitStore = async () => {
    exitStore();
    toast.info('안녕히 가세요!');
    try {
      await router.push('/store-select');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('페이지 이동 중 오류가 발생했습니다.');
    }
  };

  if (isLoading || localLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentStore) {
    return <ErrorMessage message="매장 정보를 불러올 수 없습니다." />;
  }

  const tabs = [
    {
      label: '공지사항',
      content: (
        <div>
          {notices.length > 0 ? (
            <ul>
              {notices.map((notice) => (
                <li key={notice.notice_id} className="border-b py-2">
                  <h3 className="font-bold">{notice.title}</h3>
                  <p>{notice.content}</p>
                  <small>{new Date(notice.created_at).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>공지사항이 없습니다.</p>
          )}
        </div>
      )
    },
    {
      label: '상품 정보',
      content: (
        <div>
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.store_product_id} className="border-b py-2">
                  <h3 className="font-bold">상품 ID: {product.product_id}</h3>
                  <p>가격: ${product.price}</p>
                  <p>재고: {product.available_stock}</p>
                  <p>업데이트: {new Date(product.updated_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>상품 정보가 없습니다.</p>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{currentStore.store_name}</h1>
        <button
          onClick={handleExitStore}
          className="bg-red-500 text-white px-4 py-2 rounded"
          aria-label="Exit store"
        >
          매장 나가기
        </button>
      </div>
      <p className="mb-4">{currentStore.location}</p>
      <Tap 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Store information tabs"
      />
    </div>
  );
};

export default StoreInfo;