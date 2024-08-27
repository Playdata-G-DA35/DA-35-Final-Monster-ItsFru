def re_annotate(fail_txt_path, dataset = 'val' ):
    """과일인식실패(면적)/ 객체인식실패 파일을
    다른 폴더로 옮겨서 reannotation 할 수 있도록 함.

    Args:
        fail_txt_path (str): 인식 실패 파일 경로를 str으로 받음
        
    """

    import os 
    import shutil
    import datetime

    with open(fail_txt_path, 'r') as f:
        fail_txt = f.read()

    if len(fail_txt) > 0:
        timestamp= datetime.datetime.now().strftime('%y%m%d_%H%M%S')
        fail_list = fail_txt.split(' ')
        fail_paths = [path[7:] for path in fail_list]
        reann_dir = os.path.join(os.path.dirname(fail_txt_path),f're_ann_{dataset}_{timestamp}')
        os.makedirs(reann_dir,exist_ok =True)

        for fail_path in fail_paths:
            file_name = os.path.basename(fail_path)
            dest_path = os.path.join(reann_dir, file_name)
            shutil.copy(fail_path, dest_path)
        print('이미지 파일이 모두 이동했습니다.',len(fail_paths), len(os.listdir(reann_dir)))
    else:
        pass

    
    

