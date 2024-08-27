import os
import cv2
import numpy as np
import random
import pickle
from albumentations import (
    Compose, HorizontalFlip, VerticalFlip, Rotate, HueSaturationValue, 
    RandomBrightnessContrast, GaussianBlur, GaussNoise
)
from albumentations.augmentations.geometric.transforms import ShiftScaleRotate


def load_images_from_folder(folder):
    images = []
    for filename in os.listdir(folder):
        img = cv2.imread(os.path.join(folder, filename))
        if img is not None:
            images.append(img)
    return images

def get_augmentation():
    
    return Compose([
        HorizontalFlip(p=0.5),
        VerticalFlip(p=0.5),
        Rotate(limit=90, p=0.5),  # 90도까지 회전
        # Rotate(limit=10, p=0.5),  # 만약 이 회전도 유지하고 싶다면 위와 구분
        HueSaturationValue(hue_shift_limit=20, sat_shift_limit=25, val_shift_limit=0, p=0.5),
        RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
        GaussianBlur(blur_limit=(7, 21), p=0.5),  
        GaussNoise(var_limit=(10.0, 55.0), p=0.5),
        ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=360, p=0.5)
    ])



def preprocess_image(image, target_size=640, scale_range=(0.1, 0.9)):    
    
    h, w, _ = image.shape
    
    # 크롭할 이미지의 크기 비율을 랜덤으로 설정
    scale = random.uniform(scale_range[0], scale_range[1])
    crop_h, crop_w = int(h * scale), int(w * scale)
    
    if crop_h > target_size and crop_w > target_size:
        top = random.randint(0, h - crop_h)
        left = random.randint(0, w - crop_w)
        image = image[top:top + crop_h, left:left + crop_w]
    
    # 최종 크기를 target_size로 리사이즈
    image = cv2.resize(image, (target_size, target_size))
    
    return image



# 랜덤 배경 생성
def generate_random_backgrounds(img_dir, output_dir, num_backgrounds=1000, target_size=640):

    images= load_images_from_folder(img_dir)

    augmented_images = []
    augment = get_augmentation()
    
    for _ in range(num_backgrounds):
        img = random.choice(images)
        preprocessed_img = preprocess_image(img, target_size)
        augmented_img = augment(image=preprocessed_img)['image']
        augmented_images.append(augmented_img)

    # output_dir이 존재하지 않으면 생성
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # pickle 파일 경로
    pkl_file_path = os.path.join(output_dir, 'random_background.pkl')
    
    # numpy 배열로 변환하여 pickle 파일로 저장
    with open(pkl_file_path, 'wb') as f:
        pickle.dump(augmented_images, f)


    return augmented_images
