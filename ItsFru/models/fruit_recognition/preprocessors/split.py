def split_images_and_annotations(input_dir, output_dir, annotations_folder, ratio=(0.9, 0.1)):
    """
    이미지와 어노테이션 파일을 분할하여 각각의 폴더에 저장하는 함수
    """
    import splitfolders
    import os 
    import shutil
    
    img_dir = os.path.join(input_dir, 'images')
    
    # 이미지를 분할하여 split/images에 저장
    img_output_dir = os.path.join(output_dir, 'images')
    splitfolders.ratio(img_dir, output=img_output_dir, seed=42, ratio=ratio, group_prefix=None, move=False)

    # 어노테이션 파일을 split/annotations에 같은 구조로 복사
    anno_output_dir = os.path.join(output_dir, 'annotations')

    for split_type in ['train', 'val']:
        img_split_folder = os.path.join(img_output_dir, split_type)
        anno_split_folder = os.path.join(anno_output_dir, split_type)

        for root, _, files in os.walk(img_split_folder):

            for file in files:
                # 이미지 파일명에서 확장자를 제거
                filename, _ = os.path.splitext(file)
                
                # 동일한 이름의 어노테이션 파일 찾기
                anno_file = os.path.join(annotations_folder, filename + '.txt')

            #     # 어노테이션 파일이 존재하는 경우
                if os.path.exists(anno_file):
            #         # 어노테이션 파일을 타겟 폴더로 복사
            #         relative_path = os.path.relpath(root, img_split_folder)
            #         target_folder = os.path.join(anno_split_folder, relative_path)

                    if not os.path.exists(anno_split_folder):
                        os.makedirs(anno_split_folder)

                    shutil.copy(anno_file, anno_split_folder)
