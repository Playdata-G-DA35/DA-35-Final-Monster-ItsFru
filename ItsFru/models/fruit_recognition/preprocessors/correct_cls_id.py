def correct_cls_id(ann_dir):
    """
    ROBOFLOW 증강 후 클래스 ID가 변동되었을 경우 맞게 수정하는 함수 
    Args:
        ann_dir (str): 어노테이션 txt 파일이 든 경로
    """
    import os
    import glob
    from modules.get_category_id import get_category_id

    ann_files = glob.glob(os.path.join(ann_dir, '*.txt'))

    # 디렉토리 내의 모든 파일을 순회
    for file_path in ann_files:
        print(file_path)
        
        # category id 얻기
        fruit_type_list = os.path.basename(file_path).split('_')[:3] # 품목, 품종 전달
        category_id = str(get_category_id(fruit_type_list))

        # 파일 내용 읽기
        with open(file_path, 'r') as file:
            lines = file.readlines()

        # 잘못된 클래스 ID를 수정 
        new_lines = []
        for line in lines:
            parts = line.split()
            if len(parts[0]) == 1:#and len(parts[0]) == '1':  # 첫 번째 항목이 클래스 ID임을 확인
                if parts[0] != category_id:  # 클래스 ID가 틀리면
                    parts[0] = category_id
            new_lines.append(" ".join(parts) + '\n')

        # 변경된 내용으로 파일 덮어쓰기
        with open(file_path, 'w') as file:
            file.writelines(new_lines)

