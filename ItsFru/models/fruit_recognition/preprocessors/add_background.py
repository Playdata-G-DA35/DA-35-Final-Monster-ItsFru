def add_background(img_dir, output_dir, ann_pkl_path, bgr_pkl_path):
    """
    이미지에 랜덤 배경을 붙여서 저장하는 함수 
    Parameter
        img_dir : 이미지 경로 (train/val 하위 디렉토리 포함)
        output_dir : 배경 합성 이미지 저장할 경로
        ann_pkl_path : 어노테이션 딕셔너리 피클 경로
        bgr_pkl_path : 랜덤 배경 피클 경로
    Return 
    """
    import glob
    import cv2 
    import random 
    import matplotlib.pyplot as plt
    import numpy as np
    import os
    import pickle

    # 어노테이션 딕셔너리 로드
    with open(ann_pkl_path, "rb") as f:
        ann_dict = pickle.load(f)
    print(len(ann_dict),type(ann_dict))


    # 랜덤 배경 이미지피클  1000장 로드 
    with open(bgr_pkl_path, "rb") as f:
        random_backgrounds = pickle.load(f)
    print(len(random_backgrounds),type(random_backgrounds))


    # train과 val 하위 디렉토리 탐색
    for subset in ['train', 'val']:
        img_paths = glob.glob(os.path.join(img_dir, subset, '*\**.png'),recursive=True) 
        subset_output_dir = os.path.join(output_dir, subset, 'images')
        os.makedirs(subset_output_dir, exist_ok=True)

        for img_path in img_paths:
            file_name = os.path.basename(img_path)
            total_xy = ann_dict[file_name[:-4]]  # 해당 이미지의 좌표 (확장자 제거)
            points = np.array(total_xy)
            image = cv2.imread(img_path, cv2.IMREAD_COLOR)

            # 이미지 크기만큼의 빈 마스크 생성
            mask = np.zeros(image.shape[:2], dtype=np.uint8)

            # 다각형으로 마스크 설정
            cv2.fillPoly(mask, [points], 255)

            # 과일 마스크 부분만 추출
            fruit_masked = cv2.bitwise_and(image, image, mask=mask)

            # 배경 마스크 적용 (검은색으로)
            num = random.randint(0, len(random_backgrounds) - 1)
            background_masked = random_backgrounds[num].copy()  # 배경 이미지 복사
            background_masked[mask == 255] = [0, 0, 0]

            combined_img = cv2.bitwise_or(fruit_masked, background_masked)

            # 결과 저장
            cv2.imwrite(os.path.join(subset_output_dir, file_name), combined_img)
