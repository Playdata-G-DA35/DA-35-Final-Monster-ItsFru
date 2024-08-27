
def ann_dictionary(ann_dir):
    """
    어노테이션 경로를 받아 key: 파일명, value : xy 좌표로 가지는 딕셔너리로 만들어 반환하는 함수

    Args:
        ann_dir (str): 어노테이션 파일이 있는 경로 
    Return:
        ann_dict : key - 파일명(확장자 제외) value - xy 좌표   
    """
    from modules.load_xy import load_xy
    import glob
    import os
    import pickle

    ann_paths=glob.glob(ann_dir+'/**/*.txt', recursive= True)
    
    ann_dict = {}
    for ann_path in ann_paths:
        file_name = os.path.basename(ann_path)[:-4] # 확장자 제거
        total_xy = load_xy(ann_path)
        ann_dict[file_name] = total_xy
    
    with open('ann_dict.pkl', 'wb') as f:
        pickle.dump(ann_dict,f)

    if os.path.isfile('ann_dict.pkl'):
        print("어노테이션 딕셔너리 생성 및 저장 완료")
    else:
        print("어노테이션 딕셔너리 생성 실패")
        
    return ann_dict 
