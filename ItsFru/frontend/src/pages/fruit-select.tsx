import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ErrorMessage } from '@components';
import { useStore } from '@contexts/StoreContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

const FruitSelect: React.FC = () => {
    const [imageCaptured, setImageCaptured] = useState<boolean>(false);
    const router = useRouter();
    const { currentStore } = useStore();

    // useEffect(() => {
    //     if (!currentStore) {
    //         toast.error('매장을 먼저 선택해주세요.');
    //         router.push('/store-select');
    //         return;
    //     }

    //     const getCameraPermission = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             setCameraPermission(true);
    //             if (videoRef.current) {
    //                 videoRef.current.srcObject = stream;
    //             }
    //         } catch (error) {
    //             setCameraPermission(false);
    //             toast.error('카메라 사용 권한이 필요합니다.');
    //         }
    //     };

    //     getCameraPermission();

    //     return () => {
    //         if (videoRef.current && videoRef.current.srcObject) {
    //             const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //             tracks.forEach(track => track.stop());
    //         }
    //     };
    // }, [currentStore, router]);

    const handleCapture = () => {
        if (!currentStore) {
            toast.error('매장을 먼저 선택해주세요.');
            router.push('/store-select');
            return;
        }

        setImageCaptured(true);
        router.push('/fruit-info');
    };

    if (!currentStore) {
        return <ErrorMessage message="매장을 먼저 선택해주세요." />;
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">과일 선택</h1>
            <div className="relative w-full flex-grow">
                <Image
                    src="/images/sample-apple.png"
                    alt="Sample Apple"
                    layout="fill"
                    objectFit="contain"
                />
                {imageCaptured && (
                    <p className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        사진이 촬영되었습니다. 잠시만 기다려 주세요...
                    </p>
                )}
            </div>
            <button
                onClick={handleCapture}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
                disabled={imageCaptured || !currentStore}
            >
                사진 찍기
            </button>
        </div>
    );
};

export default FruitSelect;