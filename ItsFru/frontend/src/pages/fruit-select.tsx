import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from '@components'; // Spinner 컴포넌트 불러오기

const FruitSelect: React.FC = () => {
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const [imageCaptured, setImageCaptured] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                setCameraPermission(false);
                alert('카메라 사용 권한이 필요합니다.');
            }
        };

        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = async () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageData = canvasRef.current.toDataURL('image/png');
                setImageCaptured(true);

                // 이미지 업로드 및 분석 로직 (각주 처리)
                // const uploadAndAnalyzeImage = async (image: string) => {
                //     // S3 업로드 및 분석 서비스 호출 로직
                // };
                // await uploadAndAnalyzeImage(imageData);

                // 이미지 분석을 위한 대기 시간
                setIsProcessing(true);
                setTimeout(() => {
                    setIsProcessing(false);
                    router.push('/fruit-info');
                }, 1000); // 실제 대기 시간은 서비스의 처리 시간에 따라 다릅니다.
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">과일 선택</h1>
            {cameraPermission === null ? (
                <p>카메라 권한 요청 중...</p>
            ) : cameraPermission ? (
                <div className="relative w-full flex-grow">
                    {!imageCaptured && !isProcessing && (
                        <video
                            ref={videoRef}
                            autoPlay
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                    {isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                            <Spinner />
                            <p>사진을 분석 중입니다...</p>
                        </div>
                    )}
                    {imageCaptured && !isProcessing && (
                        <p className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            사진이 촬영되었습니다. 잠시만 기다려 주세요...
                        </p>
                    )}
                </div>
            ) : (
                <p>카메라 권한이 필요합니다.</p>
            )}
            <button
                onClick={handleCapture}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
                disabled={imageCaptured || isProcessing} // 버튼 비활성화 조건
            >
                사진 찍기
            </button>
        </div>
    );
};

export default FruitSelect;