### 이미지를 640으로 resize하고, 크롭하는 모듈 

import cv2
import os
from PIL import Image
import numpy as np


def resize_image(image, size=(640, 640)):
    """이미지를 리사이즈하는 함수."""
    return image.resize(size, Image.Resampling.LANCZOS)

def process_image(image_path, output_path, size=(640, 640)):
    """이미지를 리사이즈하여 저장하는 함수."""
    with Image.open(image_path) as img:
        # 이미지 리사이즈
        img_resized = resize_image(img, size)

        # 리사이즈된 이미지를 PIL 이미지로 변환
        img_resized.save(output_path)

def resize_and_save_images(base_folder, target_size=(640, 640), output_folder='processed_images'):
    """전처리하는 함수."""
    output_path = os.path.join(base_folder, '..', output_folder)
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    for root, dirs, files in os.walk(base_folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(root, file)
                relative_path = os.path.relpath(root, base_folder)
                output_subfolder = os.path.join(output_path, relative_path)

                if not os.path.exists(output_subfolder):
                    os.makedirs(output_subfolder)

                output_image_path = os.path.join(output_subfolder, file)

                # 이미지 전처리
                process_image(image_path, output_image_path, size=target_size)

                # 처리 중인 파일 출력
                print(f"Processing: {image_path} -> {output_image_path}")

def crop_and_save_images(img_dir, output_dir, crop_size=720, target_size=(640,640)):
    """
    이미지를 정사각형으로 크롭하고 원하는 크기로 리사이즈 하는 함수
    Args:
        img_dir (str): 이미지가 든 디렉토리 경로
        output_dir (str): 크롭, 리사이즈한 이미지를 저장할 디렉토리
        crop_size (int, optional): 이미지를 크롭할 사이즈 -> 이후 리사이즈 함
        target_size (int) : 리사이즈할 사이즈 
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # img_dir 디렉토리 내의 모든 파일을 탐색
    for filename in os.listdir(img_dir):
        # 이미지 경로 생성
        image_path = os.path.join(img_dir, filename)
        
        # 이미지 읽기
        img = cv2.imread(image_path)
        if img is None:
            print(f"Cannot read the image at {image_path}, skipping.")
            continue
        
        height, width, _ = img.shape
        
        if height == width:
            # 정사각형 이미지의 경우, 640x640으로 리사이즈
            resized_img = cv2.resize(img, target_size)
        else:
            # 중앙에서 크롭사이즈만큼 크롭할 좌표 계산
            center_x, center_y = width // 2, height // 2
            start_x = max(center_x - crop_size // 2, 0)
            start_y = max(center_y - crop_size // 2, 0)
            end_x = min(start_x + crop_size, width)
            end_y = min(start_y + crop_size, height)
            
            # 크롭된 이미지 추출
            cropped_img = img[start_y:end_y, start_x:end_x]
            
            # 크롭된 이미지가 640x640보다 작다면, 가장자리 부분을 패딩
            if cropped_img.shape[0] < target_size[0] or cropped_img.shape[1] < target_size[1]:
                # 검정색 패딩 추가
                padded_img = cv2.copyMakeBorder(
                    cropped_img,
                    top=0, bottom=max(0, target_size[0] - cropped_img.shape[0]),
                    left=0, right=max(0, target_size[1] - cropped_img.shape[1]),
                    borderType=cv2.BORDER_CONSTANT,
                    value=[0, 0, 0]  # 검정색 패딩
                )
                resized_img = padded_img
            else:
                resized_img = cv2.resize(cropped_img, target_size)
        
        # 출력 파일 경로 및 저장
        output_filename = os.path.splitext(filename)[0] + '.png'
        output_path = os.path.join(output_dir, output_filename)
        cv2.imwrite(output_path, resized_img)
        print(f"Saved cropped image to {output_path}")
