def create_ann(img_dir, output_dir, model, dataset='val', reduction_pixels=5):
    """
    segmentation 결과, 클래스 정보를 받아 annotation txt 파일을 작성하는 함수

    Parameter
        img_dir : 이미지 디렉토리 경로
        output_dir : training / validation 경로 ? output을 저장할 경로
        model : segmentation 추론에 사용하는 모델
    output 
        output_log
        fail_list 
        annotations
    """
    import os
    import glob
    import sys
    import datetime
    from modules.get_category_id import get_category_id
    # from modules.get_mask import get_mask
    from modules.get_reduced_mask import get_reduced_mask
    from modules.re_annotate import re_annotate
    
    timestamp= datetime.datetime.now().strftime('%y%m%d_%H%M%S')

    os.makedirs(output_dir, exist_ok=True)
    sys.stdout = open(os.path.join(output_dir,f'output_log_{dataset}_{timestamp}.txt'), 'w')

    ann_dir = os.path.join(output_dir,f'annotations_{dataset}_{timestamp}')
    os.makedirs(ann_dir, exist_ok=True)

    img_paths=glob.glob(img_dir+'/**/*.png', recursive= True)
    fail_list = []

    for img_path in img_paths:

        # category id 얻기
        fruit_type_list = os.path.basename(img_path).split('_')[:3] # 품목, 품종 전달
        category_id = get_category_id(fruit_type_list)

        # mask 좌표 얻기  ; 모델 추론
        mask_txt, error_message = get_reduced_mask(img_path,model,reduction_pixels)

        # annotation txt 생성
        if mask_txt:
            # 객체인식 성공
            ann_txt = " ".join([str(category_id), mask_txt])
        else:
            # 객체인식 실패 - 카테고리 id만
            ann_txt = str(category_id)

        # 인식 실패 파일 모음 txt 생성
        if error_message:
            fail_list.append(error_message)


        # 어노테이션 파일 생성 및 기록
        file_name = os.path.basename(img_path).split('.')[0]+'.txt'
        with open(os.path.join(ann_dir, file_name),'w') as f:
            f.write(ann_txt)


    # 인식 실패 파일 생성 및 기록
    if len(fail_list) > 0:
        print("인식 실패 파일이 있습니다.")
        fail_txt =" ".join(str(a) for a in fail_list)
        fail_path = os.path.join(output_dir,f'fail_list_{dataset}_{timestamp}.txt')
        with open(fail_path,'w') as f:
            f.write((fail_txt))
        re_annotate(fail_path, dataset)

    else:
        print("인식 실패 파일이 없습니다.")


    # 파일 생성 확인
    print(f'{dataset} 어노테이션 파일 생성 완료 ')
    
    sys.stdout.close()


