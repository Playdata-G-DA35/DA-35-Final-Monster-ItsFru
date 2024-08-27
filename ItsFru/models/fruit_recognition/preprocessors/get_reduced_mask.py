# %load get_reduced_mask.py
## 모델 돌려 mask 좌표값 얻기
def get_reduced_mask(img_path, model,reduction_pixels):
    """
    이미지 파일 경로를 받으면 segmentation 모델 추론 결과 좌표를 리스트로 반환하는 함수
    Parameter
        img_path
        model

    return
        mask_txt : 마스크의 xy 좌표를 문자열로 반환

    """

    import os
    import cv2
    import time
    import numpy as np
    from modules.reduce_mask_area import reduce_mask_area
    
    # img = cv2.imread(img_path, cv2.IMREAD_COLOR)

    # result= model(img)[0]
    # current_time = time.time()
    # dir_name =f'runs_{current_time}'
    # save_dir = os.path.join('C:\classes\FINAL_PROJECT',dir_name)
    # img_name = os.path.basename(img_path)
    # result_image_path = os.path.join(save_dir, img_name)
    # result.save(filename=result_image_path)

    result = model(img_path, verbose=False, save=True)[0]
    
    mask_list =[]
    std_list =[]
    idx = None

    if result.masks:
        #객체인식 성공
        prev_bbox= 0

        # 과일인지 확인 - bbox 넓이 
        for i,boxes in enumerate(result.boxes):
            _,_,w,h = boxes.xywh[0]
            bbox_area = int(w*h.item())

            if bbox_area >= 80000:
                if idx is None or bbox_area > prev_bbox:
                  prev_bbox= bbox_area
                  idx = i
        print(idx,bbox_area, img_path)

        #과일 인식 성공
        if idx is not None:
            for i,mask in enumerate(result.masks.data):
                # maksk  (640,640) tensor 
                reduced_contour_points= reduce_mask_area(np.array(mask), reduction_pixels)
                mask_list.extend(reduced_contour_points)
            mask_txt =" ".join(str(a) for a in mask_list)
            return mask_txt, None
        else:
            # 과일 아닌 것 하나만 인식된 경우
            no_fruit= f'과일인식실패_{img_path}'
            print(no_fruit)
            return None, no_fruit

    else:
        no_object = f'객체인식실패_{img_path}'
        print(no_object)
        return None, str(no_object)

