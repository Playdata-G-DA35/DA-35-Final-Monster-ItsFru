def reduce_mask_area(binary_mask, reduction_pixels):
    """
    이진 마스크 배열에서 윤곽을 기준으로 주어진 픽셀 수만큼 줄입니다.
    윤곽에서 일정한 두께만큼 내부로 축소됩니다.

    Parameters:
    - binary_mask: numpy array, 이진 마스크 배열 (0과 1로 구성, shape=(height, width, 1))
    - reduction_pixels: int, 줄이고자 하는 픽셀 수 (예: 1, 2)

    Returns:
    - reduced_mask: numpy array, 줄어든 범위의 이진 마스크 배열 (shape=(height, width, 1))
    """
    import cv2
    import numpy as np

    # 2D 이진 마스크로 변환
    binary_mask_2d = binary_mask[:, :].astype(np.uint8)  # 2D 이진 마스크로 변환

    # 거리 변환을 수행하여 마스크의 외곽에서의 거리 계산
    dist_transform = cv2.distanceTransform(binary_mask_2d, cv2.DIST_L2, 5)

    # 거리 변환을 기반으로 새로운 마스크를 생성
    # 축소된 영역을 0으로 만드는 마스크 생성
    reduced_mask_2d = (dist_transform > reduction_pixels).astype(np.uint8) * 255

    # 윤곽 추출
    contours, _ = cv2.findContours(reduced_mask_2d, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 윤곽을 원래 이진 마스크에 적용
    new_mask = np.zeros_like(binary_mask_2d, dtype=np.uint8)
    cv2.drawContours(new_mask, contours, -1, (255), thickness=cv2.FILLED)

    # 결과를 원래 shape에 맞게 변환
    reduced_mask = new_mask[:, :, np.newaxis].astype(np.uint8)


    # 가장 큰 윤곽선 선택 (여러 윤곽선이 있을 수 있으므로)
    if len(contours) > 0:
        largest_contour = max(contours, key=cv2.contourArea)
        
        # 균등하게 80개의 점을 선택 (윤곽선 점이 80개 미만일 경우 모두 선택)
        # step = max(1, len(largest_contour) // 80)
        selected_contour_points = largest_contour[::13].squeeze()[:80]

        # 좌표를 640으로 나누기
        normalized_contour_points = selected_contour_points / 640
        
        # 배열을 [ ] 없이 숫자 값만 들어가게 변환
        flat_contour_points = normalized_contour_points.flatten()
    else:
        flat_contour_points = np.array([])  # 윤곽선이 없을 경우 빈 배열

    return flat_contour_points
